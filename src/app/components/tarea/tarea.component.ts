import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Persona } from '../../interfaces/persona.interface';
import { ValidadorService } from '../../services/validador.service';
import { PersonaComponent } from '../persona/persona.component';

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    ChipModule,
    ToastModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './tarea.component.html',
  styleUrl: './tarea.component.css',
  providers: [MessageService, ValidadorService],
})
export class TareaComponent implements OnInit {
  formulario!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogService: DialogService,
    private _dialogConfig: DynamicDialogConfig,
    private _dialogRef: DynamicDialogRef,
    private _validadorService: ValidadorService,
    private _messageService: MessageService
  ) {}

  get personas(): Persona[] | undefined {
    return this.formulario.get('personas')?.value;
  }

  set personas(personas: Persona[]) {
    this.formulario.get('personas')?.setValue(personas);
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.setaerValoresDelFormularioConTareaSiExiste();
  }

  private inicializarFormulario() {
    this.formulario = this._formBuilder.group({
      id: [],
      nombre: [null, [this._validadorService.requerido('nombre')]],
      fechaLimite: [null, [this._validadorService.requerido('fecha límite')]],
      personas: [null, [this._validadorService.esArrayYNoVacio('personas')]],
    });
  }

  private setaerValoresDelFormularioConTareaSiExiste() {
    let tarea = this._dialogConfig.data?.tarea;

    if (tarea) {
      this.formulario.reset(tarea);
    }
  }

  abrirDialogoCrearPersona() {
    let ref = this._dialogService.open(PersonaComponent, {
      header: 'Persona',
      width: '65%',
    });

    ref.onClose.subscribe((persona) => {
      if (persona) {
        if (this.yaExistePersona(persona.nombreCompleto)) {
          this.mostrarToastDePersonaYaExiste();
        } else {
          this.guardarPersona(persona);
        }
      }
    });
  }

  yaExistePersona(nombrePersona: string): boolean {
    let persona = this.personas?.find(
      (persona) => persona.nombreCompleto === nombrePersona
    );

    return persona ? true : false;
  }

  mostrarToastDePersonaYaExiste() {
    this._messageService.add({
      severity: 'warn',
      summary: 'Nombre duplicado',
      detail: 'Ya existe una persona con el mismo nombre',
    });
  }

  guardarPersona(persona: Persona) {
    if (!this.personas) this.personas = new Array();

    this.personas.push(persona);
  }

  eliminarPersona(index: number) {
    this.personas?.splice(index, 1);
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
