export class Municipio{
    constructor(
        public idMunicipio: number,
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
    id_municipio: number;
    nombre: string;
    id_provincia: number;
}

export interface Municipio {
  idMunicipio: number;
  nombre: string;
  idProvincia: number;
}

