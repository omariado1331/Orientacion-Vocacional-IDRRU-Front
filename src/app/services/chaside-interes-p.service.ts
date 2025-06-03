import { Injectable } from '@angular/core';
import { chasidePregunta } from '../interfaces/chaside-pregunta-intf';

@Injectable({
  providedIn: 'root'
})
export class ChasideInteresPService {
  constructor() { }

  preguntasInteresChasides: chasidePregunta[] = [
    {pregunta: '¿Aceptarías trabajar escribiendo artículos en la sección económica de un periódico?', area: 'C'},
    {pregunta: '¿Puedes establecer la diferencia conceptual entre macroeconomía y microeconomía?', area: 'C'},
    {pregunta: '¿Si te convocara tu equipo preferido para planificar, organizar y dirigir un campo de deportes, aceptarías?', area: 'C'},
    {pregunta: '¿Te gustaría realizar una investigación que contribuyera a hacer más justa la distribución de la riqueza?', area: 'C'},
    {pregunta: '¿En un equipo de trabajo prefieres el rol de coordinador?', area: 'C'},
    {pregunta: '¿Dirigirías el área de importación y exportación de una empresa?', area: 'C'},
    {pregunta: '¿Te costearías tus estudios trabajando en una auditoría?', area: 'C'},
    {pregunta: '¿Te resultaría gratificante ser asesor contable en una empresa reconocida?', area: 'C'},
    {pregunta: '¿Sabes qué es el PRODUCTO INTERNO BRUTO?', area: 'C'},
    {pregunta: '¿Te gustaría trabajar con niños?', area: 'H'},
    {pregunta: '¿Elegirías una carrera cuyo instrumento de trabajo fuere la utilización de un idioma extranjero?', area: 'H'},
    {pregunta: '¿Dedicarías parte de tu tiempo para ayudar a personas de zonas vulnerables?', area: 'H'},
    {pregunta: '¿Te ofrecerías para explicar a tus compañeros un determinado tema que ellos no entendieron?', area: 'H'},
    {pregunta: '¿Pasarías varias horas leyendo un libro de tu interés?', area: 'H'},
    {pregunta: '¿Te interesan los temas relacionados al pasado y a la evolución del hombre?', area: 'H'},
    {pregunta: '¿Participarías de una investigación sobre la violencia en el fútbol (las barras bravas)?', area: 'H'},
    {pregunta: '¿Descubriste algún filósofo o escritor que haya expresado tus mismas ideas antes?', area: 'H'}
  ];

  preguntasInteresChasideDos: chasidePregunta[] = [
    {pregunta: '¿La libertad y la justicia son valores importantes en tu vida?', area: 'H'},
    {pregunta: '¿Lucharías por una causa justa hasta las últimas consecuencias?', area: 'H'},
    {pregunta: '¿Te gustaría dirigir un proyecto de urbanización en tu barrio?', area: 'A'},
    {pregunta: '¿Te atrae armar rompecabezas?', area: 'A'},
    {pregunta: '¿Eres el que pone un toque de alegría en las fiestas?', area: 'A'},
    {pregunta: '¿Disfrutas trabajando con arcilla o plastilina?', area: 'A'},
    {pregunta: '¿Fuera de los horarios escolares, dedicas algún día a la semana practicar algún deporte o actividad física?', area: 'A'},
    {pregunta: '¿Tolerarías empezar tantas veces como fuere necesario hasta obtener el logro deseado?', area: 'A'},
    {pregunta: '¿Cuando estás en un grupo de trabajo, te agrada producir ideas originales y que sean tenidas en cuenta?', area: 'A'},
    {pregunta: '¿Desearías que te regalen algún instrumento musical para tu cumpleaños?', area: 'A'},
    {pregunta: '¿Harías el afiche para una campaña de prevención del SIDA?', area: 'A'},
    {pregunta: '¿Cuando eliges tu ropa o decoras un ambiente, tienes en cuenta la combinación de los colores, las telas o el estilo de los muebles?', area: 'A'},
    {pregunta: '¿Ante un llamado solidario, te ofrecerías para cuidar a un enfermo?', area: 'S'},
    {pregunta: '¿Escuchas atentamente los problemas que tienen tus amigos?', area: 'S'},
    {pregunta: '¿Convences fácilmente a otras personas sobre la validez de tus argumentos?', area: 'S'},
    {pregunta: '¿Te sentirías a gusto trabajando en un ambiente hospitalario?', area: 'S'},
    {pregunta: '¿Participarías en una campaña de prevención contra el virus AH1N1?', area: 'S'}
  ];

  preguntasInteresChasideTres: chasidePregunta[] = [
    {pregunta: '¿Te gustaría hacer un curso de primeros auxilios?', area: 'S'},
    {pregunta: '¿Acostumbras a leer revistas relacionadas con los últimos avances científicos y tecnológicos en el área desalud?', area: 'S'},
    {pregunta: '¿Te gustaría investigar sobre alguna nueva vacuna?', area: 'S'},
    {pregunta: '¿Te resulta interesante el estudio de las ciencias naturales?', area: 'S'},
    {pregunta: '¿Ante una emergencia epidémica, participarías en una campaña brindando tu ayuda?', area: 'S'},
    {pregunta: '¿Te gustaría trabajar como profesional dirigiendo la construcción de una empresa hidroeléctrica?', area: 'I'},
    {pregunta: '¿Cuando eras pequeño, te interesaba saber cómo estaban construidos tus juguetes?', area: 'I'},
    {pregunta: '¿Cuando tienes que resolver un problema matemático, perseveras hasta encontrar la solución?', area: 'I'},
    {pregunta: '¿Entablas una relación casi personal con tu computador?', area: 'I'},
    {pregunta: '¿Te ofrecerías para colaborar como voluntario en la NASA?', area: 'I'},
    {pregunta: '¿Harías un curso para aprender a fabricar los instrumentos y/o piezas de las máquinas o aparatos con que trabajas?', area: 'I'},
    {pregunta: '¿Te incluirías en un proyecto nacional de desarrollo de la principal fuente de recursos de tu ciudad?', area: 'I'},
    {pregunta: '¿Cuando se daña un electrodoméstico rápidamente te ofreces para arreglarlo repararlo?', area: 'I'},
    {pregunta: '¿Te gustaría investigar científicamente sobre cultivos agrícolas?', area: 'I'},
    {pregunta: '¿Enviarías tu hoja de vida a una empresa automotriz que solicita gente para su área de producción?', area: 'I'},
    {pregunta: '¿Participarías en un grupo de defensa internacional dentro de alguna fuerza armada?', area: 'D'},
    {pregunta: '¿Te dedicarías a ayudar a personas accidentadas o atacadas por asaltantes?', area: 'D'}
  ];

  preguntasChasideInteresCuatro: chasidePregunta[] = [
    {pregunta: '¿Participarías como profesional en un espectáculo de acrobacia aérea?', area: 'D'},
    {pregunta: '¿Te gustaría participar para mantener el orden ante grandes desórdenes o catástrofes?', area: 'D'},
    {pregunta: '¿Aceptarías que las mujeres formaran parte de las fuerzas armadas bajo las mismas condiciones que los hombres?', area: 'D'},
    {pregunta: '¿Te interesan las actividades de mucha acción y de reacción rápida en situaciones imprevistas y de peligro?', area: 'D'},
    {pregunta: '¿Elegirías una profesión en la que tuvieras que estar algunos meses alejado de tu familia?', area: 'D'},
    {pregunta: '¿Aceptarías colaborar con el cumplimiento de las normas en lugares públicos?', area: 'D'},
    {pregunta: '¿Te gustaría realizar tareas auxiliares en un avión o aeronave, como izado velas, pintura y conservación de casco, arreglos de averías, conservación de motores?', area: 'D'},
    {pregunta: '¿Estás de acuerdo con la formación de un cuerpo de soldados profesionales?', area: 'D'},
    {pregunta: '¿Sabes responder qué significa ADN Y ARN?', area: 'E'},
    {pregunta: '¿Te atrae investigar sobre los misterios del universo, por ejemplo, los agujeros negros?', area: 'E'},
    {pregunta: '¿Estás informado sobre nuevos descubrimientos que se están realizando sobre la Teoría del Big-Bang?', area: 'E'},
    {pregunta: '¿Te gustaría crear nuevas técnicas para descubrir las patologías de algunas enfermedades a través del microscopio?', area: 'E'},
    {pregunta: '¿Te incluirías en un proyecto de investigación de los movimientos sísmicos y sus consecuencias?', area: 'E'},
    {pregunta: '¿Te gustaría trabajar en un laboratorio mientras estudias?', area: 'E'},
    {pregunta: '¿Te radicarías en una zona agrícola-ganadera para desarrollar tus actividades como profesional?', area: 'E'},
    {pregunta: '¿Formarías parte de un equipo de trabajo orientado a la preservación de la flora y la fauna en extinción?', area: 'E'},
    {pregunta: '¿Aceptarías hacer una práctica rentada en industria de productos alimenticios, en el sector de control de calidad?', area: 'E'},
    {pregunta: '¿Visitarías un observatorio astronómico para conocer en acción el funcionamiento de los aparatos?', area: 'E'}
  ];
}
