import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliasEmergencialService {
  constructor(private http: HttpClient) { }

  private correnteBrasiliaUrl = environment.apiUrlCorrenteBrasilia;
  private familiaEmergencialService = this.correnteBrasiliaUrl + '/familias-emergencial';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  incluirFamiliaEmergencial(familia: FamiliaEmergencial): Observable<FamiliaEmergencial> {
    return this.http
      .post<FamiliaEmergencial>(this.familiaEmergencialService, familia, this.httpOptions);
  }

  atualizarFamiliaEmergencial(familia: FamiliaEmergencial): Observable<FamiliaEmergencial> {
    return this.http
      .put<FamiliaEmergencial>(this.familiaEmergencialService + '/' + familia.codfamilia, familia, this.httpOptions);
  }

  recuperarFamiliaEmergencialCPFNomeDataNascto(cpf?: string, nome?:string, dataNascto?:string): Observable<FamiliaEmergencial[]> {

    if (!cpf && !nome && !dataNascto) { throw new Error('Obrigatório informar cpf ou nome ou dataNascto !!!') }

    let where:{cpf?:string, nome?:string, datanasc2?:string}={};

    if (cpf){
      where.cpf = cpf;
    }

    if (nome){
      where.nome = nome;
    }

    if (dataNascto) {
      where.datanasc2 = dataNascto;
    }

    console.log('where: ', where);

    
    const params = new HttpParams()
    .append('filter', JSON.stringify({where}));
    
    console.log('params', params);

    return this.http
      .get<FamiliaEmergencial[]>(this.familiaEmergencialService, {params});
  }

  recuperarFamiliaEmergencialNaFilaDeAtendimento(): Observable<FamiliaEmergencial[]> {

    let where = {status:"6"};

    const params = new HttpParams()
    .append('filter', JSON.stringify({where}));
    
    return this.http
      .get<FamiliaEmergencial[]>(this.familiaEmergencialService, {params});
    }
    
    recuperarFamiliasEmergencial(): Observable<FamiliaEmergencial[]> {
      return this.http
        .get<FamiliaEmergencial[]>(this.familiaEmergencialService);
  }


}
