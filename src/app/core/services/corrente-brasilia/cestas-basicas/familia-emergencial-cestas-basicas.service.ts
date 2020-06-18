import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CestaBasica } from 'src/app/shared/models/cesta-basica';
import { Observable } from 'rxjs';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';

@Injectable({
  providedIn: 'root'
})
export class FamiliaEmergencialCestasBasicasService {

  constructor(private http: HttpClient) { }

  private correnteBrasiliaUrl = environment.apiUrlCorrenteBrasilia;
  private cestasBasicasDaFamiliaEmergencialService = this.correnteBrasiliaUrl + '/familia-emergencial';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  recuperarCestasBasicasDeFamiliaEmergencial(codFamilia: number): Observable<CestaBasica[]> {

    return this.http
      .get<CestaBasica[]>(
        `${this.cestasBasicasDaFamiliaEmergencialService}/${codFamilia}/cestabasicas`);
  }

  recuperarFamiliaEmergencialECestas(): Observable<FamiliaEmergencial[]> {

    return this.http
      .get<CestaBasica[]>(
        `${this.cestasBasicasDaFamiliaEmergencialService}/cestasbasicas`);
  }
}
