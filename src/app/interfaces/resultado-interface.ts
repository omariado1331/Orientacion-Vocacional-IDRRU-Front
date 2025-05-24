export interface Resultado{
    idResultado: number | null;
    interes: number;
    aptitud: number;
    puntajeHolland: string;
    fecha: string;
    idEstudiante: number;
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
    facultad?: any;
    chaside?: any;
    holland?: any;
  }
