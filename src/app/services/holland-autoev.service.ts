import { Injectable } from '@angular/core';
import { hollandPregunta } from '../interfaces/holland-pregunta-intf';

@Injectable({
  providedIn: 'root'
})
export class HollandAutoevService {

  constructor() { }

  preguntasHollandAutoev: hollandPregunta[] = [
    {pregunta: 'Habilidad Mecánica', area : 'R'},
    {pregunta: 'Destrezas manuales', area : 'R'},
    {pregunta: 'Habilidad Científica', area : 'I'},
    {pregunta: 'Capacidad Matemática', area : 'I'},
    {pregunta: 'Habilidad Artística', area : 'A'},
    {pregunta: 'Habilidad Musical', area : 'A'},
    {pregunta: 'Habilidad Pedagógica', area : 'S'},
    {pregunta: 'Sociabilidad', area : 'S'},
    {pregunta: 'Habilidad para ventas', area : 'E'},
    {pregunta: 'Capacidades Gerenciales', area : 'E'},
    {pregunta: 'Habilidad de Oficina', area : 'C'},
    {pregunta: 'Capacidades administrativas y de oficina', area : 'C'},
  ];
}
