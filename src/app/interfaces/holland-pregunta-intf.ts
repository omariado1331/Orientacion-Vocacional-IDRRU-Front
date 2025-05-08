export interface hollandPregunta{
    pregunta: string;
    area: 'R' | 'A' | 'I' | 'S' | 'E' | 'C' ;
    respuesta?: number; // 0 o 1
}