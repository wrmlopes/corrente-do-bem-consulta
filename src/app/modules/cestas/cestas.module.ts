import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { NgxMaskModule } from 'ngx-mask';

import { RouterModule } from '@angular/router';
import { CestasRoutingModule } from './cestas-routing.module';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

import { ListarFamiliasCestasComponent } from './listar-familias-cestas/listar-familias-cestas.component';
import { FamiliaModalComponent } from './familia-modal/familia-modal/familia-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EncaminharModalComponent } from './encaminhar-modal/encaminhar-modal.component';

@NgModule({
  declarations: [ListarFamiliasCestasComponent, FamiliaModalComponent, EncaminharModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    RouterModule,
    NgxMaskModule.forRoot(),
    
    CestasRoutingModule,

  ],
  entryComponents: [
    FamiliaModalComponent,
    EncaminharModalComponent,
  ]
})
export class CestasModule { }
