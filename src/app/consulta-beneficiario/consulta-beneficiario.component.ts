import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn, FormGroup, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

import { ConsultaBeneficiosService } from '../services/consulta-beneficios.service';
import { BfDisponibilizado } from '../models';
import { BFApresentado } from '../models/bf-apresentado.models';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-consulta-beneficiario',
  templateUrl: './consulta-beneficiario.component.html',
  styleUrls: ['./consulta-beneficiario.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ConsultaBeneficiarioComponent implements OnInit {

  constructor(
    fb: FormBuilder,
    private consultaBeneficioService: ConsultaBeneficiosService) { 
      this.consultaForm = fb.group({
        "cpf": this.cpf,
        "date": this.date
      })
    }

  // controles de formulário
  consultaForm: FormGroup;
  cpf = new FormControl('', [
    this.cpfValidator(this.validaCpf),
    Validators.required,
    Validators.minLength(11),
    Validators.pattern(/([0-9]{11})/)]);
  date = new FormControl(moment().subtract(1, 'months'));

  // _regxpCpf: RegExp = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
  _regxpCpf: RegExp = /([0-9]{11})/;
  _emConsulta: boolean = false;
  _consultaBFDisponivel: boolean = false;
  _dataBF: BFApresentado = {};

  ngOnInit(): void {
  }
  
  get maxDate() {
    return new Date();
  }

  get minDate() {
    let minDate = this.maxDate;
    minDate.setFullYear(this.maxDate.getFullYear()-2);
    return minDate;
  }

  get regxCpf() {
    return this._regxpCpf;
  }

  getErrorMessage() {
    console.log('validator: ', this.cpf);
    if (this.cpf.hasError('required')) {
      return 'Informe um CPF para consultar';
    };

    if (this.cpf.hasError('minlength')) {
      return 'Informe todos os números do CPF';
    };

    if (this.cpf.hasError('pattern')) {
      return 'Informe apenas números';
    };

    return this.cpf.hasError('cpf_invalido') ? 'CPF não está correto' : '';
  }

  get emConsulta() {
    console.log("disabled: ", this._emConsulta)
    return this._emConsulta;
  }

  get consultaBFDisponivel() {
    return this._consultaBFDisponivel;
  }

  get dataBF() {
    return this._dataBF;
  }

  consultaBeneficiario() {
    this._emConsulta = true;
    console.log("cpf: ", this.cpf.value);
    console.log("date: ", this.date.value);
    console.log("date moment: ", moment(this.date.value).month());
    console.log("date moment: ", moment(this.date.value).format('YYYYMM'));
    console.log("date moment: ", moment(this.date.value).year());

    this.consultaBeneficioService.getBeneficioBolsaFamilia(this.cpf.value, moment(this.date.value).format('YYYYMM'))
      .subscribe((data: BfDisponibilizado[]) => {
        console.log(data);
        this._dataBF = {};
        if ( data && data.length > 0) {
          this._dataBF.nome = data[0].titularBolsaFamilia.nome;
          this._dataBF.nis = data[0].titularBolsaFamilia.nis;
          this._dataBF.municipio = data[0].municipio.nomeIBGE;
          this._dataBF.quantidadeDependentes = data[0].quantidadeDependentes;
          this._dataBF.valor = data[0].valor;
          this._consultaBFDisponivel = true;
        } else {
          this._consultaBFDisponivel = false;
        }

        this._emConsulta = false;
      });
  }

  cpfValidator(cb: Function): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || !cb(control.value))) {
        return { 'cpf_invalido': true };
      }
      return null;
    }
  }

  validaCpf(inputCPF: string): boolean {
    console.log('cpf: ', inputCPF);
    let soma = 0;
    let resto;
    if (!inputCPF || inputCPF == '00000000000') return false;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    console.log('digito 1: ', resto);

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(inputCPF.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    console.log('digito 2: ', resto);

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(inputCPF.substring(10, 11))) return false;

    return true;
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }


}
