import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { cpfValidator } from '../../../core/validators/cpfValidator';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { dateTimeTZToDate, novaDataString } from 'src/app/shared/utils/mylibs';
import { FamiliasEmergencialService } from 'src/app/core/services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastro-fila-de-atendimento',
  templateUrl: './cadastro-fila-de-atendimento.component.html',
  styleUrls: ['./cadastro-fila-de-atendimento.component.css']
})
export class CadastroFilaDeAtendimentoComponent implements OnInit {

  cadastroForm: FormGroup;
  dadosdaFila: FamiliaEmergencial;
  familiaEmergencial: FamiliaEmergencial;
  emAtendimento: boolean;

  constructor(
    private familiaEmergencialService: FamiliasEmergencialService,
    private _snackBar: MatSnackBar,
    fb: FormBuilder,
  ) {
    this.cadastroForm = fb.group({
      nomeResponsavel: this.nomeResponsavel,
      dataNascto: this.dataNascto,
      cpfResp: this.cpfResp,
      telefone: this.telefone,
      endereco: this.endereco,
      referencia: this.referencia,
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
    });
  }

  ngOnInit(): void {
    console.log('init cad fila');
  }

  carregaDadosFamiliaEmergencial(data: FamiliaEmergencial) {
    console.log('data: ', data);
    this.emAtendimento = true;
    this.familiaEmergencial = data;
    this.normalizaFamilia();
    this.familiaEmergencial.status = 5; // em atendimento
    this.familiaEmergencial.dataAtualizacao = new Date().toISOString();
    this.familiaEmergencialService.atualizarFamiliaEmergencial(this.familiaEmergencial)
      .subscribe(
        () => console.log('em atendimento'),
        error => console.log('erro: ', error)
      )

    console.log('date type: ', typeof data.datanasc2);
    this.cadastroForm.patchValue({
      cpfResp: data.cpf,
      nomeResponsavel: data.nome,
      dataNascto: data.datanasc2 ? dateTimeTZToDate(data.datanasc2) : null,
      telefone: data.Telefone,
      endereco: data.quadra,
      cidade: data.cidade,
      quantcriancas: data.quantcriancas,
      quantidade: data.quantidade,
      nomeConjuge: data.Conjuge,
      referencia: data.referencia_endereco,
      cpfConjuge: data.cpf_conjuge,
      dataNasctoConjuge: data.data_nasc_conjuge ? dateTimeTZToDate(data.data_nasc_conjuge) : '',
      tipomoradia: data.tipo_moradia,
      statusemprego: data.status_emprego,
      desejaMsg: data.deseja_msg,
      desejaAuxEspiritual: data.deseja_aux_espiritual,
      descricao: data.descricao,
      recebeAuxGoverno: data.recebe_aux_governo ? data.recebe_aux_governo.split(',') : null,
    });
  }


  /**
   * Controles do formulário
   */
  nomeResponsavel = new FormControl('', [
    Validators.required
  ]);
  dataNascto = new FormControl('', [
    Validators.required
  ]);
  cpfResp = new FormControl('', [
    cpfValidator
  ]);
  telefone = new FormControl('', [
  ]);
  endereco = new FormControl('', [
    Validators.required
  ]);
  referencia = new FormControl('', [
  ]);
  cidade = new FormControl('', [
    Validators.required
  ]);
  quantidade = new FormControl('', [
    Validators.required,
    Validators.min(1)
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


  /**
   * Atualiza os dados do formulário na base da Corrente do Bem
   */
  submitFormulario() {

    console.log('data nascto conj: ', this.dataNasctoConjuge.value);

    this.familiaEmergencial.nome = this.nomeResponsavel.value.toUpperCase();
    this.familiaEmergencial.datanasc2 = novaDataString(this.dataNascto.value);
    this.familiaEmergencial.cpf = this.cpfResp.value;
    this.familiaEmergencial.Telefone = this.telefone.value;
    this.familiaEmergencial.quadra = this.endereco.value;
    this.familiaEmergencial.cidade = this.cidade.value;
    this.familiaEmergencial.referencia_endereco = this.referencia.value;
    this.familiaEmergencial.quantcriancas = parseInt(this.quantcriancas.value);
    this.familiaEmergencial.quantidade = parseInt(this.quantidade.value);
    this.familiaEmergencial.Conjuge = this.nomeConjuge.value.toUpperCase();
    this.familiaEmergencial.cpf_conjuge = this.cpfConjuge.value ? this.cpfConjuge.value : '';
    this.familiaEmergencial.data_nasc_conjuge =  novaDataString(this.dataNasctoConjuge.value);
    this.familiaEmergencial.tipo_moradia = this.tipomoradia.value;
    this.familiaEmergencial.status_emprego = this.statusemprego.value ? this.statusemprego.value : '';
    // this.familiaEmergencial.data_status_emprego= this.dtstatusemprego.value ? new Date (this.dtstatusemprego.value).toISOString(): '';
    this.familiaEmergencial.deseja_msg = !!this.desejaMsg.value;
    this.familiaEmergencial.deseja_aux_espiritual = !!this.desejaAuxEspiritual.value;
    this.familiaEmergencial.descricao = this.descricao.value;
    this.familiaEmergencial.recebe_aux_governo = this.recebeAuxGoverno.value ? this.recebeAuxGoverno.value.toString() : '';
    this.familiaEmergencial.dataAtualizacao = new Date().toISOString();
    this.familiaEmergencial.nis = '';
    this.familiaEmergencial.status = 7;
    console.log('familia emergencial: ', this.familiaEmergencial);

    if (this.familiaEmergencial.codfamilia) {

      this.familiaEmergencialService.atualizarFamiliaEmergencial(this.familiaEmergencial)
        .subscribe(() => {
          console.log('dados atualizados');
          this.exibeMensagem('Cadastro atualizado com sucesso.', 'sucesso', 8000)
          this.inicializaFormulario();
        },
          error => {
            console.log('error: ', error);
          })
    } else {
      this.familiaEmergencialService.incluirFamiliaEmergencial(this.familiaEmergencial)
        .subscribe((data: FamiliaEmergencial) => {
          console.log('data: ', data);
          this.exibeMensagem('Família incluída com sucesso.', 'sucesso', 10000)
          this.inicializaFormulario();

        },
          error => {
            console.log('error: ', error);
          })
    }
  }

  inicializaFormulario() {
    this.cadastroForm.reset();
    this.emAtendimento = false;;
  }
  getErrorCpfResp(): string {
    return null;
  }

  getErrorCpfConjuge(): string {
    return null;
  }

  //virão de consulta
  tiposmoradia = [
    'PROPRIA',
    'ALUGADA',
    'CEDIDA',
    'SEM TETO'
  ];

  statussemprego = [
    'EMPREGADO',
    'DESEMPREGADO',
    'AUTÔNOMO',
    'DO LAR'
  ];

  auxGoverno = [
    'BOLSA FAMILIA',
    'BPC',
    'AUXÍLIO EMERGENCIAL',
    'OUTROS',
    'NÃO RECEBE BENEFÍCIO'
  ];

  exibeMensagem(mensagem: string, tipo: string = 'sucesso', tempoms: number = 8000) {
    this._snackBar.open(mensagem, ' X ', {
      duration: tempoms,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: tipo,
    });
  }

  normalizaFamilia() {
    this.familiaEmergencial.nis = this.familiaEmergencial.nis || '';
    this.familiaEmergencial.status_emprego = this.familiaEmergencial.status_emprego || '';
    this.familiaEmergencial.data_nasc_conjuge = this.familiaEmergencial.data_nasc_conjuge || '';
    this.familiaEmergencial.cpf_conjuge = this.familiaEmergencial.cpf_conjuge || '';
    this.familiaEmergencial.deseja_msg = !!this.familiaEmergencial.deseja_msg;
    this.familiaEmergencial.deseja_aux_espiritual = !!this.familiaEmergencial.deseja_aux_espiritual;
  }

  cancelarAtendimento(): boolean {
    if (!this.emAtendimento) { return true };
    if (confirm("As alterações serão perdidas, deseja prosseguir ?")) {
      this.familiaEmergencial.status = 6; // fila de espera
      this.familiaEmergencial.dataAtualizacao = new Date().toISOString();
      this.familiaEmergencialService.atualizarFamiliaEmergencial(this.familiaEmergencial)
        .subscribe(
          () => {
            this.inicializaFormulario();
            this.exibeMensagem('O atendimento foi cancelado e a família voltou para a fila de atendimento !!!', 'sucesso', 5000);
          },
          error => console.log('erro: ', error)
        )
      return true;
    } else {
      this.exibeMensagem('Prossiga com o atendimento !!!', 'sucesso', 2000);
      return false;
    }
  }

  encaminharAtendimento(): boolean {
    if (!this.emAtendimento) { return true };
    if (confirm("O cadastro será marcado como encminhado e sairá da fila de atendimento, deseja prosseguir ?")) {
      this.familiaEmergencial.status = 4; // encaminhado
      this.familiaEmergencial.dataAtualizacao = new Date().toISOString();
      this.familiaEmergencialService.atualizarFamiliaEmergencial(this.familiaEmergencial)
        .subscribe(
          () => {
            this.inicializaFormulario();
            this.exibeMensagem('O atendimento foi marcado como encaminhado !!!', 'sucesso', 5000);
          },
          error => console.log('erro: ', error)
        )
      return true;
    } else {
      this.exibeMensagem('Prossiga com o atendimento !!!', 'sucesso', 2000);
      return false;
    }
  }


}
