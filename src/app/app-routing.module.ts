import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaBeneficiarioComponent } from './modules/consulta-beneficiario/consulta-beneficiario.component';
import { CadastroFamiliaEmergencialComponent } from './modules/cadastro-familia-emergencial/cadastro-familia-emergencial.component';

//This is my case 
const routes: Routes = [
    {
        path: '',
        component: ConsultaBeneficiarioComponent
    },
    {
        path: 'cadastro',
        component: CadastroFamiliaEmergencialComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }