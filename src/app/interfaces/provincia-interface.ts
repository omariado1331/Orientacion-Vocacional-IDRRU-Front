export class Provincia {

    constructor(
        public id: number,
        public nombre: string
    ){}
}

export interface ProvinciaI {
  idProvincia: number;
  nombre: string;
}