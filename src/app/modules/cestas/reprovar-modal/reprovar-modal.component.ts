import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FamiliaModalComponent } from '../familia-modal/familia-modal/familia-modal.component';
import { FamiliasEmergencialService } from 'src/app/core/services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { MensagemBarraService } from 'src/app/core/services/mensagem-barra/mensagem-barra.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { cpfValidator } from 'src/app/core/validators/cpfValidator';
import { dateTimeTZToDate, novaDataString } from 'src/app/shared/utils/mylibs';

@Component({
  selector: 'app-encaminhar-modal',
  templateUrl: './reprovar-modal.component.html',
  styleUrls: ['./reprovar-modal.component.css']
})
export class ReprovarModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FamiliaModalComponent>,
    private familiaEmergencialService: FamiliasEmergencialService,
    private mensagem: MensagemBarraService,
    fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { familia: FamiliaEmergencial }
  ) {
    this.cadastroForm = fb.group({
      nomeResponsavel: this.nomeResponsavel,
      cpfResp: this.cpfResp,
      motivoReprovar: ['', [
        Validators.required
      ]]
    });
    this.carregaFormulario();
  }

  familiaEmergencial: FamiliaEmergencial;
  cadastroForm: FormGroup;
  nomeResponsavel = new FormControl('', [
    Validators.required
  ]);
  cpfResp = new FormControl('', [
    cpfValidator
  ]);

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

    console.log('date type: ', typeof familia.datanasc2);
    this.cadastroForm.patchValue({
      cpfResp: familia.cpf,
      nomeResponsavel: familia.nome,
    });

  }

  encaminharParaAtendimento() {
    this.familiaEmergencialService.reprovarFamiliaEmergencial(
      this.familiaEmergencial,
      this.cadastroForm.controls['motivoReprovar'].value)
      .subscribe(() => {
        console.log('dados atualizados');
        this.mensagem.sucesso('Situação da família alterada para reprovada.');
        this.fechadialogo(this.familiaEmergencial);
      },
        error => {
          this.mensagem.erro('Erro ao encaminhar família para atendimento !!!');
          console.log('error: ', error);
        })
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
