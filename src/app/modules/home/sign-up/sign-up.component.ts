import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewUser } from './new-user';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';
import { PlatformDetectorService } from 'src/app/core/plataform-detector/platform-detector.service';
import { UserNotTakenValidatorService } from 'src/app/core/validators/user-not-taken.validator.service';
import { debounceTime } from 'rxjs/operators';

@Component({
    templateUrl: './sign-up.component.html',
    providers: [ UserNotTakenValidatorService ]
})
export class SignUpComponent implements OnInit {
    
    signupForm: FormGroup;
    @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
    
    constructor(
        private formBuilder: FormBuilder,
        private signUpService: SignUpService,
        private userNotTakenValidatorService: UserNotTakenValidatorService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService) {}

    ngOnInit(): void {
        this.signupForm = this.formBuilder.group({
            email: ['', 
                [
                    Validators.required,
                    Validators.email
                ],
                this.userNotTakenValidatorService.checkEmailTaken()
            ],
            nome: ['', 
                [
                    Validators.required,
                    Validators.minLength(5),
                    Validators.maxLength(40)
                ]
            ],
            telefone: [''],
            password: ['', 
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(15)
                ]
            ]
        });

        this.signupForm.get('email')
        .valueChanges
        .pipe(debounceTime(500))
        .subscribe(dataValue => {
            
          console.log('datavalue: ', dataValue);
          console.log('errors: ', this.signupForm.get('email'));
          console.log('rawValue: ', this.signupForm.getRawValue())
        })

        // this.platformDetectorService.isPlatformBrowser() && 
        //     this.emailInput.nativeElement.focus();    
    } 

    signup() {
        const newUser = this.signupForm.getRawValue() as NewUser;
        this.signUpService
            .signup(newUser)
            .subscribe(
                () => this.router.navigate(['']),
                err => console.log(err)
            );
    }
}