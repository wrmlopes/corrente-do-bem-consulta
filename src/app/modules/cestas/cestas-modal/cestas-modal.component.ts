import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CestaBasica } from 'src/app/shared/models/cesta-basica';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MensagemBarraService } from 'src/app/core/services/mensagem-barra/mensagem-barra.service';

@Component({
  selector: 'app-cestas-modal',
  templateUrl: './cestas-modal.component.html',
  styleUrls: ['./cestas-modal.component.css']
})
export class CestasModalComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<CestaBasica>

  constructor(
    public dialogRef: MatDialogRef<CestaBasica>,
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

  excluirCesta(element) {
    this.mensagem.emBreve()
  }

  incluirCesta() {
    this.mensagem.emBreve()
  }

  voltar() {
    this.dialogRef.close(this.cestasDaFamilia.data);
  }

}
