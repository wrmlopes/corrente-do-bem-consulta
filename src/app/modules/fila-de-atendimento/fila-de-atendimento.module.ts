import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';

import { FilaDeAtendimentoComponent } from './fila-de-atendimento.component';
import { CadastroFilaDeAtendimentoComponent } from './cadastro-fila-de-atendimento/cadastro-fila-de-atendimento.component';



@NgModule({
  declarations: [
    FilaDeAtendimentoComponent, 
    CadastroFilaDeAtendimentoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSnackBarModule,
    NgxMaskModule.forRoot(),
  ]
})
export class FilaDeAtendimentoModule { }
