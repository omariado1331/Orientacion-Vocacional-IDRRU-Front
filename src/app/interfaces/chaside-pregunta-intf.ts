export interface chasidePregunta{
    pregunta: string;
    area: 'C' | 'H' | 'A' | 'S' | 'I' | 'D' | 'E';
    respuesta?: number; // 0 o 1
}