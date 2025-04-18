export interface Resultado{
    idResultado: number;
    interes: number;
    aptitud: number;
    puntajeHolland: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    estudiante: Estudiante;
    chaside: Chaside;
    holland: Holland;
    facultad: Facultad;
}

export interface Estudiante{
    idEstudiante: number;
    ciEstudiante: string;
    nombre: string;
    apPaterno: string;
    apMaterno: string;
    colegio: string;
    curso: string;
    edad: number;
    celular: string;
    provincia: Provincia;
}

export interface Chaside{
    idChaside: number;
    codigo: string;
}

export interface Holland{
    idHolland: number;
    personalidad: string;
}

export interface Facultad{
    idFacultad: number;
    codigo: string;
    nombre: string;
}

export interface Provincia{
    idProvincia: number;
    nombre: string;
}