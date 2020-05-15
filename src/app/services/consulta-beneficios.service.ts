import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { BfDisponibilizado } from '../models';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' }) 
export class ConsultaBeneficiosService  {

  private urlTransparencia = environment.apiUrlTransparencia;
  private endpointBF = '/bolsa-familia-disponivel-por-cpf-ou-nis';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

    getBeneficioBolsaFamilia(cpfBeneficiario: string, anoMesReferencia: string): Observable<BfDisponibilizado[]> {
      const url = this.urlTransparencia + this.endpointBF + 
               "?codigo=" + cpfBeneficiario +
               "&anoMesReferencia=" + anoMesReferencia + "&pagina=1";

      return this.http.get<BfDisponibilizado[]>(url).pipe(
        tap(_ => this.log("fetched Beneficio BF disponibilizado codigo="+cpfBeneficiario)),
        catchError(this.handleError<BfDisponibilizado[]>("getBeneficioBolsaFamilia cpf="+cpfBeneficiario))
      )
    };


    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a ProjetoService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ExecucaoService: ${message}`);
  }
}
