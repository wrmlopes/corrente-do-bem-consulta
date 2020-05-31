import { Component, OnInit } from '@angular/core';
import { ConsultaBeneficiosDfService } from 'src/app/core/services/consulta-beneficios-df/consulta-beneficios-df.service';
import { ConsultaBeneficiosBrService } from 'src/app/core/services/consulta-beneficios-br/consulta-beneficios-br.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { validaCpf } from 'src/app/core/utils/mylibs';


const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-cadastro-familia-emergencial',
  templateUrl: './cadastro-familia-emergencial.component.html',
  styleUrls: ['./cadastro-familia-emergencial.component.css']
})
export class CadastroFamiliaEmergencialComponent implements OnInit {

  constructor(
    fb: FormBuilder,
    private consultaBeneficioDfService: ConsultaBeneficiosDfService,
    private consultaBeneficiosBrService: ConsultaBeneficiosBrService,
    private _snackBar: MatSnackBar
  ) {
    this.cadastroForm = fb.group({
      nomeResponsavel: this.nomeResponsavel,
      dataNascto: this.dataNascto,
      cpfResp: this.cpfResp,
    });
}

  ngOnInit(): void {
  }

  // controles de formulário
  cadastroForm: FormGroup;
  nomeResponsavel= new FormControl('');
  dataNascto= new FormControl('');
  cpfResp = new FormControl('', [
    this.cpfValidator(validaCpf.bind(this)),
    Validators.required,
    Validators.minLength(11),
    Validators.pattern(/([0-9]{11})/)]);

  submitResponsavel(){

  }

  cpfValidator( cb: (((_: string) => boolean))): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      console.log("control value: [", control.value, "]");
      if (control.value !== undefined && (isNaN(control.value) || !cb(control.value))) {
        return { cpf_invalido: true };
      }
      return null;
    };
  }

  getErrorCpfResp() {
    if (!this.cpfResp.value) return null;
    if (this.cpfResp.hasError('required')) {
      return 'Informe o CPF';
    }
    
    if (this.cpfResp.hasError('minlength')) {
      return 'Informe todos os números do CPF';
    }

    if (this.cpfResp.hasError('pattern')) {
      return 'Informe apenas números';
    }  

    return this.cpfResp.hasError('cpf_invalido') ? 'CPF não é válido' : null;
  }

}
