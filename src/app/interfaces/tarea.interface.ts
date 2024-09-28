import { Persona } from "./persona.interface";

export interface Tarea{
    id: number;
    nombre: string;
    fechaLimite: Date;
    estado: Estado,
    personas: Persona[]
}

export enum Estado{
    COMPLETA = "Completa",
    PENDIENTE ="Pendiente"
}