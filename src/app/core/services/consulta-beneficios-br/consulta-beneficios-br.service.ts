import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessageService } from '../message.service';
import { BfDisponibilizado } from '../../../shared/models';
import { tap, catchError } from 'rxjs/operators';

import { AuxilioEmergencial } from '../../../shared/models/auxilio-emergencial';

@Injectable({
  providedIn: 'root'
})
export class ConsultaBeneficiosBrService {

  private urlTransparencia = environment.apiUrlTransparencia;

  private endpointBF = '/bolsa-familia-disponivel-por-cpf-ou-nis';
  private endpointAuxiliEmergencial = '/auxilio-emergencial-por-cpf-ou-nis';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  
  getBeneficioBolsaFamilia(cpfBeneficiario: string, anoMesReferencia: string): Observable<BfDisponibilizado[]> {
    const url = this.urlTransparencia + this.endpointBF +
      '?codigo=' + cpfBeneficiario +
      '&anoMesReferencia=' + anoMesReferencia + '&pagina=1';

    return this.http.get<BfDisponibilizado[]>(url).pipe(
      tap(_ => this.log('fetched Beneficio BF disponibilizado codigo=' + cpfBeneficiario)),
      catchError(this.handleError<BfDisponibilizado[]>('getBeneficioBolsaFamilia cpf=' + cpfBeneficiario))
    );
  }

  getAuxilioEmergencial(cpfBeneficiario: string): Observable<AuxilioEmergencial[]> {
    const url = this.urlTransparencia + this.endpointBF +
      '?codigoBeneficiario=' + cpfBeneficiario + '&pagina=1';

    return this.http.get<AuxilioEmergencial[]>(url).pipe(
      tap(_ => this.log('fetched Auxílio Emergencial disponibilizado codigo=' + cpfBeneficiario)),
      catchError(this.handleError<AuxilioEmergencial[]>('getBeneficioBolsaFamilia cpf=' + cpfBeneficiario))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a Service message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ConsultaBeneficiosBrService: ${message}`);
  }
}
