import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { consolelog } from 'src/app/shared/utils/mylibs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(
    private formBuilder : FormBuilder
  ) { }

  ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      usuario: this.usuario,
      password: this.password
    })
  }

  // dados formulário
  usuario = new FormControl('',[
    Validators.required,
    Validators.email
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(10),
  ]);
  signinForm: FormGroup;

  // dados controle


  login() {
    consolelog( 'logou');
  }


}
