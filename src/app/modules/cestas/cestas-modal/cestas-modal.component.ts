import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CestaBasica } from 'src/app/shared/models/cesta-basica';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MensagemBarraService } from 'src/app/core/services/mensagem-barra/mensagem-barra.service';
import { CestasBasicasService } from 'src/app/core/services/corrente-brasilia/cestas-basicas/cestas-basicas.service';
import { consolelog } from 'src/app/shared/utils/mylibs';

@Component({
  selector: 'app-cestas-modal',
  templateUrl: './cestas-modal.component.html',
  styleUrls: ['./cestas-modal.component.css']
})
export class CestasModalComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<CestaBasica>

  constructor(
    public dialogRef: MatDialogRef<CestaBasica>,
    private cestasBasicasService: CestasBasicasService,
    private mensagem: MensagemBarraService,
    @Inject(MAT_DIALOG_DATA) private data: {
      cestas: CestaBasica[],
      nome: string
    }
  ) { }

  nome: string;
  cestasDaFamilia: MatTableDataSource<CestaBasica>;
  displayedColumns: string[] = [
    'voluntario', 'data', 'acao_direita'
  ]

  ngOnInit(): void {
    this.recuperarCestas();
    this.nome = this.data.nome;
  }

  private recuperarCestas() {
    if (!this.cestasDaFamilia) {
      this.inicializaDataSource();
    }
    this.cestasDaFamilia.data = this.data.cestas;
  }

  private inicializaDataSource() {
    this.cestasDaFamilia = new MatTableDataSource<CestaBasica>();
  }

  excluirCesta(element: CestaBasica) {
    console.log('cesta a excluir: ', element);
    if (confirm(`Confirma a exclusão da cesta entregue à família de "${this.data.nome}" ?`)) {
      const cesta: CestaBasica = element;
      this.cestasBasicasService.excluirCestaBasica(cesta)
      .subscribe((data) => {
          this.mensagem.sucesso('Entrega da cesta básica excluída !!!')
          const dataPrev = this.cestasDaFamilia.data.filter((cesta: CestaBasica) => {
            return cesta != element;
          });
          this.cestasDaFamilia.data = dataPrev;
        },
          error => {
            this.mensagem.erro('Erro ao tentar excluir a cesta básica !!!');
            consolelog('erro ao excluir família: ', error);
          })

    } else {
      this.mensagem.info('Cesta não foi excluída !!!');
    }
  }

  incluirCesta() {
    this.mensagem.emBreve()
  }

  voltar() {
    this.dialogRef.close(this.cestasDaFamilia.data);
  }

}
