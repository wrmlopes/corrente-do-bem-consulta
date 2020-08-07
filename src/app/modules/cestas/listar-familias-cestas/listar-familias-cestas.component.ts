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
import { validaCpf } from 'src/app/shared/utils/mylibs';
import { CestasModalComponent } from '../cestas-modal/cestas-modal.component';
import { FamiliasExcluidasService } from 'src/app/core/services/corrente-brasilia/familias-excluidas/familias-excluidas.service';
import { PlatformDetectorService } from 'src/app/core/plataform-detector/platform-detector.service';
import { ReprovarModalComponent } from '../reprovar-modal/reprovar-modal.component';
import { LocaisEntregaService } from 'src/app/core/services/corrente-brasilia/locais-entrega/locais-entrega.service';
import { LocaisEntrega } from 'src/app/shared/models/locais-entrega.model';


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
    private locaisEntregaService: LocaisEntregaService,
    private mensagem: MensagemBarraService,
    private isBrowser: PlatformDetectorService,
    private dialog: MatDialog,

  ) { }

  familiasCestas: MatTableDataSource<FamiliaEmergencial>;
  cpfsDuplicados: string[];
  cpfsIncorretos: string[];
  displayedColumns: string[] = [
    'nome', 'cpf', 'data', 'cidade', 'locaisEntrega', 'status', 'qtcestas', 'acao'
  ]

  locaisDeEntrega: LocaisEntrega[] = [];

  waiting: boolean;
  pageEvent: PageEvent;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  ngOnInit(): void {
    this.recuperarLocaisEntrega();
    this.recuperarFamilias();
    console.log('isbrowser: ', this.isBrowser.isPlatformBrowser());
  }

  private recuperarLocaisEntrega() {
    this.locaisEntregaService.recuperarLocaisEntrega()
      .subscribe((locais: LocaisEntrega[]) => {
        this.locaisDeEntrega = locais;
        console.log('locais: ', locais);
      },
        error => {
          console.log('Erro ao recuperar locais de entrega');
        })
  }

  recuperarFamilias() {

    this.waiting = true;
    this.cestasDaFamiliaService.recuperarFamiliaEmergencialECestas()
      .subscribe((data: FamiliaEmergencial[]) => {
        console.log('data: ', data);
        this.waiting = false;
        this.atualizarFamilias(data);
      })
  }

  /*
   * a partir dos dados recebidos recupera as cestas da família e atualiza o datasource
   */
  private atualizarFamilias(data: FamiliaEmergencial[]) {
    this.atualizarInconsistências(data);
    if (!this.familiasCestas) {
      this.inicializaFamiliaCestas();
    };

    this.familiasCestas.data = data;

  }

  private atualizarInconsistências(data: FamiliaEmergencial[]) {
    this.verificarCpfDuplicado(data);
    this.verificarCpfsIncorretos(data);
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

      case -7:
        return 'Reprovada';
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

  incluirFamilia() {
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
        console.log('result: ', result);
        console.log('codfamilia: ', result?.codfamilia);
        if (result) {
          // this.atualizaFamiliaNoDatasource(result);
          this.recuperarFamilias();
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
    this.atualizarInconsistências(this.familiasCestas.data);
  }

  private excluirFamiliaNoDatasource(result: FamiliaEmergencial | undefined) {
    const dataPrev: FamiliaEmergencial[] = this.familiasCestas.data;
    let index = dataPrev.findIndex(familiaCesta => familiaCesta.codfamilia == result.codfamilia);
    if (index != -1) {
      dataPrev.splice(index, 1);
      this.familiasCestas.data = dataPrev;
      this.atualizarInconsistências(this.familiasCestas.data);
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
    dialogConfig.maxHeight = "90vh";

    const dialogRef = this.dialog.open(CestasModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        if (!result) { return };
        const dataPrev: FamiliaEmergencial[] = this.familiasCestas.data;
        let index = dataPrev.findIndex(familiaCesta => familiaCesta.codfamilia == elemento.codfamilia);
        if (index != -1) {
          dataPrev[index].cestasBasicasDaFamilia = result;
          this.familiasCestas.data = dataPrev;
          this.recuperarFamilias();
        } else {
          this.mensagem.info('Não foi possível atualizar dados. Recarregue a página.');
        }
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
              error => console.log('erro: ', error)
            )
        },
          error => {
            this.mensagem.erro('Erro ao tentar excluir família emergencial !!!');
            console.log('erro ao excluir família: ', error);
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
          error => console.log('erro: ', error)
        )
    } else {
      this.mensagem.exibeMensagemBarra('Encaminhamento não cancelado !!!', 'sucesso', 2000);
    }
  }

  sortColumn($event: Sort) {
    console.log($event);
  }


  customSort() {
    this.familiasCestas.sortingDataAccessor = (item, property) => {
      // console.log('item: ' + JSON.stringify(item) + ' ' + ' property: ' + property);
      switch (property) {
        case 'status': {
          return this.getStatus(item.status);
        }
        case 'locaisEntrega': {
          return this.getStatus(item.localEntregaId);
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
          // console.log( 'current: ', currentTerm);
          // console.log( 'key: ', key);
          // console.log( 'datai: ', (data as { [key: string]: any })[key]);
          if (['nome', 'cpf', 'status', 'localEntregaId'].includes(key)) {
            let termo: string;
            if (key === 'status') {
              termo = this.getStatus(data.status);
            } else if (key ==='localEntregaId') {
              termo = this.getLocalEntrega(data.localEntregaId);
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
    console.log('fim verifica duplicados');
  }

  verificarCpfsIncorretos(data: FamiliaEmergencial[]) {
    this.cpfsIncorretos = [];
    data.filter((familia: FamiliaEmergencial) => {
      if (!familia.cpf || familia.cpf.trim() == '') { return; }

      if (!validaCpf(familia.cpf)) {
        this.cpfsIncorretos.push(familia.cpf);
      }
    })
    console.log('fim verifica incorretos');
  }

  cpfDuplicado(cpf: string): string | null {
    let msg = '';

    if (this.cpfsDuplicados.indexOf(cpf) != -1) {
      msg += 'CPF duplicado !!! ';
    }

    if (!cpf || cpf == '' || this.cpfsIncorretos.indexOf(cpf) != -1) {
      msg = msg ? msg + '\n' : msg;
      msg += 'CPF inválido !!!';
    }

    return msg;
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

  reprovarFamilia(elemento: FamiliaEmergencial) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { familia: elemento };
    dialogConfig.width = "900px";

    const dialogRef = this.dialog.open(ReprovarModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log('result: ', result);
        if (result) {
          this.recuperarFamilias();
        }
      })

  }


  aprovarFamilia(familia: FamiliaEmergencial) {
    if (confirm("Confirma a aprovação da família ? ")) {
      const familiaNormal: FamiliaEmergencial = this.normalizaFamilia(familia);
      this.familiaEmergencialService.aprovarFamiliaEmergencial(familia)
        .subscribe(
          () => {
            this.mensagem.info('Situação da família alterada para aprovada !!!');
            this.recuperarFamilias();
          },
          error => console.log('erro: ', error)
        )
    } else {
      this.mensagem.info('Situação da família não foi alterada !!!');
    }
  }

  getTitleStatus(familia: FamiliaEmergencial){
    return (familia.status == -7) ? familia.motivoReprovar : 
       (familia.status == 4 ) ? familia.voluntario : '';
  }

  getLocalEntrega(localEntregaId): string {
    if (!this.locaisDeEntrega) { return localEntregaId; }

    let localEntrega = this.locaisDeEntrega.filter((local: LocaisEntrega) => local.localEntregaId == localEntregaId);
    
    return localEntrega.length > 0 ? localEntrega[0].nome: '';
  }

}


