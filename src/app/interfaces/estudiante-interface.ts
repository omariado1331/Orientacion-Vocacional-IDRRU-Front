export interface Estudiante {
  idEstudiante: number | null;
  ciEstudiante: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  colegio: string;
  curso: string;
  edad: number;
  celular: string;
  idMunicipio: number;
  createdAt?: string;
}
