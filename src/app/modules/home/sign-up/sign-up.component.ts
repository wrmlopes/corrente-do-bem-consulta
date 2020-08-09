import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewUser } from './new-user';
import { SignUpService } from './sign-up.service';
import { Router } from '@angular/router';
import { PlatformDetectorService } from 'src/app/core/plataform-detector/platform-detector.service';
import { UserNotTakenValidatorService } from 'src/app/core/validators/user-not-taken.validator.service';
import { debounceTime, finalize } from 'rxjs/operators';

@Component({
    templateUrl: './sign-up.component.html',
    providers: [ UserNotTakenValidatorService ]
})
export class SignUpComponent implements OnInit {
    
    signupForm: FormGroup;
    @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;

    writing = false;
    
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
            aniversario: [''],
            password: ['', 
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(15)
                ]
            ]
        });

        this.signupForm.get('email')
        .valueChanges
        .pipe(debounceTime(500))
        .subscribe(dataValue => {})

        // this.platformDetectorService.isPlatformBrowser() && 
        //     this.emailInput.nativeElement.focus();    
    } 

    signup() {
        this.writing=true;
        const newUser = this.signupForm.getRawValue() as NewUser;
        this.signUpService
            .signup(newUser)
            .pipe(
                finalize(() => {
                    console.log('Finally callback');
                    this.writing=false;
                }),
              )
            .subscribe(
                () => this.router.navigate(['']),
                err => console.log(err)
            );
    }
}