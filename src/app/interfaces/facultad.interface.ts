// facultad.interface.ts - Define la estructura de datos para las facultades universitarias
export interface Facultad {
  codigo: string;
  nombre: string;
  carreras: string[];
  active: boolean;
}