export interface Resultado{
    idResultado: number;
    interes: number;
    aptitud: number;
    puntajeHolland: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    
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
