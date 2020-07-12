import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FamiliasEmergencialService } from 'src/app/core/services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { CestasBasicasService } from 'src/app/core/services/corrente-brasilia/cestas-basicas/cestas-basicas.service';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { FamiliaEmergencialCestasBasicasService } from 'src/app/core/services/corrente-brasilia/cestas-basicas/familia-emergencial-cestas-basicas.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FamiliaModalComponent } from '../familia-modal/familia-modal/familia-modal.component';
import { MensagemBarraService } from 'src/app/core/services/mensagem-barra/mensagem-barra.service';
import { EncaminharModalComponent } from '../encaminhar-modal/encaminhar-modal.component';
import { consolelog } from 'src/app/shared/utils/mylibs';
import { CestasModalComponent } from '../cestas-modal/cestas-modal.component';
import { FamiliasExcluidasService } from 'src/app/core/services/corrente-brasilia/familias-excluidas/familias-excluidas.service';
import { PlatformDetectorService } from 'src/app/core/plataform-detector/platform-detector.service';
import { element } from 'protractor';


@Component({
  selector: 'app-listar-familias-cestas',
  templateUrl: './listar-familias-cestas.component.html',
  styleUrls: ['./listar-familias-cestas.component.css']
})
export class ListarFamiliasCestasComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  sortBy: any;

  constructor(
    private familiaEmergencialService: FamiliasEmergencialService,
    private familiasExcluidasService: FamiliasExcluidasService,
    private cestasDaFamiliaService: FamiliaEmergencialCestasBasicasService,
    private mensagem: MensagemBarraService,
    private isBrowser: PlatformDetectorService,
    private dialog: MatDialog,

  ) { }

  familiasCestas: MatTableDataSource<FamiliaEmergencial>;
  cpfsDuplicados: string[];
  displayedColumns: string[] = [
    'acao', 'nome', 'cpf', 'data', 'cidade', 'status', 'qtcestas', 'acao_direita'
  ]

  waiting: boolean;
  pageEvent: PageEvent;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  ngOnInit(): void {
    this.recuperarFamilias();
    consolelog('isbrowser: ', this.isBrowser.isPlatformBrowser());
  }

  recuperarFamilias() {

    this.waiting = true;
    this.cestasDaFamiliaService.recuperarFamiliaEmergencialECestas()
      .subscribe((data: FamiliaEmergencial[]) => {
        consolelog('data: ', data);
        this.waiting = false;
        this.verificarCpfDuplicado(data);
        this.atualizarFamilias(data);
      })
  }

  /*
   * a partir dos dados recebidos recupera as cestas da família e atualiza o datasource
   */
  private atualizarFamilias(data: FamiliaEmergencial[]) {
    consolelog('atualizar familias');
    if (!this.familiasCestas) {
      this.inicializaFamiliaCestas();
    };

    this.familiasCestas.data = data;

  }

  getStatus(status: number): string {
    switch (status) {
      case 6:
        return 'Fila de atendimento';
        break;

      case 4:
        return 'Encaminhado';
        break;

      case 7:
        return 'Normal (novo)';
        break;

      case 5:
        return 'Em atendimento';
        break;

      default:
        return 'Normal'
        break;
    }

  }

  /*
   * Inicializa o datasource FamiliaCestas e associa o paginator
   */
  private inicializaFamiliaCestas() {
    this.familiasCestas = new MatTableDataSource<FamiliaEmergencial>([]);
    this.familiasCestas.sort = this.sort;
    this.familiasCestas.paginator = this.paginator;
    this.customSort();
    this.customFilter();
  }

  incluirFamilia(){
    let novaFamilia: FamiliaEmergencial = {};
    this.detalharFamilia(novaFamilia);
  }

  detalharFamilia(elemento: FamiliaEmergencial) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { familia: elemento };
    dialogConfig.width = "900px";

    const dialogRef = this.dialog.open(FamiliaModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe((result: FamiliaEmergencial | null) => {
        consolelog('result: ', result);
        consolelog('codfamilia: ', result.codfamilia);
        if (result) {
          this.atualizaFamiliaNoDatasource(result);
        }
      })
  }

  encaminharFamilia(elemento: FamiliaEmergencial) {



    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { familia: elemento };
    dialogConfig.width = "900px";

    const dialogRef = this.dialog.open(EncaminharModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        consolelog('result: ', result);
        if (result) {
          this.atualizaFamiliaNoDatasource(result);
        }
      })

  }

  private atualizaFamiliaNoDatasource(result: FamiliaEmergencial | undefined) {
    const dataPrev: FamiliaEmergencial[] = this.familiasCestas.data;
    let index = dataPrev.findIndex(familiaCesta => familiaCesta.codfamilia == result.codfamilia);
    if (index != -1) {
      dataPrev[index] = result;
    } else {
      dataPrev.unshift(result);
      // this.mensagem.exibeMensagemBarra('Não foi possível atualizar dados do grid. Recarregue a página.');
    }
    this.familiasCestas.data = dataPrev;
  }

  private excluirFamiliaNoDatasource(result: FamiliaEmergencial | undefined) {
    const dataPrev: FamiliaEmergencial[] = this.familiasCestas.data;
    let index = dataPrev.findIndex(familiaCesta => familiaCesta.codfamilia == result.codfamilia);
    if (index != -1) {
      dataPrev.splice(index, 1);
      this.familiasCestas.data = dataPrev;
    } else {
      this.mensagem.exibeMensagemBarra('Não foi possível atualizar dados do grid. Recarregue a página.');
    }
  }

  detalharCestas(elemento: FamiliaEmergencial) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      cestas: elemento.cestasBasicasDaFamilia,
      nome: elemento.nome,
      codfamilia: elemento.codfamilia
    };
    dialogConfig.minWidth = "50vw";
    dialogConfig.maxWidth = "65vw";
    dialogConfig.maxHeight = "80vh";

    console.log('cestas: ', elemento.cestasBasicasDaFamilia);

    const dialogRef = this.dialog.open(CestasModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!result) { return };
        const dataPrev: FamiliaEmergencial[] = this.familiasCestas.data;
        let index = dataPrev.findIndex(familiaCesta => familiaCesta.codfamilia == elemento.codfamilia);
        if (index != -1) {
          dataPrev[index].cestasBasicasDaFamilia = result;
          this.familiasCestas.data = dataPrev;
        } else {
          this.mensagem.info('Não foi possível atualizar dados. Recarregue a página.');
        }
        consolelog('result: ', result);
      })

  }

  excluirFamilia(elemento) {
    if (confirm("Confirma a exclusão da família ? ")) {
      const familia: FamiliaEmergencial = this.normalizaFamilia(elemento);
      this.familiasExcluidasService.gravarFamiliaExcluida(familia)
        .subscribe((data: FamiliaEmergencial) => {
          this.familiaEmergencialService.excluirFamiliaEmergencial(familia)
            .subscribe(
              () => {
                this.excluirFamiliaNoDatasource(familia);
                this.mensagem.info('Família foi excluída !!!');
              },
              error => consolelog('erro: ', error)
            )
        },
          error => {
            this.mensagem.erro('Erro ao tentar excluir família emergencial !!!');
            consolelog('erro ao excluir família: ', error);
          })

    } else {
      this.mensagem.info('Família não foi excluída !!!');
    }
  }


  menuGrid() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.familiasCestas.filter = filterValue.trim().toLowerCase();
  }

  cancelarEncaminhamento(element: FamiliaEmergencial) {
    if (confirm("A família voltará para a Fila de Atendimento. Confirma ?")) {
      const familia: FamiliaEmergencial = element;
      familia.status = 6; // fila de espera
      familia.dataAtualizacao = new Date().toISOString();
      this.familiaEmergencialService.atualizarFamiliaEmergencial(familia)
        .subscribe(
          () => {
            this.atualizaFamiliaNoDatasource(familia);
          },
          error => consolelog('erro: ', error)
        )
    } else {
      this.mensagem.exibeMensagemBarra('Encaminhamento não cancelado !!!', 'sucesso', 2000);
    }
  }

  sortColumn($event: Sort) {
    consolelog($event);
  }


  customSort() {
    this.familiasCestas.sortingDataAccessor = (item, property) => {
      // consolelog('item: ' + JSON.stringify(item) + ' ' + ' property: ' + property);
      switch (property) {
        case 'status': {
          return this.getStatus(item.status);
        }
        case 'qtcestas': {
          return item.cestasBasicasDaFamilia ? item.cestasBasicasDaFamilia.length : 0;
        }
        default: {
          return item[property];
        }
      }
    };
  }

  customFilter() {
    this.familiasCestas.filterPredicate = (data: FamiliaEmergencial, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce(
        (currentTerm: string, key: string) => {
          // consolelog( 'current: ', currentTerm);
          // consolelog( 'key: ', key);
          // consolelog( 'datai: ', (data as { [key: string]: any })[key]);
          if (['nome', 'cpf', 'status', 'cidade'].includes(key)) {
            let termo: string;
            if (key === 'status') {
              termo = this.getStatus(data.status);
            } else {
              termo = (data as { [key: string]: any })[key];
            }
            return (currentTerm + termo + '◬');
            // return (currentTerm + (data as { [key: string]: any })[key] + '◬');
          }
          return currentTerm;

        }, '')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  verificarCpfDuplicado(data: FamiliaEmergencial[]) {
    this.cpfsDuplicados = [];
    data.filter((familia: FamiliaEmergencial, index) => {
      if (!familia.cpf || familia.cpf.trim() == '') { return; }
      let idx = data.findIndex(x => x.cpf == familia.cpf);
      if (idx != index) {
        if (this.cpfsDuplicados.indexOf(familia.cpf) == -1) {
          this.cpfsDuplicados.push(familia.cpf);
        }
      }
    })
  }

  cpfDuplicado(cpf: string): boolean {
    return this.cpfsDuplicados.indexOf(cpf) != -1;
  }

  private normalizaFamilia(familia: FamiliaEmergencial): FamiliaEmergencial {
    familia.nis = familia.nis || '';
    familia.status_emprego = familia.status_emprego || '';
    familia.datanasc2 = familia.datanasc2 || '';
    familia.data_nasc_conjuge = familia.data_nasc_conjuge || '';
    familia.cpf_conjuge = familia.cpf_conjuge || '';
    familia.deseja_msg = !!familia.deseja_msg;
    familia.deseja_aux_espiritual = !!familia.deseja_aux_espiritual;
    return familia;
  }

}


