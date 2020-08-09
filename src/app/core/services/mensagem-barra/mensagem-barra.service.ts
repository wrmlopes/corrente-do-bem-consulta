import { Injectable } from '@angular/core';
import {
  MatSnackBar, MatSnackBarConfig, MatSnackBarRef,
  MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MensagemBarraService {

  snackBarConfig: MatSnackBarConfig;
  snackBarRef: MatSnackBarRef<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  snackBarAutoHide = 3000;

  constructor(private snackBar: MatSnackBar) { }

  exibeMensagemBarra(message, tipo = 'sucesso', duracao = this.snackBarAutoHide) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.horizontalPosition = 'center';
    this.snackBarConfig.verticalPosition = 'top';
    this.snackBarConfig.duration = duracao;
    this.snackBarConfig.panelClass = `snack-${tipo}`;
    this.snackBarRef = this.snackBar.open(message, 'x', this.snackBarConfig);
  }

  sucesso(mensagem, duracao: number = 3000) {
    this.exibeMensagemBarra(mensagem, 'sucesso', duracao);
  }

  erro(mensagem, duracao: number = 3000) {
    this.exibeMensagemBarra(mensagem, 'erro', duracao);
  }

  alerta(mensagem, duracao: number = 3000) {
    this.exibeMensagemBarra(mensagem, 'alerta', duracao);
  }

  info(mensagem, duracao: number = 3000) {
    this.exibeMensagemBarra(mensagem, 'info', duracao);
  }

  emBreve() {
    this.exibeMensagemBarra('Estamos trabalhando nisso. Aguarde !!!', 'sucesso');
  }

}
