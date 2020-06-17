import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FamiliaModalComponent } from '../familia-modal/familia-modal/familia-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FamiliasEmergencialService } from 'src/app/core/services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { MensagemBarraService } from 'src/app/core/services/mensagem-barra/mensagem-barra.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { cpfValidator } from 'src/app/core/validators/cpfValidator';
import { dateTimeTZToDate, novaDataString } from 'src/app/core/utils/mylibs';

@Component({
  selector: 'app-encaminhar-modal',
  templateUrl: './encaminhar-modal.component.html',
  styleUrls: ['./encaminhar-modal.component.css']
})
export class EncaminharModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FamiliaModalComponent>,
    private _snackBar: MatSnackBar,
    private familiaEmergencialService: FamiliasEmergencialService,
    private mensagem: MensagemBarraService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {familia: FamiliaEmergencial}
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
      voluntario: this.voluntario,
    });
    this.carregaFormulario();
  }

  familiaEmergencial: FamiliaEmergencial;
  cadastroForm: FormGroup;
  nomeResponsavel = new FormControl('', [
    Validators.required
  ]);
  dataNascto = new FormControl('',);
  cpfResp = new FormControl('', [
    cpfValidator
  ]);
  telefone = new FormControl('', [
    Validators.required
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
  voluntario = new FormControl('');

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

  ngOnInit(): void {
    console.log('data init: ', this.data);
    // this.carregaFormulario();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private carregaFormulario() {
    console.log('data carga: ', this.data);

    this.familiaEmergencial = this.data.familia;
    let familia = this.data.familia;
    this.normalizaFamilia();

    console.log('date type: ', typeof familia.datanasc2);
    this.cadastroForm.patchValue({
      cpfResp: familia.cpf,
      nomeResponsavel: familia.nome,
      dataNascto: familia.datanasc2 ? dateTimeTZToDate(familia.datanasc2) : null,
      telefone: familia.Telefone,
      endereco: familia.quadra,
      cidade: familia.cidade,
      quantcriancas: familia.quantcriancas || 0,
      quantidade: familia.quantidade || 0,
      nomeConjuge: familia.Conjuge,
      referencia: familia.referencia_endereco,
      cpfConjuge: familia.cpf_conjuge,
      dataNasctoConjuge: familia.data_nasc_conjuge ? dateTimeTZToDate(familia.data_nasc_conjuge) : null,
      tipomoradia: familia.tipo_moradia,
      statusemprego: familia.status_emprego,
      dtstatusemprego: familia.data_status_emprego ? dateTimeTZToDate(familia.data_status_emprego) : null,
      desejaMsg: !!familia.deseja_msg,
      desejaAuxEspiritual: !!familia.deseja_aux_espiritual,
      descricao: familia.descricao,
      recebeAuxGoverno: familia.recebe_aux_governo ? familia.recebe_aux_governo.split(',') : null,
      voluntario: familia.voluntario || ''
    });

  }

  private normalizaFamilia() {
    this.familiaEmergencial.nis = this.familiaEmergencial.nis || '';
    this.familiaEmergencial.status_emprego = this.familiaEmergencial.status_emprego || '';
    this.familiaEmergencial.data_status_emprego = this.familiaEmergencial.data_status_emprego || '';
    this.familiaEmergencial.data_nasc_conjuge = this.familiaEmergencial.data_nasc_conjuge || '';
    this.familiaEmergencial.cpf_conjuge = this.familiaEmergencial.cpf_conjuge || '';
    this.familiaEmergencial.deseja_msg = !!this.familiaEmergencial.deseja_msg;
    this.familiaEmergencial.deseja_aux_espiritual = !!this.familiaEmergencial.deseja_aux_espiritual;
  }

  encaminharParaAtendimento() {

    if (this.familiaEmergencial.codfamilia) {
      this.familiaEmergencial.status = 4;
      this.familiaEmergencial.voluntario = this.voluntario.value;

      this.familiaEmergencial.dataAtualizacao = new Date().toISOString();
      this.familiaEmergencialService.atualizarFamiliaEmergencial(this.familiaEmergencial)
        .subscribe(() => {
          console.log('dados atualizados');
          this.mensagem.exibeMensagemBarra('Família encaminhada com sucesso.', 'sucesso');
          this.fechadialogo(this.familiaEmergencial);
        },
          error => {
            this.mensagem.exibeMensagemBarra('Erro ao encaminhar família para atendimento !!!', 'erro');
            console.log('error: ', error);
          })
        } else {
          this.mensagem.exibeMensagemBarra('Erro ao encaminhar família para atendimento !!!');
    }
  }


  private fechadialogo(dataRetorno: any) {
    this.dialogRef.close(dataRetorno);
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
