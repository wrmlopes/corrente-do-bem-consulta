import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { CestaBasica } from '../../../../shared/models/cesta-basica';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CestasBasicasService {

  constructor(private http: HttpClient) { }

  private correnteBrasiliaUrl = environment.apiUrlCorrenteBrasilia;
  private cestaBasicaService = this.correnteBrasiliaUrl + '/cestasbasicas';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  recuperarCestasBasicas(): Observable<CestaBasica[]> {
    return this.http
      .get<CestaBasica[]>(this.cestaBasicaService, this.httpOptions);
  }

  incluirCestaBasica(familia: CestaBasica): Observable<CestaBasica> {
    return this.http
      .post<CestaBasica>(this.cestaBasicaService, familia, this.httpOptions);
  }

  atualizarCestaBasica(cestabasica: CestaBasica): Observable<CestaBasica> {
    return this.http
      .put<CestaBasica>(this.cestaBasicaService + '/' + cestabasica.codfamilia, cestabasica, this.httpOptions);
  }
}
