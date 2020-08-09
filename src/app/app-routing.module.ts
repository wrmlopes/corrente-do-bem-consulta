import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInComponent } from './modules/home/sign-in/sign-in.component';
import { SignUpComponent } from './modules/home/sign-up/sign-up.component';

const routes: Routes = [
  // { path: '',  redirectTo: '', pathMatch: 'full', component: CadastroFamiliaEmergencialComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
