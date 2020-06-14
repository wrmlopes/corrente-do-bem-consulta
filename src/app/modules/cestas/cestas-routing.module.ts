import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarFamiliasCestasComponent } from './listar-familias-cestas/listar-familias-cestas.component';

const routes: Routes = [
    { path: '', component: ListarFamiliasCestasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CestasRoutingModule { }