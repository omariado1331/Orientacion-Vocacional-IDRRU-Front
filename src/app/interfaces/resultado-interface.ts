import { Facultad } from '../services/facultad.service';
import { Chaside } from './chaside-interface';
import { Holland } from './holland-interface';

export interface Resultado{
    idResultado: number | null;
    interes: number;
    aptitud: number;
    puntajeHolland: string;
    puntajeChaside: string;
    fecha: string;
    idChaside: number;
    idHolland: number;
}

export interface ResultadoDto {
    idResultado: number;
    interes: number;
    aptitud: number;
    puntajeHolland: string;
    fecha: string;
    idEstudiante: number;
    idChaside?: number;
    idHolland?: number;
    idFacultad?: number;
    facultad?: Facultad;
    facultades?: Facultad[]; 
    chaside?: Chaside;
    holland?: Holland;
    created_at?: string;
    createdAt?: string;
  }
