import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { ConsultaBeneficiarioModule } from './modules/consulta-beneficiario/consulta-beneficiario.module';
import { CadastroFamiliaEmergencialModule } from './modules/cadastro-familia-emergencial/cadastro-familia-emergencial.module';
import { FilaDeAtendimentoModule } from './modules/fila-de-atendimento/fila-de-atendimento.module'

import { CanDeactivateGuard } from './core/guards/can-deactivate.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,

    ConsultaBeneficiarioModule,
    CadastroFamiliaEmergencialModule,
    FilaDeAtendimentoModule,

  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
