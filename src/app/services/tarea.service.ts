import { Injectable, signal } from '@angular/core';
import { Estado, Tarea } from '../interfaces/tarea.interface';
import { TareaStorageService } from './tarea.storage.service';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private _$contador = signal(0);

  constructor(private tareaStorageService: TareaStorageService) {}

  get tareas() {
    return this.tareaStorageService.$tareas();
  }

  set tareas(tareas: Tarea[]) {
    this.tareaStorageService.$tareas.set(tareas);
  }

  crear(tarea: Tarea) {
    this._$contador.update((val) => val + 1);
    tarea.id = this._$contador();
    this.tareas.push(tarea);
    return this.tareas;
  }

  buscarPorId(id: number) {
    return this.tareas.find((tarea) => tarea.id == id);
  }

  buscarPorEstado(estado: Estado) {
    return this.tareas.filter((tarea) => tarea.estado == estado);
  }

  buscarTodas() {
    return this.tareas;
  }

  editar(id: number, tareaParcial: Partial<Tarea>) {
    let indexTarea = this.tareas.findIndex((tarea) => tarea.id === id);

    if (indexTarea != -1) {
      this.tareas[indexTarea] = {
        ...this.tareas[indexTarea],
        ...tareaParcial,
      };

      return this.tareas[indexTarea];
    }

    return undefined;
  }

  eliminar(id: number) {
    let indexTarea = this.tareas.findIndex((tarea) => tarea.id === id);
    this.tareas.splice(indexTarea, 1);
  }
}
