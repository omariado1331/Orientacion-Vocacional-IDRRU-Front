export class Municipio{
    constructor(
        public id: number,
        public nombre: string,
        public idProvincia: string
    ){}
}
export interface Municipioi {
    id_municipio: number;
    nombre: string;
    id_provincia: number;
}
