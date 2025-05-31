import { Injectable } from '@angular/core';
import { chasidePregunta } from '../interfaces/chaside-pregunta-intf';

@Injectable({
  providedIn: 'root'
})
export class ChasideAptitudPService {

  constructor() { }

  preguntasAptitudChaside: chasidePregunta[] = [
    {pregunta: '¿Te ofrecerías para organizar la despedida de soltero (a) de uno de tus amigos?', area: 'C'},
    {pregunta: '¿Organizas tu dinero de manera que te alcance para todos tus gastos?', area: 'C'},
    {pregunta: '¿Distribuyes tu horario adecuadamente para poder hacer todo lo planeado?', area: 'C'},
    {pregunta: '¿Te resulta fácil coordinar un grupo de trabajo?', area: 'C'},
    {pregunta: '¿Si una gran empresa solicita un profesional como gerente comercial, te sentirías a gusto desempeñando ese rol?', area: 'C'},
    {pregunta: '¿Consideras importante que desde la escuela primaria se fomente la actitud crítica y la participación activa?', area: 'H'},
    {pregunta: '¿Preservar las raíces culturales de nuestro país, te parece importante y necesario?', area: 'H'},
    {pregunta: '¿En una discusión entre amigos te ofreces como mediador?', area: 'H'},
    {pregunta: '¿Eres de los que defienden causas perdidas?', area: 'H'},
    {pregunta: '¿Crees que los detalles son tan importantes como el todo?', area: 'A'},
    {pregunta: '¿Te gusta más el trabajo manual que el trabajo intelectual?', area: 'A'},
    {pregunta: '¿Harías un nuevo diseño de una prenda pasada de moda, ante una reunión imprevista?', area: 'A'},
    {pregunta: '¿Dirigirías un grupo de teatro independiente?', area: 'A'},
    {pregunta: '¿Consideras que la salud pública debe ser prioritaria, gratuita y eficiente para todos?', area: 'S'},
    {pregunta: '¿Estarías dispuesto a renunciar a un momento placentero para ofrecer tu servicio como profesional?', area: 'S'},
  ];

  preguntasAptitudChasideDos: chasidePregunta[] = [
    {pregunta: '¿Ayudas habitualmente a personas invidentes a cruzar la calle?', area: 'S'},
    {pregunta: '¿A una posición negativa siempre planteas un pensamiento positivo?', area: 'S'},
    {pregunta: '¿Planificas detalladamente tus trabajos antes de empezar?', area: 'I'},
    {pregunta: '¿Crees que tus ideas son importantes, y haces todo lo posible para ponerlas en práctica?', area: 'I'},
    {pregunta: '¿Trabajar con objetos te resulta más gratificante que trabajar con personas?', area: 'I'},
    {pregunta: '¿Eres exigente y crítico con tu equipo de trabajo?', area: 'I'},
    {pregunta: '¿Usar uniforme te hace sentir distinto, importante?', area: 'D'},
    {pregunta: '¿Crees que el país debe poseer la más alta tecnología armamentista, a cualquier precio?', area: 'D'},
    {pregunta: '¿Ante una situación de emergencia, actúas rápidamente?', area: 'D'},
    {pregunta: '¿Arriesgarías tu vida para salvar la vida de otro que no conoces?', area: 'D'},
    {pregunta: '¿El trabajo individual te resulta más rápido y efectivo que el trabajo grupal?', area: 'E'},
    {pregunta: '¿Te interesan más los misterios de la naturaleza que los secretos de la tecnología?', area: 'E'},
    {pregunta: '¿Te inhibes al entrar a un lugar nuevo con gente desconocida?', area: 'E'},
    {pregunta: '¿Tienes interés por saber cuáles son las causas que determinan ciertos fenómenos, aunque saberlo no incida en tu vida?', area: 'E'}
  ]
}
