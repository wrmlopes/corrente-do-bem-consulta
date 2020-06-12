import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaBeneficiarioComponent } from './modules/consulta-beneficiario/consulta-beneficiario.component';
import { CadastroFamiliaEmergencialComponent } from './modules/cadastro-familia-emergencial/cadastro-familia-emergencial.component';
import { FilaDeAtendimentoComponent } from './modules/fila-de-atendimento/fila-de-atendimento.component';
import { CanDeactivateGuard } from './core/guards/can-deactivate.guard';

//This is my case 
const routes: Routes = [
    { path: '',  redirectTo: '', pathMatch: 'full', component: CadastroFamiliaEmergencialComponent },
    { path: 'consulta',  pathMatch: 'full', component: ConsultaBeneficiarioComponent },
    { path: 'cadastro', component: CadastroFamiliaEmergencialComponent},
    { path: 'fila-de-atendimento', component: FilaDeAtendimentoComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }