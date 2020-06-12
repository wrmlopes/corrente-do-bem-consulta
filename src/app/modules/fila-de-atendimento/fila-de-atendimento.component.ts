import { Component, OnInit, OnDestroy, ViewChild, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UrlTree } from '@angular/router';

import { OnComponentDeactivate } from '../../core/guards/can-deactivate.guard';

import { FamiliasEmergencialService } from 'src/app/core/services/corrente-brasilia/familias-emergencial/familias-emergencial.service';
import { FamiliaEmergencial } from 'src/app/shared/models/familia-emergencial';
import { CadastroFilaDeAtendimentoComponent } from './cadastro-fila-de-atendimento/cadastro-fila-de-atendimento.component';

@Component({
  selector: 'app-fila-de-atendimento',
  templateUrl: './fila-de-atendimento.component.html',
  styleUrls: ['./fila-de-atendimento.component.css']
})
export class FilaDeAtendimentoComponent implements OnInit, OnDestroy, OnComponentDeactivate, OnChanges {
  @ViewChild(CadastroFilaDeAtendimentoComponent) filaCadastro: CadastroFilaDeAtendimentoComponent;

  familiasNaFila: number = 0;
  loadingFamilias: boolean;
  loadingFamilia: boolean;
  recuperarFamiliaObservable = this.familiasEmergencialService.recuperarFamiliaEmergencialNaFilaDeAtendimento();
  salvouFamilia: boolean;

  constructor(
    private familiasEmergencialService: FamiliasEmergencialService
  ) { }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('changes: ', changes);
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> | UrlTree {
    console.log('canDeactivate')
    if (this.emAtendimento) {
      return this.cancelarAtendimento();
    } else {
      return true;
    }
  };

  ngOnDestroy(): void {
    console.log('destroy');
  }

  ngOnInit(): void {
    console.log('init');
    this.atualizaFilaDeAtendimento();
  }

  private atualizaFilaDeAtendimento() {
    this.ativarLoadingRecuperarFamilias();
    this.recuperarFamiliaObservable
    .pipe( finalize(() => this.desativarLoadingRecuperarFamilias))
      .subscribe((data: FamiliaEmergencial[]) => {
        this.familiasNaFila = data.length;
        console.log('data: ', data);
        this.desativarLoadingRecuperarFamilias();
      })
  }

  carregarProximaFamilia() {
    this.ativarLoadingRecuperar();
    this.recuperarFamiliaObservable
      .pipe( finalize(() => this.desativarLoadingRecuperar()))
      .subscribe((data: FamiliaEmergencial[]) => {
        if (data && data.length > 0) {
          console.log('recuperou: ', data[0]);
          this.ativaCadastroFilaDeAtendimento(data[0]);
        }
      });
    }
    
    ativaCadastroFilaDeAtendimento( data: FamiliaEmergencial) {
      this.filaCadastro.carregaDadosFamiliaEmergencial(data);
  }

  private desativarLoadingRecuperar(): void {
    this.loadingFamilia = false;
  }

  private ativarLoadingRecuperar() {
    this.loadingFamilia = true;
  }

  private desativarLoadingRecuperarFamilias(): void {
    this.loadingFamilias = false;
  }

  private ativarLoadingRecuperarFamilias() {
    this.loadingFamilias = true;
  }
  
  /**
   * Recuperar status de cadastro no componente CadastroFilaDeAtendimento
   */
  get emAtendimento(): boolean {
    if (this.filaCadastro) {
      return this.filaCadastro.emAtendimento;
    }
  }

  cancelarAtendimento(): boolean {
    return this.filaCadastro.cancelarAtendimento();
  }

}
