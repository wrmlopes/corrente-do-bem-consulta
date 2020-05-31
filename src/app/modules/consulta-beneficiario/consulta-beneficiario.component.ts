import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn, FormGroup, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

import { ConsultaBeneficiosDfService } from '../../core/services/consulta-beneficios-df/consulta-beneficios-df.service';
import { BfDisponibilizado, DataBeneficioDF } from '../../shared/models';
import { BFApresentado } from '../../shared/models/bf-apresentado.models';
import { ConsultaBeneficiosBrService } from '../../core/services/consulta-beneficios-br/consulta-beneficios-br.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      private consultaBeneficioDfService: ConsultaBeneficiosDfService,
      private consultaBeneficiosBrService: ConsultaBeneficiosBrService,
      private _snackBar: MatSnackBar
    ) {
      this.consultaForm = fb.group({
        cpfOuNis: this.cpfOuNis,
        date: this.date
      });
  }

  // controles de formulário
  consultaForm: FormGroup;
  cpfOuNis = new FormControl('', [
    this.cpfOuNisValidator(this.validaCpfOuNis.bind(this)),
    Validators.required,
    Validators.minLength(11),
    Validators.pattern(/([0-9]{11})/)]);
  date = new FormControl(moment().subtract(1, 'months'));

  // _regxpCpf: RegExp = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
  private _RegxpCpf: RegExp = /([0-9]{11})/;
  private _emConsulta = false;
  private _consultaBFDisponivel = false;
  private _consultaDFDisponivel = false;
  private _dataBF: BFApresentado = {};

  ngOnInit(): void {
  }

  get maxDate() {
    return new Date();
  }

  get minDate() {
    const minDate = this.maxDate;
    minDate.setFullYear(this.maxDate.getFullYear() - 2);
    return minDate;
  }

  get regxCpf() {
    return this._RegxpCpf;
  }

  getErrorMessage() {
    if (this.cpfOuNis.hasError('required')) {
      return 'Informe um CPF ou NIS para consultar';
    }

    if (this.cpfOuNis.hasError('minlength')) {
      return 'Informe todos os números do CPF ou NIS';
    }

    if (this.cpfOuNis.hasError('pattern')) {
      return 'Informe apenas números';
    }

    return this.cpfOuNis.hasError('cpfOuNis_invalido') ? 'CPF ou NIS não é válido' : '';
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

    this.consultaBeneficiosBrService.getBeneficioBolsaFamilia(this.cpfOuNis.value, moment(this.date.value).format('YYYYMM'))
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
          this.exibeMensagem('Não encontrou dados de benefícios para o período');
          this._consultaBFDisponivel = false;
        }

        this._emConsulta = false;
      });
  }

  private consultaDFSM(nis: string) {
    this.consultaBeneficioDfService.getBeneficiosNoDF(nis, moment(this.date.value).format('YYYYMM'))
      .subscribe((data: DataBeneficioDF) => {
        if (data && data.content.length > 0) {
          this._dataBF.valorBolsaFamilia = data.content[0].valorBolsaFamilia;
          this._dataBF.valorDfSemMiseria = data.content[0].valorDfSemMiseria;
          this._dataBF.valorBolsaSocial = data.content[0].valorBolsaSocial;
          this._dataBF.valorOutros = data.content[0].valorOutros;
          this._dataBF.valorTotal = data.content[0].valorTotal;
          this._consultaDFDisponivel = true;
        } else {
          this.exibeMensagem('Não encontrou dados de benefícios para o período');
          this._consultaDFDisponivel = false;
        }
        this._emConsulta = false;
      });
  }

  cpfOuNisValidator( cb: (((_: string) => boolean))): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      console.log("control value: [", control.value, "]");
      if (control.value !== undefined && (isNaN(control.value) || !cb(control.value))) {
        return { cpf_invalido: true };
      }
      return null;
    };
  }

  validaCpfOuNis(inputCPF: string): boolean {
    console.log(`inputcpf: [${inputCPF}]`);
    return this.validaCpf(inputCPF) || this.validaNis(inputCPF);
  }
  
  validaCpf(inputCPF: string): boolean {
    console.log(`input in cpf: [${inputCPF}]`);
    let soma = 0;
    let resto;
    if (!inputCPF || inputCPF === '00000000000') {return false; }
    
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i), 10) * (11 - i);
    }
    resto = (soma * 10) % 11;
    
    if ((resto === 10) || (resto === 11)) {resto = 0; }
    if (resto !== parseInt(inputCPF.substring(9, 10), 10)) {return false; }
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(inputCPF.substring(i - 1, i), 10) * (12 - i);
    }
    resto = (soma * 10) % 11;
    
    if ((resto === 10) || (resto === 11)) {resto = 0; }
    if (resto !== parseInt(inputCPF.substring(10, 11), 10)) {return false; }
    
    return true;
  }
  
  validaNis(inputNis: string): boolean {
    console.log(`input in nis: [${inputNis}]`);
    let soma = 0;
    let resto;
    const PESO = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    if (!inputNis || inputNis === '00000000000') {return false; }

    for (let i = 0; i <= 9; i++) {
      console.log("somae: ", soma, "   i: ", i);
      console.log("nis a char: ", inputNis.substring(i , i + 1), "   peso: ",  PESO[i]);
      soma = soma + parseInt(inputNis.substring(i, i + 1), 10) * PESO[i];
    }
    resto = 11 - soma % 11;
    console.log("resto nis: ", resto, " soma: ", soma);

    if ((resto === 10) || (resto === 11)) {resto = 0; }
    if (resto !== parseInt(inputNis.substring(10, 11), 10)) {return false; }

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


  exibeMensagem(mensagem: string) {
    this._snackBar.open(mensagem, ' X ', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
