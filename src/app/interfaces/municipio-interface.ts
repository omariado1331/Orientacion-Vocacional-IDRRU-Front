export class Municipio{
    constructor(
        public id: number,
        public nombre: string,
        public idProvincia: number
    ){}
}
export class MunicipioN{
    constructor(
        public id: number,
        public nombre: string,
        public idProvincia: string
    ){}
}
export interface Municipioi {
    idMunicipio: number;
    nombre: string;
    idProvincia: number;
}
