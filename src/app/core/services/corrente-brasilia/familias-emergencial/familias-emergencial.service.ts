import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamiliasEmergencialService {

  constructor(private http: HttpClient) { }

  private correnteBrasiliaUrl = environment.apiUrlCorrenteBrasilia;
  private endpointService = this.correnteBrasiliaUrl + '/familias-emergencial';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  incluirFamiliaEmergencial(familia: FamiliaEmergencial): Observable<FamiliaEmergencial> {
    return this.http
      .post<FamiliaEmergencial>(this.endpointService, familia, this.httpOptions);
  }

  recuperarFamiliaEmergencialCPF(cpf: string) {

    // incluir where com filtros cpf/nis/nome


    return this.http
      .get<Photo[]>(API + '/' + userName + '/photos');
  }

}
