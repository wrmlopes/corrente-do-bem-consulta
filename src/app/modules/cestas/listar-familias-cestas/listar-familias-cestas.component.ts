import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FamiliasEmergencialService } from 'src/app/core/services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { CestasBasicasService } from 'src/app/core/services/corrente-brasilia/cestas-basicas/cestas-basicas.service';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { CestaBasica } from 'src/app/shared/models/cesta-basica';
import { FamiliaEmergencialCestasBasicasService } from 'src/app/core/services/corrente-brasilia/cestas-basicas/familia-emergencial-cestas-basicas.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FamiliaModalComponent } from '../familia-modal/familia-modal/familia-modal.component';
import { MensagemBarraService } from 'src/app/core/services/mensagem-barra/mensagem-barra.service';
import { EncaminharModalComponent } from '../encaminhar-modal/encaminhar-modal.component';


interface FamiliaCestas {
  codfamilia: number,
  nome: string,
  cpf: string, 
  data: string,
  status: string,
  qtcestas: number,
  cestas?: CestaBasica[]
  familia?: FamiliaEmergencial,
}

@Component({
  selector: 'app-listar-familias-cestas',
  templateUrl: './listar-familias-cestas.component.html',
  styleUrls: ['./listar-familias-cestas.component.css']
})
export class ListarFamiliasCestasComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private familiaEmergencialService: FamiliasEmergencialService,
    private cestasBasicasService: CestasBasicasService,
    private cestasDaFamiliaService: FamiliaEmergencialCestasBasicasService,
    private changeDetectorRefs: ChangeDetectorRef,
    private mensagem: MensagemBarraService,
    private dialog: MatDialog,

  ) { }

  familiasCestas: MatTableDataSource<FamiliaCestas>;
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
    this.familiaEmergencialService.recuperarFamiliasEmergencial()
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
    if (!this.familiasCestas) {
      this.inicializaFamiliaCestas();
    };

    data.map((familia: FamiliaEmergencial) => {
      this.cestasDaFamiliaService.recuperarCestasBasicasDeFamiliaEmergencial(familia.codfamilia)
        .subscribe((cestas: CestaBasica[]) => {
          let dataPrev = this.familiasCestas.data;
          dataPrev.push({
            codfamilia: familia.codfamilia,
            nome: familia.nome,
            cpf: familia.cpf,
            data: familia.data,
            qtcestas: cestas.length,
            status: this.getStatus(familia.status),
            cestas,
            familia,
          });
          this.familiasCestas.data = dataPrev;

        })
    });

  }

  getStatus( status: number ): string {
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
    this.familiasCestas = new MatTableDataSource<FamiliaCestas>([]);
    this.familiasCestas.sort = this.sort;
    this.familiasCestas.paginator = this.paginator;
  }

  detalharFamilia(elemento: FamiliaCestas){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { familia: elemento.familia };
    dialogConfig.width = "900px";

    const dialogRef = this.dialog.open(FamiliaModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log('result: ', result);
        if (result) {
          this.atualizaFamiliaNoDatasource(result);
        }
      })
  }

  encaminharFamilia(elemento: FamiliaCestas){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { familia: elemento.familia };
    dialogConfig.width = "900px";

    const dialogRef = this.dialog.open(EncaminharModalComponent, dialogConfig);

    dialogRef.afterClosed()
      .subscribe(result => {
        console.log('result: ', result);
        if (result) {
          this.atualizaFamiliaNoDatasource(result);
        }
      })

  }

  private atualizaFamiliaNoDatasource(result: FamiliaEmergencial | undefined) {
    const dataPrev: FamiliaCestas[] = this.familiasCestas.data;
    let index = dataPrev.findIndex( familiaCesta => familiaCesta.familia.codfamilia == result.codfamilia);
    if (index != -1) {
      dataPrev[index].codfamilia = result.codfamilia;
      dataPrev[index].nome = result.nome;
      dataPrev[index].cpf = result.cpf;
      dataPrev[index].data = result.data;
      dataPrev[index].status = this.getStatus(result.status);
      dataPrev[index].familia = result;
      this.familiasCestas.data = dataPrev;
    } else {
      this.mensagem.exibeMensagemBarra('Não foi possível atualizar dados do grid. Recarregue a página.');
    }
  }

  detalharCestas(elemento){
    this.emBreve();
  }

  private emBreve() {
    this.mensagem.exibeMensagemBarra('Estamos trabalhando nisso. Aguarde !!!', 'sucesso');
  }

  menuGrid(){
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.familiasCestas.filter = filterValue.trim().toUpperCase();
  }

  cancelarEncaminhamento(element: FamiliaCestas) {
    if (confirm("A família voltará para a Fila de Atendimento. Confirma ?")) {
      const familia: FamiliaEmergencial = element.familia;
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

}
