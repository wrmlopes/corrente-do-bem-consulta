import { Component, OnInit } from '@angular/core';
import { ConsultaBeneficiosDfService } from 'src/app/core/services/consulta-beneficios-df/consulta-beneficios-df.service';
import { ConsultaBeneficiosBrService } from 'src/app/core/services/consulta-beneficios-br/consulta-beneficios-br.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';

// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { validaCpf, dateTimeTZToDate, novaDataString, consolelog, dateIntltoDateBrString, dataBrtoDateString } from 'src/app/shared/utils/mylibs';
import { FamiliasEmergencialService } from 'src/app/core/services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { DatePipe } from '@angular/common';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { MensagemBarraService } from 'src/app/core/services/mensagem-barra/mensagem-barra.service';


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
    private familiaEmergencialService: FamiliasEmergencialService,
    private mensagem: MensagemBarraService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
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
  }

  displayPesquisa = true;
  displayGrid = false;
  cpf: string = '';
  nome: string = '';
  familias: FamiliaEmergencial[]=[];
  inConsulta = false;

  // controles de formulário
  cadastroForm: FormGroup;
  nomeResponsavel = new FormControl('', [
    Validators.required
  ]);
  dataNascto = new FormControl('', [
    Validators.required
  ]);
  cpfResp = new FormControl('', [
    this.cpfValidator(validaCpf.bind(this))
  ]);
  telefone = new FormControl('', [
    Validators.required
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


  // auxiliares
  gravacaoPermitida = false;
  waiting = false;
  msgError = null;
  msgWarning = null;
  familiaEmergencial: FamiliaEmergencial;

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

  get desativaConsulta() {
    return this.cpfResp.invalid && this.nomeResponsavel.invalid;
  }

  submitFormulario() {
    this.familiaEmergencial.nome = this.nomeResponsavel.value.toUpperCase();
    this.familiaEmergencial.datanasc2 = dataBrtoDateString(this.dataNascto.value);
    this.familiaEmergencial.cpf = this.cpfResp.value;
    this.familiaEmergencial.Telefone = this.telefone.value;
    this.familiaEmergencial.quadra = this.endereco.value;
    this.familiaEmergencial.cidade = this.cidade.value;
    this.familiaEmergencial.referencia_endereco = this.referencia.value;
    this.familiaEmergencial.quantcriancas = parseInt(this.quantcriancas.value);
    this.familiaEmergencial.quantidade = parseInt(this.quantidade.value);
    this.familiaEmergencial.Conjuge = this.nomeConjuge.value.toUpperCase();
    this.familiaEmergencial.cpf_conjuge = this.cpfConjuge.value;
    this.familiaEmergencial.data_nasc_conjuge = dataBrtoDateString(this.dataNasctoConjuge.value);
    this.familiaEmergencial.tipo_moradia = this.tipomoradia.value;
    this.familiaEmergencial.status_emprego = this.statusemprego.value;
    this.familiaEmergencial.deseja_msg = !!this.desejaMsg.value;
    this.familiaEmergencial.deseja_aux_espiritual = !!this.desejaAuxEspiritual.value;
    this.familiaEmergencial.descricao = this.descricao.value;
    this.familiaEmergencial.recebe_aux_governo = this.recebeAuxGoverno.value ? this.recebeAuxGoverno.value.toString() : '';
    this.familiaEmergencial.status = 7;

    this.normalizaFamilia();

    if (this.familiaEmergencial.codfamilia) {
      this.familiaEmergencial.dataAtualizacao = new Date().toISOString();
      this.familiaEmergencialService.atualizarFamiliaEmergencial(this.familiaEmergencial)
        .subscribe(() => {
          consolelog('dados atualizados');
          this.mensagem.sucesso('Cadastro atualizado com sucesso.');
          this.novaPesquisa();
        },
          error => {
            this.mensagem.erro('Erro ao salvar os dados da família !!!');
            consolelog('error: ', error);
          })
    } else {
      this.familiaEmergencial.data = new Date().toISOString();
      this.familiaEmergencialService.incluirFamiliaEmergencial(this.familiaEmergencial)
        .subscribe((data: FamiliaEmergencial) => {
          this.mensagem.sucesso('Família incluída com sucesso.');
          this.novaPesquisa();
        },
          error => {
            this.mensagem.erro('Erro ao incluir os dados da família !!!');
            consolelog('error: ', error);
          })
    }
  }

  novaPesquisa() {
    this.nome = '';
    this.cpf = '';
    this.familias = [];
    this.displayGrid = false;
    this.displayPesquisa = true;
    this.inConsulta = false;
  }

  // captura clique na família escolhida e carrega os dados para o cadastro
  clicou(i: number){
    this.carregaDadosFamiliaEmergencial(this.familias[i]);
  }

  /** verifica os dados do responsável: se está cadastrado na corrente ou se já estava cadastrado */
  pesquisa() {
    this.inConsulta = true;
    this.ativarLoading();
    this.familiaEmergencial = {};
    const nome = this.nome.length ? this.nome.toUpperCase() : null;
    this.familiaEmergencialService
      .recuperarFamiliaEmergencialCPFNomeDataNascto(this.cpf, nome)
      .subscribe((data: FamiliaEmergencial[]) => {
        this.desativarLoading();

        if (!data.length) {
          this.mensagem.info('Não encontramos família com os dados informados. Refaça a pesquisa !!');
          this.novaPesquisa();
          return;
        }

        if (data.length > 5){
          this.mensagem.alerta(`Foram encontradas ${data.length} famílias com os dados informados. Repita a busca informando mais caracteres no nome.`);
          this.inConsulta = false;
          return;
        }

        if (data.length === 1){
          this.carregaDadosFamiliaEmergencial(data[0]);
          return;
        };

        // apresenta o grid para seleção da família
        this.displayGrid = true;
        this.familias = data;

        // a próxima ação vem do grid ou dos menus da aplicação

        // console.log('data: ', data);
        // if (data.length > 0) {
        //   if (!data[0].status || [0, 4, 5, 7].includes(data[0].status)) {
        //     if (data[0].status === 0) {
        //       this.mensagem.sucesso('Atenção !! Você fará alterações nesse cadastro.');
        //     }
        //   } else {
        //     this.mensagem.erro(`Família já possui cadastro validado. Alterações não permitidas !!!`, 10000);
        //     this.inicializaFormulario();
        //     return;
        //   }
        //   this.familiaEmergencial = data[0];
        //   this.carregaDadosFamiliaEmergencial(this.familiaEmergencial);
        // } else {
        //   this.mensagem.info('Você irá incluir os dados desta família.')
        // }
      },
        error => {
          this.mensagem.erro('Ocorreu um erro quando buscava família. Tente novamente mais tarde !!!');
          this.desativarLoading()
        }
      )
  }

  private carregaDadosFamiliaEmergencial(data: FamiliaEmergencial) {
    consolelog('data: ', data);

    consolelog('date type: ', data.datanasc2);
    this.cadastroForm.patchValue({
      cpfResp: data.cpf,
      nomeResponsavel: data.nome,
      dataNascto: data.datanasc2 ? dateIntltoDateBrString(data.datanasc2) : null,
      telefone: data.Telefone,
      endereco: data.quadra,
      cidade: data.cidade,
      quantcriancas: data.quantcriancas || 0,
      quantidade: data.quantidade || 0,
      nomeConjuge: data.Conjuge,
      referencia: data.referencia_endereco,
      cpfConjuge: data.cpf_conjuge,
      dataNasctoConjuge: data.data_nasc_conjuge ? dateIntltoDateBrString(data.data_nasc_conjuge) : null,
      tipomoradia: data.tipo_moradia,
      statusemprego: data.status_emprego,
      desejaMsg: !!data.deseja_msg,
      desejaAuxEspiritual: !!data.deseja_aux_espiritual,
      descricao: data.descricao,
      recebeAuxGoverno: data.recebe_aux_governo ? data.recebe_aux_governo.split(',') : null,
    });

    this.familiaEmergencial = data;
    // this.normalizaFamilia();

    this.displayPesquisa = false;

  }

  private normalizaFamilia() {
    this.familiaEmergencial.nis = this.familiaEmergencial.nis || '';
    this.familiaEmergencial.status_emprego = this.familiaEmergencial.status_emprego || '';
    this.familiaEmergencial.data_nasc_conjuge = this.familiaEmergencial.data_nasc_conjuge || '';
    this.familiaEmergencial.cpf_conjuge = this.familiaEmergencial.cpf_conjuge || '';
    this.familiaEmergencial.deseja_msg = !!this.familiaEmergencial.deseja_msg;
    this.familiaEmergencial.deseja_aux_espiritual = !!this.familiaEmergencial.deseja_aux_espiritual;
  }

  private desativarLoading() {
    this.waiting = false;
  }

  private ativarLoading() {
    this.waiting = true;
  }

  cpfValidator(cb: (((_: string) => boolean))): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      consolelog("control value: [", control.value, "]");
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

  private inicializaFormulario() {
    this.cadastroForm.reset();
    let elemento = document.getElementById(`cpfResp`);
    if (elemento) elemento.focus();
  }

}
