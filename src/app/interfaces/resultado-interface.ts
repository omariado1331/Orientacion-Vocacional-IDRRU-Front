export interface Resultado{
    idResultado: number | null;
    interes: number;
    aptitud: number;
    puntajeHolland: string;
    fecha: string;
    idEstudiante: number | null;
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
    facultades?: any[]; 
    chaside?: any;
    holland?: any;
  }


export interface ResultadoDtoResponse {
  provinciaNombre: string;
  municipioNombre: string;
  chasideCodigo: string;
  fecha: string;
  cantidadEstudiantes: number;
}


