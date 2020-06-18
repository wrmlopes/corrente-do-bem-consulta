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
    private cestasBasicasService: CestasBasicasService,
    private cestasDaFamiliaService: FamiliaEmergencialCestasBasicasService,
    private mensagem: MensagemBarraService,
    private dialog: MatDialog,

  ) { }

  familiasCestas: MatTableDataSource<FamiliaEmergencial>;
  displayedColumns: string[] = [
    'acao', 'nome', 'cpf', 'data', 'status', 'qtcestas', 'acao_direita'
  ]

  waiting: boolean;
  pageEvent: PageEvent;
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  ngOnInit(): void {
    this.recuperarFamilias();
  }

  recuperarFamilias() {

    this.waiting = true;
    this.cestasDaFamiliaService.recuperarFamiliaEmergencialECestas()
      .subscribe((data: FamiliaEmergencial[]) => {
        consolelog('data: ', data);
        this.waiting = false;
        this.atualizarFamilias(data);
      })
  }

  /*
   * a partir dos dados recebidos recupera as cestas da família e atualiza o datasource
   */
  private atualizarFamilias(data: FamiliaEmergencial[]) {
    if (!this.familiasCestas) {
      this.inicializaFamiliaCestas();
    };

    this.familiasCestas.data = data;

    // data.map((familia: FamiliaEmergencial) => {
    //   this.cestasDaFamiliaService.recuperarCestasBasicasDeFamiliaEmergencial(familia.codfamilia)
    //     .subscribe((cestas: CestaBasica[]) => {
    //       let dataPrev = this.familiasCestas.data;
    //       dataPrev.push({
    //         codfamilia: familia.codfamilia,
    //         nome: familia.nome,
    //         cpf: familia.cpf,
    //         data: familia.data,
    //         qtcestas: cestas.length,
    //         status: this.getStatus(familia.status),
    //         cestas,
    //         familia,
    //       });
    //       this.familiasCestas.data = dataPrev;

    //     })
    // });

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

  detalharFamilia(elemento: FamiliaEmergencial) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { familia: elemento };
    dialogConfig.width = "900px";

    const dialogRef = this.dialog.open(FamiliaModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        consolelog('result: ', result);
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
      nome: elemento.nome
     };
    dialogConfig.width = "700px";

    const dialogRef = this.dialog.open(CestasModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        consolelog('result: ', result);
      })

  }

  excluirFamilia(elemento) {
    this.mensagem.emBreve();
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
          if (['nome', 'cpf', 'status'].includes(key)) {
            let termo: string;
            if (key === 'status') {
              termo = this.getStatus( data.status );
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

}


