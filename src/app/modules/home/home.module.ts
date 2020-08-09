import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { HomeComponent } from './home/home.component';
import { VMessageModule } from 'src/app/shared/components/vmessage/vmessage.module';
import { NavbarModule } from '../navbar/navbar.module';
import { CadastroFamiliaEmergencialModule } from '../cadastro-familia-emergencial/cadastro-familia-emergencial.module';
import { ConsultaBeneficiarioModule } from '../consulta-beneficiario/consulta-beneficiario.module';
import { FilaDeAtendimentoModule } from '../fila-de-atendimento/fila-de-atendimento.module';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),

    VMessageModule,

    HomeRoutingModule,
    NavbarModule,
    // CadastroFamiliaEmergencialModule,
    // ConsultaBeneficiarioModule,
    // FilaDeAtendimentoModule,
  ]
})
export class HomeModule { }
