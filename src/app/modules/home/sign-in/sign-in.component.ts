import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SignInService } from 'src/app/modules/home/sign-in/sign-in.service';
import { UserService } from 'src/app/core/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  private rotaOrg: string;

  constructor(
    private formBuilder : FormBuilder,
    private signinService: SignInService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });

    this.rotaOrg = this.route.snapshot.paramMap.get('rotaOrg');
    console.log('rotaOrg: ', this.rotaOrg);
    
  }

  // dados formulário
  email = new FormControl('',[
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


  async login() {
    try {
      let authToken = await this.signinService.signin(this.signinForm.getRawValue());
      this.userService.setToken(authToken.token);
        console.log(`User ${this.email} authenticated with token ${authToken.token}`);
        this.router.navigate([this.rotaOrg || 'home'])
    } catch (error) {
      alert('Email e/ou senha incorreto(s)')
    }
  }


}
