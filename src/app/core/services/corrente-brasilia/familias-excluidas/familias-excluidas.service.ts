import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliasExcluidasService {
  constructor(private http: HttpClient) { }

  private correnteBrasiliaUrl = environment.apiUrlCorrenteBrasilia;
  private familiasExcluidasService = this.correnteBrasiliaUrl + '/familias-excluidas';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  gravarFamiliaExcluida(familia: FamiliaEmergencial): Observable<FamiliaEmergencial> {
    return this.http
      .post<FamiliaEmergencial>(this.familiasExcluidasService, this.normalizaFamilia(familia), this.httpOptions);
  }

  private normalizaFamilia(familia: FamiliaEmergencial): FamiliaEmergencial {
    familia.nis = familia.nis || '';
    familia.status_emprego = familia.status_emprego || '';
    familia.data_nasc_conjuge = familia.data_nasc_conjuge || '';
    familia.cpf_conjuge = familia.cpf_conjuge || '';
    familia.deseja_msg = !!familia.deseja_msg;
    familia.deseja_aux_espiritual = !!familia.deseja_aux_espiritual;
    familia.dataAtualizacao = new Date().toISOString();
    return familia;
  }

}
