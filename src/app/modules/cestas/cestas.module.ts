import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarFamiliasCestasComponent } from './listar-familias-cestas/listar-familias-cestas.component';
import { CestasRoutingModule } from './cestas-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ListarFamiliasCestasComponent],
  imports: [
    CommonModule,
    RouterModule,
    
    CestasRoutingModule,
    
  ]
})
export class CestasModule { }
