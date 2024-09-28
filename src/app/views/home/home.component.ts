import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { BuscadorComponent } from '../../components/buscador/buscador.component';
import { TareaComponent } from '../../components/tarea/tarea.component';
import { Estado, Tarea } from '../../interfaces/tarea.interface';
import { TareaService } from '../../services/tarea.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, BuscadorComponent, CommonModule, ToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DialogService],
})
export class HomeComponent implements OnInit {
  $tareas = signal<Tarea[]>([]);

  constructor(
    private _tareaService: TareaService,
    private _dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.refrescarTareas();
  }

  refrescarTareas() {
    this.$tareas.set(this._tareaService.buscarTodas());
  }

  abrirDialogoParaCrearTarea(tarea?: Tarea) {
    let ref = this._dialogService.open(TareaComponent, {
      header: 'Tarea',
      width: '70%',
      data: {
        tarea: tarea,
      },
    });

    ref.onClose.subscribe((val) => {
      if (val) {
        if (tarea) this.editarTarea(val);
        else this.guardarTarea(val);
      }
    });
  }

  obtenerLabelBtnCambiarEstado(tarea: Tarea) {
    return `Marcar como ${
      this.esTareaCompletada(tarea) ? Estado.PENDIENTE : Estado.COMPLETA
    }`;
  }

  cambiarEstadoTarea(tarea: Tarea) {
    tarea.estado = this.esTareaCompletada(tarea)
      ? Estado.PENDIENTE
      : Estado.COMPLETA;
    this.editarTarea(tarea);
  }

  esTareaCompletada(tarea: Tarea) {
    return tarea.estado == Estado.COMPLETA ? true : false;
  }

  editarTarea(tarea: Tarea) {
    this._tareaService.editar(tarea.id, tarea);
    this.refrescarTareas();
  }

  guardarTarea(tarea: Tarea) {
    tarea.estado = Estado.PENDIENTE;
    this._tareaService.crear(tarea);
    this.refrescarTareas();
  }

  buscarPorEstado(event: any) {
    let estado = event.query;
    let tareas = [];

    if (estado) {
      tareas = this._tareaService.buscarPorEstado(estado);
    } else tareas = this._tareaService.buscarTodas();

    this.$tareas.set(tareas);
  }

  eliminarTarea(tarea: Tarea) {
    this._tareaService.eliminar(tarea.id);
    this.refrescarTareas();
  }
}
