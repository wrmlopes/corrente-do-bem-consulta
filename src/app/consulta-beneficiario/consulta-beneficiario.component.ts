import { Component, OnInit } from '@angular/core';
import { ConsultaBeneficiosService } from '../services/consulta-beneficios.service';
import { BfDisponibilizado } from '../models';
import { BFApresentado } from '../models/bf-apresentado.models';

@Component({
  selector: 'app-consulta-beneficiario',
  templateUrl: './consulta-beneficiario.component.html',
  styleUrls: ['./consulta-beneficiario.component.css']
})
export class ConsultaBeneficiarioComponent implements OnInit {

  _cpfBeneficiario: string;
  _anoMesReferencia: string;
  _emConsulta: boolean = false;
  _consultaBFDisponivel: boolean = false;
  _dataBF : BFApresentado = {};

  constructor( 
    private consultaBeneficioService: ConsultaBeneficiosService) { }

  ngOnInit(): void {
    this._cpfBeneficiario = '';
  }

  get emConsulta() {
    return this._emConsulta;
  }

  get cpfBeneficiario() {
    return this._cpfBeneficiario;
  }

  set cpfBeneficiario(valor:string){
    this._cpfBeneficiario = valor;
  }

  get anoMesReferencia() {
    return this._anoMesReferencia;
  }

  set anoMesReferencia(valor: string) {
    this._anoMesReferencia = valor;
  }

  get consultaBFDisponivel() {
    return this._consultaBFDisponivel;
  }

  get dataBF() {
    return this._dataBF;
  }

  consultaBeneficiario(){
    this._emConsulta = true;

    this.consultaBeneficioService.getBeneficioBolsaFamilia(this.cpfBeneficiario, this.anoMesReferencia)
       .subscribe((data : BfDisponibilizado[]) => {
         console.log(data);
         this._dataBF = {};
         if (data.length>0){
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

    console.log('beneficiario: ', this._cpfBeneficiario);
  }



}
