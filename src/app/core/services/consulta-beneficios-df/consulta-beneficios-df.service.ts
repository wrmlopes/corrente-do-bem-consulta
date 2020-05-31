import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { BfDisponibilizado, DataBeneficioDF } from '../../../shared/models';
import { MessageService } from '../message.service';
import { Exercicios } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class ConsultaBeneficiosDfService {

  private urlTransparenciaDF = environment.apiUrlTransparenciaDF;
  private urlSigaBrasilia = environment.apiUrlSigaBrasiliaDF;

  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  private readonly BENEFICIARIO_DF_PERIODO_E_NIS = '/beneficiario/programa-social';
  private readonly EXERCICO_POR_BENEFICIARIO_NIS = '/Beneficiario/ListarExerciciosPorBeneficiario';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getBeneficiosNoDF(nisBeneficiario: string, anoMesReferencia: string): Observable<DataBeneficioDF> {
    const url = this.urlTransparenciaDF + this.BENEFICIARIO_DF_PERIODO_E_NIS +
      '?nrNisOutros=' + nisBeneficiario +
      '&anoMes=' + anoMesReferencia + '&page=0';

    return this.http.get<DataBeneficioDF>(url).pipe(
      tap(_ => this.log('fetched Beneficio BF disponibilizado codigo=' + nisBeneficiario)),
      catchError(this.handleError<DataBeneficioDF>('getBeneficioBolsaFamilia cpf=' + nisBeneficiario))
    );
  }

  getExerciciosPorBeneficiarioNis(nisBeneficiario: string): Observable<Exercicios> {
    const url = this.urlSigaBrasilia + this.EXERCICO_POR_BENEFICIARIO_NIS +
      '?nis=' + nisBeneficiario;

    return this.http.get<Exercicios>(url).pipe(
      tap(_ => this.log('fetched Exercicios por Beneficiario DF codigo=' + nisBeneficiario)),
      catchError(this.handleError<Exercicios>('getExerciciosPorBeneficiarioNis NIS=' + nisBeneficiario))
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
    this.messageService.add(`ConsultaBeneficiosDfService: ${message}`);
  }
}
