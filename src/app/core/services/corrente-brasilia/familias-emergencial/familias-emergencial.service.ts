import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { Observable } from 'rxjs';
import { FamiliasExcluidasService } from '../familias-excluidas/familias-excluidas.service';

@Injectable({
  providedIn: 'root'
})
export class FamiliasEmergencialService {
  constructor(
    private http: HttpClient,
    private familiasExcluidasService: FamiliasExcluidasService
  ) { }

  private correnteBrasiliaUrl = environment.apiUrlCorrenteBrasilia;
  private familiaEmergencialUrl = this.correnteBrasiliaUrl + '/familias-emergencial';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  incluirFamiliaEmergencial(familia: FamiliaEmergencial): Observable<FamiliaEmergencial> {
    return this.http
      .post<FamiliaEmergencial>(this.familiaEmergencialUrl, familia, this.httpOptions);
  }

  /**
   * atualiza os campos informados no regstro de família emergencial
   * @param familia 
   */
  atualizarFamiliaEmergencial(familia: FamiliaEmergencial): Observable<FamiliaEmergencial> {
    return this.http
      .patch<FamiliaEmergencial>(this.familiaEmergencialUrl + '/' + familia.codfamilia, familia, this.httpOptions);
  }

  excluirFamiliaEmergencial(familia: FamiliaEmergencial): Observable<any> {
    return this.http
      .delete<FamiliaEmergencial>(this.familiaEmergencialUrl + '/' + familia.codfamilia, this.httpOptions);

  }

  recuperarFamiliaEmergencialCPFNomeDataNascto(cpf?: string, nome?: string, dataNascto?: string): Observable<FamiliaEmergencial[]> {

    if (!cpf && !nome && !dataNascto) { throw new Error('Obrigatório informar cpf ou nome ou dataNascto !!!') }

    let where: { cpf?: string, nome?: string, datanasc2?: string } = {};

    if (cpf) {
      where.cpf = cpf;
    }

    if (nome) {
      where.nome = nome;
    }

    if (dataNascto) {
      where.datanasc2 = dataNascto;
    }

    const params = new HttpParams()
      .append('filter', JSON.stringify({ where }));

    console.log('params', params);

    return this.http
      .get<FamiliaEmergencial[]>(this.familiaEmergencialUrl, { params });
  }

  recuperarFamiliaEmergencialNaFilaDeAtendimento(): Observable<FamiliaEmergencial[]> {

    let where = { status: "6" };

    const params = new HttpParams()
      .append('filter', JSON.stringify({ where }));

    return this.http
      .get<FamiliaEmergencial[]>(this.familiaEmergencialUrl, { params });
  }

  recuperarFamiliasEmergencial(): Observable<FamiliaEmergencial[]> {
    return this.http
      .get<FamiliaEmergencial[]>(this.familiaEmergencialUrl);
  }


}
