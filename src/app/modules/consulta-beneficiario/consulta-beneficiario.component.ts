import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn, FormGroup, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import  localept  from '@angular/common/locales/pt';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

import { ConsultaBeneficiosDfService } from '../../core/services/consulta-beneficios-df/consulta-beneficios-df.service';
import { BfDisponibilizado, DataBeneficioDF } from '../../shared/models';
import { BFApresentado } from '../../shared/models/bf-apresentado.models';
import { ConsultaBeneficiosBrService } from '../../core/services/consulta-beneficios-br/consulta-beneficios-br.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuxilioEmergencial } from 'src/app/shared/models/auxilio-emergencial';
import { registerLocaleData } from '@angular/common';
import { validaCpf, validaNis } from 'src/app/core/utils/mylibs';

registerLocaleData(localept, 'pt');

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
    {
      provide: LOCALE_ID,
      useValue: "pt"
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
      mesReferencia: this.mesReferencia
    });
  }

  // controles de formulário
  consultaForm: FormGroup;
  cpfOuNis = new FormControl('', [
    this.cpfOuNisValidator(this.validaCpfOuNis.bind(this)),
    Validators.required,
    Validators.minLength(11),
    Validators.pattern(/([0-9]{11})/)]);
  mesReferencia = new FormControl('042020');

  // _regxpCpf: RegExp = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
  private _RegxpCpf: RegExp = /([0-9]{11})/;
  private _consultaDFDisponivel = false;
  
  
  consultaBFDisponivel = false;
  dataBF: BFApresentado = {};
  
  emConsulta: boolean;
  waitingGovBr = false;
  waitingGovDf: boolean;

  auxilios: AuxilioEmergencial[];

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


  get consultaDFDisponivel() {
    return this._consultaDFDisponivel;
  }

  consultaBeneficiario() {
    this.emConsulta = true;
  
    this.waitingGovBr = true;

    this.consultaBeneficiosBrService.getBeneficioBolsaFamilia(this.cpfOuNis.value, this.getMesReferenciaConsulta())
      .subscribe((data: BfDisponibilizado[]) => {
        this.dataBF = {};
        if (data && data.length > 0) {
          this.dataBF.nome = data[0].titularBolsaFamilia.nome;
          this.dataBF.nis = data[0].titularBolsaFamilia.nis;
          this.dataBF.municipio = data[0].municipio.nomeIBGE;
          this.dataBF.quantidadeDependentes = data[0].quantidadeDependentes;
          this.consultaDFSM(data[0].titularBolsaFamilia.nis);
          this.waitingGovBr = false;
          this.consultaBFDisponivel = true;
        } else {
          this.exibeMensagem('Não encontrou dados de benefícios para o período');
          this.consultaBFDisponivel = false;
        }
      });

    this.waitingGovBr = true;
    this.consultaBeneficiosBrService.getAuxilioEmergencial(this.cpfOuNis.value)
      .subscribe((data: AuxilioEmergencial[]) => {
        console.log('data aux: ', data);
        this.auxilios = data;
        this.waitingGovBr = false;
      })

  }

  private getMesReferenciaConsulta() {
    return this.mesReferencia.value.substring(2, 6) + this.mesReferencia.value.substring(0, 2);
  }

  private consultaDFSM(nis: string) {
    this.waitingGovDf = true;
    this.consultaBeneficioDfService.getBeneficiosNoDF(nis, this.getMesReferenciaConsulta())
      .subscribe((data: DataBeneficioDF) => {
        if (data && data.content.length > 0) {
          this.dataBF.valorBolsaFamilia = data.content[0].valorBolsaFamilia;
          this.dataBF.valorDfSemMiseria = data.content[0].valorDfSemMiseria;
          this.dataBF.valorBolsaSocial = data.content[0].valorBolsaSocial;
          this.dataBF.valorOutros = data.content[0].valorOutros;
          this.dataBF.valorTotal = data.content[0].valorTotal;
          this._consultaDFDisponivel = true;
        } else {
          this.exibeMensagem('Não encontrou dados de benefícios para o período');
          this._consultaDFDisponivel = false;
        }
        this.waitingGovDf = false;
      });
  }

  cpfOuNisValidator(cb: (((_: string) => boolean))): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || !cb(control.value))) {
        return { cpf_invalido: true };
      }
      return null;
    };
  }

  validaCpfOuNis(inputCPF: string): boolean {
    return validaCpf(inputCPF) || validaNis(inputCPF);
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.mesReferencia.value;
    ctrlValue.year(normalizedYear.year());
    this.mesReferencia.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.mesReferencia.value;
    ctrlValue.month(normalizedMonth.month());
    this.mesReferencia.setValue(ctrlValue);
    datepicker.close();
  }


  exibeMensagem(mensagem: string) {
    this._snackBar.open(mensagem, ' X ', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  ativarNovaConsulta() {
    if (this.emConsulta) {
      this.auxilios=[];
      this.emConsulta=false;
      this.dataBF={};
      this.consultaBFDisponivel=false;
    }
  }

}
