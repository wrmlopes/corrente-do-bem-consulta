import { AbstractControl } from '@angular/forms';

export function dataValidator(control: AbstractControl) {
    if (!control.value) { return null };
    let ano = control.value.substring(4,8);
    let mes = control.value.substring(2,4);
    let dia = control.value.substring(0,2);

    if (ano > 2020 || ano < 1900 ) {
      return { data_invalida: true };
    }

    if (mes > 12 || mes < 1 ) {
      return { data_invalida: true };
    }

    if (dia > 31 || dia < 1 ) {
      return { data_invalida: true };
    }
    return null;
  }