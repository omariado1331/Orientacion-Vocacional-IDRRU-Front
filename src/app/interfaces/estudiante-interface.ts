export class Estudiante{

    constructor(
        public idEstudiante: number | null,
        public ciEstudiante: string,
        public nombre: string,
        public apPaterno: string,
        public apMaterno: string,
        public colegio: string,
        public curso: string,
        public edad: number,
        public celular: string,
        public idMunicipio: number
    ){}
}

export interface EstudianteI{
    idEstudiante: number | null;
    ciEstudiante: string;
    nombre: string;
    apPaterno: string;
    apMaterno: string;
    colegio: string;
    curso: string;
    edad: number;
    celular: string;
    id_municipio: number;
}
