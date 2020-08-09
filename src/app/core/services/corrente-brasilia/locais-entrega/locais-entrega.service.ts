import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocaisEntrega } from 'src/app/shared/models/locais-entrega.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocaisEntregaService {
  constructor(
    private http: HttpClient,
  ) { }

  private correnteBrasiliaUrl = environment.apiUrlCorrenteBrasilia;
  private locaisEntregaUrl = this.correnteBrasiliaUrl + '/locais-entrega';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  incluirLocaisEntrega(localEntrega: LocaisEntrega): Observable<LocaisEntrega> {
    return this.http
      .post<LocaisEntrega>(this.locaisEntregaUrl, localEntrega, this.httpOptions);
  }

  /**
   * atualiza os campos informados no regstro de família emergencial
   * @param localEntrega local de entrega a ser atualizado
   */
  atualizarLocaisEntrega(localEntrega: LocaisEntrega): Observable<LocaisEntrega> {
    return this.http
      .patch<LocaisEntrega>(this.locaisEntregaUrl + '/' + localEntrega.localEntregaId, localEntrega, this.httpOptions);
  }

  excluirLocaisEntrega(localEntrega: LocaisEntrega): Observable<any> {
    return this.http
      .delete<LocaisEntrega>(this.locaisEntregaUrl + '/' + localEntrega.localEntregaId, this.httpOptions);
  }

  aprovarLocaisEntrega(localEntrega: LocaisEntrega): Observable<any> {
    return this.http
      .patch<LocaisEntrega>(this.locaisEntregaUrl + '/' + localEntrega.localEntregaId, { status: 7 }, this.httpOptions);
  }

  recuperarLocaisEntrega(): Observable<LocaisEntrega[]> {
    return this.http
      .get<LocaisEntrega[]>(this.locaisEntregaUrl);
  }

}
