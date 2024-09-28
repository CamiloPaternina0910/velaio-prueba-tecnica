import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChipsModule } from 'primeng/chips';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ValidadorService } from '../../services/validador.service';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ChipsModule,
  ],
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css',
  providers: [MessageService, ValidadorService],
})
export class PersonaComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _dialogConfig: DynamicDialogConfig,
    private _dialogRef: DynamicDialogRef,
    private _validadorService: ValidadorService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.setaerValoresDelFormularioConPersonaSiExiste();
  }

  private inicializarFormulario() {
    this.formulario = this._formBuilder.group({
      nombreCompleto: [null, this._validadorService.requerido('nombre')],
      edad: [0, this._validadorService.valorMinimoPermitido(18, 'edad')],
      habilidades: [
        null,
        this._validadorService.esArrayYNoVacio('habilidades'),
      ],
    });
  }

  private setaerValoresDelFormularioConPersonaSiExiste() {
    let persona = this._dialogConfig.data?.persona;

    if (persona) {
      this.formulario.reset(persona);
    }
  }

  cerrarDialogo(registrarTarea = false) {
    if (registrarTarea) {
      if (this.formulario.invalid) {
        this._validadorService.mostrarToastConErrores(this.formulario);
        return;
      } else this._dialogRef.close(this.formulario.value);
    }

    this._dialogRef.close();
  }
}
