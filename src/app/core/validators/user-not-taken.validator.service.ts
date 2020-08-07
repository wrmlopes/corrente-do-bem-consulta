import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SignUpService } from '../../modules/home/sign-up/sign-up.service';

import { debounceTime, switchMap, map, first, tap } from 'rxjs/operators';

@Injectable()
export class UserNotTakenValidatorService {

    constructor(private signUpService: SignUpService) { }

    /**
     * Verifica se email informado já está sendo utilizado
     */
    checkEmailTaken() {
        console.log('check email is taken');
        return (control: AbstractControl) => {
            return control
                .valueChanges
                .pipe(debounceTime(300))
                .pipe(switchMap(email =>
                    this.signUpService.checkEmailTaken(email)
                ))
                .pipe(map(isTaken => isTaken ? { emailTaken: true } : null))
                .pipe(tap(r => console.log(r)))
                .pipe(first());
        }
    }
}