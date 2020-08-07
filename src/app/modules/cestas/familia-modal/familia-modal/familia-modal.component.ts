import { Component, OnInit, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { MensagemBarraService } from '../../../../core/services/mensagem-barra/mensagem-barra.service';
import { dataValidator } from '../../../../core/validators/dataValidators';
import { dateIntltoDateBrString, dataBrtoDateString, validaCpf } from 'src/app/shared/utils/mylibs';
import { FamiliasEmergencialService } from 'src/app/core/services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { LocaisEntregaService } from 'src/app/core/services/corrente-brasilia/locais-entrega/locais-entrega.service';
import { ValidatorCpfService } from '../../../../core/validators/validator-cpf.service';
import { debounceTime } from 'rxjs/operators';
import { LocaisEntrega } from 'src/app/shared/models/locais-entrega.model';

@Component({
  selector: 'app-familia-modal',
  templateUrl: './familia-modal.component.html',
  styleUrls: ['./familia-modal.component.css'],
})
export class FamiliaModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FamiliaModalComponent>,
    private _snackBar: MatSnackBar,
    private familiaEmergencialService: FamiliasEmergencialService,
    private locaisEntregaService: LocaisEntregaService,
    private cpfValidatorService: ValidatorCpfService,
    private mensagem: MensagemBarraService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { familia: FamiliaEmergencial }
  ) { }


  familiaEmergencial: FamiliaEmergencial;
  cpfInvalido: boolean;
  cadastroForm: FormGroup;
  nomeResponsavel = new FormControl('', [
    Validators.required
  ]);
  dataNascto = new FormControl('',
    dataValidator);
  // cpfResp = new FormControl('', [
  //   cpfValidator,
  //   this.cpfValidatorService.cpfDuplicado(),
  // ]);
  telefone = new FormControl('', [
    Validators.required,
    Validators.minLength(8)
  ]);
  endereco = new FormControl('', [
    Validators.required
  ]);
  referencia = new FormControl('', [
  ]);
  cidade = new FormControl('', []);
  quantidade = new FormControl('', [
    Validators.required,
    Validators.min(1),
  ]);
  quantcriancas = new FormControl('');
  tipomoradia = new FormControl('');
  statusemprego = new FormControl('');
  dtstatusemprego = new FormControl('');
  nomeConjuge = new FormControl('');
  cpfConjuge = new FormControl('');
  dataNasctoConjuge = new FormControl('');
  desejaMsg = new FormControl('');
  desejaAuxEspiritual = new FormControl('');
  descricao = new FormControl('');
  recebeAuxGoverno = new FormControl('');

  locaisDeEntrega = [];

  statussemprego = [
    'EMPREGADO',
    'DESEMPREGADO',
    'AUTÔNOMO',
    'APOSENTADO',
    'DO LAR'
  ];

  tiposmoradia = [
    'PROPRIA',
    'ALUGADA',
    'CEDIDA',
    'SEM TETO'
  ];

  auxGoverno = [
    'BOLSA FAMILIA',
    'BPC',
    'AUXÍLIO EMERGENCIAL',
    'OUTROS',
    'NÃO RECEBE BENEFÍCIO'
  ];

  ngOnInit(): void {
    const { cestasBasicasDaFamilia, ...familia } = this.data.familia;
    this.familiaEmergencial = familia;

    this.recuperarLocaisDeEntrega()

    this.cadastroForm = this.fb.group({
      codFamilia: [''],
      nomeResponsavel: this.nomeResponsavel,
      dataNascto: this.dataNascto,
      cpfResp: ['', [
        // cpfValidator,
        // this.cpfValidatorService.cpfDuplicado(),
      ]],
      telefone: this.telefone,
      endereco: this.endereco,
      referencia: this.referencia,
      localEntregaId: [''],
      cidade: this.cidade,
      quantidade: this.quantidade,
      quantcriancas: this.quantcriancas,
      tipomoradia: this.tipomoradia,
      statusemprego: this.statusemprego,
      dtstatusemprego: this.dtstatusemprego,
      nomeConjuge: this.nomeConjuge,
      cpfConjuge: this.cpfConjuge,
      dataNasctoConjuge: this.dataNasctoConjuge,
      desejaMsg: this.desejaMsg,
      desejaAuxEspiritual: this.desejaAuxEspiritual,
      descricao: this.descricao,
      recebeAuxGoverno: this.recebeAuxGoverno,
      totalPessoasRenda: [0],
    });
    console.log('fimform');

    this.cadastroForm.get('cpfResp')
      .valueChanges
      .pipe(debounceTime(500))
      .subscribe(dataValue => {
        this.verificaCpfDuplicado();
        this.cpfInvalido = !validaCpf(dataValue);
        console.log('datavalue: ', dataValue);
      })

    console.log('formulário criado');
    this.carregaFormulario();
    // this.carregaFormulario();
  }

  private recuperarLocaisDeEntrega() {
    this.locaisEntregaService.recuperarLocaisEntrega()
      .subscribe((locais: LocaisEntrega[]) => {
        this.locaisDeEntrega = locais;
        console.log('locais: ', locais);
      },
        error => {
          console.log('Erro ao recuperar locais de entrega');
        })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private carregaFormulario() {
    console.log('data carga: ', this.data);

    const { cestasBasicasDaFamilia, ...familia } = this.data.familia;
    this.familiaEmergencial = familia;

    console.log('date type: ', familia.datanasc2);
    this.cadastroForm.patchValue({
      cpfResp: familia.cpf,
      nomeResponsavel: familia.nome,
      dataNascto: familia.datanasc2 ? dateIntltoDateBrString(familia.datanasc2) : null,
      telefone: familia.Telefone,
      endereco: familia.quadra,
      cidade: familia.cidade,
      quantcriancas: familia.quantcriancas || 0,
      quantidade: familia.quantidade || 0,
      nomeConjuge: familia.Conjuge,
      referencia: familia.referencia_endereco,
      cpfConjuge: familia.cpf_conjuge,
      dataNasctoConjuge: familia.data_nasc_conjuge ? dateIntltoDateBrString(familia.data_nasc_conjuge) : null,
      tipomoradia: familia.tipo_moradia,
      statusemprego: familia.status_emprego,
      totalPessoasRenda: familia.totalPessoasRenda,
      desejaMsg: !!familia.deseja_msg,
      desejaAuxEspiritual: !!familia.deseja_aux_espiritual,
      descricao: familia.descricao,
      recebeAuxGoverno: familia.recebe_aux_governo ? familia.recebe_aux_governo.split(',') : null,
      localEntregaId: familia.localEntregaId,
    });

  }

  private normalizaFamilia() {
    this.familiaEmergencial.nis = this.familiaEmergencial.nis || '';
    this.familiaEmergencial.status_emprego = this.familiaEmergencial.status_emprego || '';
    this.familiaEmergencial.data_nasc_conjuge = this.familiaEmergencial.data_nasc_conjuge || '';
    this.familiaEmergencial.cpf_conjuge = this.familiaEmergencial.cpf_conjuge || '';
    this.familiaEmergencial.deseja_msg = !!this.familiaEmergencial.deseja_msg;
    this.familiaEmergencial.deseja_aux_espiritual = !!this.familiaEmergencial.deseja_aux_espiritual;
  }

  submitFormulario() {
    this.familiaEmergencial.nome = this.nomeResponsavel.value.toUpperCase();
    this.familiaEmergencial.datanasc2 = dataBrtoDateString(this.dataNascto.value);
    this.familiaEmergencial.cpf = this.getFromForm('cpfResp');
    this.familiaEmergencial.Telefone = this.telefone.value;
    this.familiaEmergencial.quadra = this.endereco.value;
    this.familiaEmergencial.cidade = this.cidade.value;
    this.familiaEmergencial.referencia_endereco = this.referencia.value;
    this.familiaEmergencial.quantcriancas = parseInt(this.quantcriancas.value);
    this.familiaEmergencial.quantidade = parseInt(this.quantidade.value);
    this.familiaEmergencial.Conjuge = this.getFromForm('nomeConjuge') ? this.getFromForm('nomeConjuge').toUpperCase() : '';
    this.familiaEmergencial.cpf_conjuge = this.cpfConjuge.value;
    this.familiaEmergencial.data_nasc_conjuge = dataBrtoDateString(this.dataNasctoConjuge.value);
    this.familiaEmergencial.tipo_moradia = this.tipomoradia.value;
    this.familiaEmergencial.status_emprego = this.statusemprego.value;
    this.familiaEmergencial.totalPessoasRenda = this.getFromForm('totalPessoasRenda');
    this.familiaEmergencial.deseja_msg = !!this.desejaMsg.value;
    this.familiaEmergencial.deseja_aux_espiritual = !!this.desejaAuxEspiritual.value;
    this.familiaEmergencial.descricao = this.descricao.value;
    this.familiaEmergencial.recebe_aux_governo = this.recebeAuxGoverno.value ? this.recebeAuxGoverno.value.toString() : '';
    this.familiaEmergencial.status = 7;

    this.familiaEmergencial.localEntregaId = parseInt(this.getFromForm('localEntregaId')) || 0;

    this.normalizaFamilia();

    if (this.familiaEmergencial.codfamilia) {
      this.familiaEmergencial.dataAtualizacao = new Date().toISOString();
      this.familiaEmergencialService.atualizarFamiliaEmergencial(this.familiaEmergencial)
        .subscribe(() => {
          console.log('dados atualizados');
          this.mensagem.sucesso('Cadastro atualizado com sucesso.');
          this.fechadialogo(this.familiaEmergencial);
        },
          error => {
            this.mensagem.erro('Erro ao salvar os dados da família !!!');
            console.log('error: ', error);
          })
    } else {
      this.familiaEmergencial.data = new Date().toISOString();
      this.familiaEmergencialService.incluirFamiliaEmergencial(this.familiaEmergencial)
        .subscribe((data: FamiliaEmergencial) => {
          this.mensagem.sucesso('Família incluída com sucesso.');
          this.fechadialogo(data);
        },
          error => {
            this.mensagem.erro('Erro ao incluir os dados da família !!!');
            console.log('error: ', error);
          })
    }
  }


  private getFromForm(formField: string): any {
    return this.cadastroForm.controls[formField].value;
  }

  private fechadialogo(dataRetorno: any) {
    this.dialogRef.close(dataRetorno);
  }

  getErrorCpfResp() {
    if (!this.getFromForm('cpfResp')) return null;
    if (this.cadastroForm.controls['cpfResp'].hasError('required')) {
      return 'Informe o CPF';
    }

    if (this.cadastroForm.controls['cpfResp'].hasError('minlength')) {
      return 'Informe todos os números do CPF';
    }

    if (this.cadastroForm.controls['cpfResp'].hasError('pattern')) {
      return 'Informe apenas números';
    }

    return this.cadastroForm.controls['cpfResp'].hasError('cpf_invalido') ? 'CPF não é válido' : null;
  }

  getErrorCpfConjuge() {
    if (!this.cpfConjuge.value) return null;
    if (this.cpfConjuge.hasError('required')) {
      return 'Informe o CPF';
    }

    if (this.cpfConjuge.hasError('minlength')) {
      return 'Informe todos os números do CPF';
    }

    if (this.cpfConjuge.hasError('pattern')) {
      return 'Informe apenas números';
    }

    return this.cpfConjuge.hasError('cpf_invalido') ? 'CPF não é válido' : null;
  }

  verificaCpfDuplicado(evento: any = '') {
    console.log('familia: ', this.familiaEmergencial);
    let cpf = this.getFromForm('cpfResp');
    if (!cpf || cpf == '') { return; }
    this.familiaEmergencialService.recuperarFamiliaEmergencialCPFNomeDataNascto(cpf)
      .subscribe((familias: FamiliaEmergencial[]) => {
        if (familias.length > 0) {
          console.log('duplicados: ', familias);
          let dup = familias.filter((familia: FamiliaEmergencial) => familia.codfamilia == this.familiaEmergencial.codfamilia);
          console.log('dup: ', dup);
          if (dup.length == 0) {
            this.cadastroForm.controls['cpfResp'].setErrors({ 'cpf_duplicado': true });
          }
        }
      })
  }

  setLocalEntrega() {
    let testes = this.cadastroForm.controls['localEntregaId'].value;
    console.log('localEntrega: ', testes);
  }


}
