import { Injectable, signal } from '@angular/core';
import { Tarea } from '../interfaces/tarea.interface';

@Injectable({
  providedIn: 'root',
})
export class TareaStorageService {
  $tareas = signal<Tarea[]>([]);
}
