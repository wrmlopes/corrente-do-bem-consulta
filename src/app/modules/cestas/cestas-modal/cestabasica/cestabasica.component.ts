import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CestaBasica } from 'src/app/shared/models/cesta-basica';

@Component({
  selector: 'app-cestabasica',
  templateUrl: './cestabasica.component.html',
  styleUrls: ['./cestabasica.component.css']
})
export class CestabasicaComponent implements OnInit, OnChanges {

  @Output() temResposta = new EventEmitter<CestaBasica | null>();
  @Input() cestaBasicaFrom: CestaBasica;

  constructor(
    private cestaFormBuilder: FormBuilder,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes: ', changes);
  }

  ngOnInit(): void {
    console.log('init edit cestas');
    this.inicializaFormulario();
    this.carregaFormulario();

    console.log('cestasfrom: ', this.cestaBasicaFrom);
  }


  cestaForm: FormGroup;
  voluntario = new FormControl('');
  dataEntrega = new FormControl('');

  cestaBasica: CestaBasica = {};

  private carregaFormulario() {
    this.cestaForm.patchValue({
      voluntario: this.cestaBasicaFrom.voluntario,
      dataEntrega: this.cestaBasicaFrom.data,
    })
  }

  private inicializaFormulario() {
    this.cestaForm = this.cestaFormBuilder.group({
      voluntario: this.voluntario,
      dataEntrega: this.dataEntrega,
    });
  }

  // retorna reposta nula
  cancelar() {
    this.temResposta.emit(null);
  }

  // atualiza a cestaBasicaFrom e retorna com os valores atualizados
  submitFormulario() {
    console.log(this.dataEntrega.value);
    this.cestaBasicaFrom.voluntario = this.voluntario.value;
    this.cestaBasicaFrom.data = new Date(this.dataEntrega.value).toISOString();
    this.temResposta.emit(this.cestaBasicaFrom);
  }
}
