import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn, FormGroup, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

import { ConsultaBeneficiosService } from '../services/consulta-beneficios.service';
import { BfDisponibilizado, DataBeneficioDF } from '../models';
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
  _consultaDFDisponivel: boolean = false;
  _dataBF: BFApresentado = {};

  ngOnInit(): void {
  }

  get maxDate() {
    return new Date();
  }

  get minDate() {
    let minDate = this.maxDate;
    minDate.setFullYear(this.maxDate.getFullYear() - 2);
    return minDate;
  }

  get regxCpf() {
    return this._regxpCpf;
  }

  getErrorMessage() {
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
    return this._emConsulta;
  }

  get consultaBFDisponivel() {
    return this._consultaBFDisponivel;
  }

  get consultaDFDisponivel() {
    return this._consultaDFDisponivel;
  }

  get dataBF() {
    return this._dataBF;
  }

  consultaBeneficiario() {
    this._emConsulta = true;

    this.consultaBeneficioService.getBeneficioBolsaFamilia(this.cpf.value, moment(this.date.value).format('YYYYMM'))
      .subscribe((data: BfDisponibilizado[]) => {
        this._dataBF = {};
        if (data && data.length > 0) {
          this._dataBF.nome = data[0].titularBolsaFamilia.nome;
          this._dataBF.nis = data[0].titularBolsaFamilia.nis;
          this._dataBF.municipio = data[0].municipio.nomeIBGE;
          this._dataBF.quantidadeDependentes = data[0].quantidadeDependentes;
          this.consultaDFSM(data[0].titularBolsaFamilia.nis);
          this._consultaBFDisponivel = true;
        } else {
          this._consultaBFDisponivel = false;
        }

        this._emConsulta = false;
      });
  }

  private consultaDFSM(nis: string) {
    this.consultaBeneficioService.getBeneficiosNoDF(nis, moment(this.date.value).format('YYYYMM'))
      .subscribe((data: DataBeneficioDF) => {
        if (data && data.content.length > 0) {
          this._dataBF.valorBolsaFamilia = data.content[0].valorBolsaFamilia;
          this._dataBF.valorDfSemMiseria = data.content[0].valorDfSemMiseria;
          this._dataBF.valorBolsaSocial = data.content[0].valorBolsaSocial;
          this._dataBF.valorOutros = data.content[0].valorOutros;
          this._dataBF.valorTotal = data.content[0].valorTotal;
          this._consultaDFDisponivel = true;
        } else {
          this._consultaDFDisponivel = false;
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
    let soma = 0;
    let resto;
    if (!inputCPF || inputCPF == '00000000000') return false;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(inputCPF.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(inputCPF.substring(10, 11))) return false;

    return true;
  }

  validaNis(inputNis: string): boolean {
    let soma = 0;
    let resto;
    let peso = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    if (!inputNis || inputNis == '00000000000') return false;

    for (let i = 0; i < 9; i++) {
      soma = soma + parseInt(inputNis.substring(i - 1, i)) * peso[i];
    }
    resto = soma % 11;

    if ((resto == 10) || (resto == 11)) resto = 0;
    if (resto != parseInt(inputNis.substring(10, 11))) return false;

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
