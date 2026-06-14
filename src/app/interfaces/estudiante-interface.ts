export interface Estudiante {
  idEstudiante: number | null;
  ciEstudiante: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  idColegio: number | null;
  nombreColegio: string | null;
  colegio: string | null;
  curso: string;
  edad: number;
  celular: string;
  idMunicipio: number;
  createdAt?: string;
}
