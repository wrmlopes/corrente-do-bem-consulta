import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { debounceTime, switchMap, map, tap, first } from 'rxjs/operators';
import { FamiliasEmergencialService } from '../services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { FamiliaEmergencial } from '../../shared/models/familia-emergencial';

@Injectable({
  providedIn: 'root'
})
export class ValidatorCpfService {

  constructor(
    private familiaEmergencialService: FamiliasEmergencialService,
  ) { }

  cpfDuplicado(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        console.log( 'control: ', control);
        return control
            .valueChanges
            .pipe(debounceTime(300))
            .pipe(switchMap(cpf => this.familiaEmergencialService.recuperarFamiliaEmergencialCPFNomeDataNascto(cpf)
              ))
            .pipe( map((familiaEmergencial: FamiliaEmergencial[]) => {
              let codFamilia = control.parent.get('codfamilia').value;
              console.log('codfamilia from form: ', codFamilia);
              if (familiaEmergencial.length > 0) {
                return familiaEmergencial[0].codfamilia === codFamilia ? null : { cpf_duplicado: true };
              }
              return null;
            }))
            .pipe(tap(r => console.log('res: ', r)))
            .pipe(first());
      };
  }
}
