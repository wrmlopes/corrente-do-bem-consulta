import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CestaBasica } from 'src/app/shared/models/cesta-basica';
import { consolelog, dataBrtoDateString } from 'src/app/shared/utils/mylibs';

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
    consolelog('changes: ', changes);
  }

  ngOnInit(): void {
    consolelog('init edit cestas');
    this.inicializaFormulario();
    this.carregaFormulario();

    consolelog('cestasfrom: ', this.cestaBasicaFrom);
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
    consolelog(this.dataEntrega.value);
    this.cestaBasicaFrom.voluntario = this.voluntario.value;
    this.cestaBasicaFrom.data = new Date(this.dataEntrega.value).toISOString();
    this.temResposta.emit(this.cestaBasicaFrom);
  }
}
