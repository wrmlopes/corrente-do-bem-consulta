import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaBeneficiarioComponent } from './consulta-beneficiario.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [ConsultaBeneficiarioComponent],
    imports: [ 
        CommonModule,
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        MatCardModule,
        MatSnackBarModule,
        NgxMaskModule.forRoot(),
     ],
     providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }],
})
export class ConsultaBeneficiarioModule { }