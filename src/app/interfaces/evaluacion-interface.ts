export interface EstudianteDto {
  ciEstudiante: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  idColegio: number | null;
  nombreColegio: string | null;
  curso: string;
  edad: number;
  celular: string;
  id_municipio: number;
}

export interface ResultadoDto {
    interes: number;
    aptitud: number;
    puntajeHolland: string;
    puntajeChaside: string;
    fecha: string;
    idChaside: number | null;
    idHolland: number | null;
}

export interface EvaluacionRequest {
    estudianteDto: EstudianteDto;
    resultadoDto: ResultadoDto;
}
