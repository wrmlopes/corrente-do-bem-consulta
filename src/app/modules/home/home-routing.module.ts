import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginGuard } from '../../core/guards/auth/login.guard';
import { HomeComponent } from './home/home.component';
import { ConsultaBeneficiarioComponent } from '../consulta-beneficiario/consulta-beneficiario.component';
import { CadastroFamiliaEmergencialComponent } from '../cadastro-familia-emergencial/cadastro-familia-emergencial.component';
import { FilaDeAtendimentoComponent } from '../fila-de-atendimento/fila-de-atendimento.component';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    canActivate: [LoginGuard],
    children: [
      { path: 'consulta',  pathMatch: 'full', component: ConsultaBeneficiarioComponent },
      { path: 'cadastro', component: CadastroFamiliaEmergencialComponent, canActivate: [LoginGuard], },
      { path: 'fila-de-atendimento', component: FilaDeAtendimentoComponent, canDeactivate: [CanDeactivateGuard] },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }