import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ConsultaBeneficiarioModule } from './modules/consulta-beneficiario/consulta-beneficiario.module';
import { CadastroFamiliaEmergencialModule } from './modules/cadastro-familia-emergencial/cadastro-familia-emergencial.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,

    ConsultaBeneficiarioModule,
    CadastroFamiliaEmergencialModule,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
