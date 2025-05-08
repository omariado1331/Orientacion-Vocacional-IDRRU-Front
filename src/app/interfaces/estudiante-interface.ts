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
