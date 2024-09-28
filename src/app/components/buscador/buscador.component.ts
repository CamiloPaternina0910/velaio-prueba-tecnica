import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Estado } from '../../interfaces/tarea.interface';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [ButtonModule, DropdownModule, CommonModule, ReactiveFormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent implements OnInit {
  formulario!: FormGroup;
  estados?: any[];

  @Output() onBusqueda = new EventEmitter();

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.inicialiarFormulario();
    this.inicializarEstados();
  }

  inicialiarFormulario() {
    this.formulario = this._formBuilder.group({
      query: [null],
    });
  }

  inicializarEstados() {
    this.estados = [
      {
        label: Estado.COMPLETA,
        cod: Estado.COMPLETA,
      },
      {
        label: Estado.PENDIENTE,
        cod: Estado.PENDIENTE,
      },
    ];
  }

  emitirBusqueda() {
    this.onBusqueda.emit(this.formulario.value);
  }
}
