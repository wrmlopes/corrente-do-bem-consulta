import { AbstractControl, ValidatorFn } from '@angular/forms';
import { validaCpf } from '../../shared/utils/mylibs';

function xcpfValidator(cb: (((_: string) => boolean))): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value !== undefined && (isNaN(control.value) || !cb(control.value))) {
            return { cpf_invalido: true };
        }
        return null;
    };
}

export function cpfValidator(control: AbstractControl) {
    if (!control.value) { return null };

    return validaCpf(control.value) ? null : {cpf_invalido: true };
}