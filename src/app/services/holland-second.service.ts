import { Injectable } from '@angular/core';
import { hollandPregunta } from '../interfaces/holland-pregunta-intf';

@Injectable({
  providedIn: 'root'
})
export class HollandSecondService {

  constructor() { }

  preguntasHollandSecond: hollandPregunta[] = [
    {pregunta: 'Ha utilizado herramientas mecánicas de taller de carpintería, como la sierra o torno eléctrico', area : 'R'},
    {pregunta: 'Sé como usar un voltímetro', area : 'R'},
    {pregunta: 'Puedo ajustar un carburador', area : 'R'},
    {pregunta: 'He trabajado con herramientas eléctricas de mecánica, como taladro o rectificadora', area : 'R'},
    {pregunta: 'Puedo darle acabado nuevo a los muebles de madera manchados o barnizados', area : 'R'},
    {pregunta: 'Puedo leer copias heliográficas', area : 'R'},
    {pregunta: 'Puedo hacer reparaciones de aparatos eléctricos', area : 'R'},
    {pregunta: 'Puedo reparar muebles', area : 'R'},
    {pregunta: 'Puedo hacer dibujos mecánicos', area : 'R'},
    {pregunta: 'Puedo hacer reparaciones sencillas de televisión', area : 'R'},
    {pregunta: 'Puedo hacer reparaciones sencillas de fontanería', area : 'R'},
    {pregunta: 'Puedo entender como funciona una aspiradora', area : 'I'},
    {pregunta: 'Nombraría tres alimentos de alto contenido proteico', area : 'I'},
    {pregunta: 'Puedo entender la vida media de un elemento radioactivo', area : 'I'},
    {pregunta: 'Puedo usar las tablas de logaritmos', area : 'I'},
    {pregunta: 'Puedo utilizar una calculadora científica', area : 'I'},
    {pregunta: 'Puedo usar un microscopio', area : 'I'},
    {pregunta: 'Puedo identificar tres constelaciones de las estrellas', area : 'I'},
    {pregunta: 'Puedo descrubrir el funcionamiento de los leucocitos', area : 'I'},
    {pregunta: 'Puedo interpretar fórmulas de química sencillas', area : 'I'},
    {pregunta: 'Puedo entender por qué los satélites artificiales no caen en la tierra', area : 'I'},
    {pregunta: 'He participado en certámenes o concursos', area : 'I'},
    {pregunta: 'Puedo tocar un instrumento musical', area : 'A'},
    {pregunta: 'Puedo participar en grupos corales de dos o cuatro voces', area : 'A'},
    {pregunta: 'Puedo tocar como solista musical', area : 'A'},
    {pregunta: 'Puedo actuar en una obra de teatro', area : 'A'},
    {pregunta: 'Puedo leer interpretativamente', area : 'A'},
    {pregunta: 'Sé bailar danza moderna o clásica', area : 'A'},
    {pregunta: 'Puedo dibujar a una persona de manera que pueda reconocerse', area : 'A'},
    {pregunta: 'Puedo pintar o esculpir', area : 'A'},
    {pregunta: 'Puedo hacer artículos de cerámica', area : 'A'},
    {pregunta: 'Puedo diseñar vestuarios, carteles o muebles', area : 'A'},
    {pregunta: 'Escribo bien cuentos o poesías', area : 'A'},
    {pregunta: 'Tengo habilidad para explicar cosas a otras personas', area : 'S'},
    {pregunta: 'He participado en campañas de caridad o de beneficiencia', area : 'S'},
    {pregunta: 'Tengo habilidad para cooperar y trabajar en grupo', area : 'S'},
    {pregunta: 'Tengo habilidad para entretener a personas mayores', area : 'S'},
    {pregunta: 'Soy buen anfitrion', area : 'S'},
    {pregunta: 'Tengo facilidad para enseñar a los niños', area : 'S'},
    {pregunta: 'Puedo plenear pasatiempos para una fiesta', area : 'S'},
    {pregunta: 'Tengo habilidad para animar a personas con problemas o enfadadas', area : 'S'},
    {pregunta: 'He trabajado como voluntario en un hospital, clínica o un hogar', area : 'S'},
    {pregunta: 'Puedo planear actividades sociales de una escuela u organización ', area : 'S'},
    {pregunta: 'Tengo facilidad para captar la personalidad de los individuos', area : 'S'},
    {pregunta: 'He sido elegido para desempeñar un cargo en el colegio', area : 'E'},
    {pregunta: 'Puedo supervisar el trabajo de otros', area : 'E'},
    {pregunta: 'Tengo energía y entusiasmo poco comunes', area : 'E'},
    {pregunta: 'Tengo habilidad para decirle a las personas cómo hacer las cosas', area : 'E'},
    {pregunta: 'Soy un buen vendedor', area : 'E'},
    {pregunta: 'He sido portavoz de un grupo para presentar quejas o sugerencias', area : 'E'},
    {pregunta: 'Gané un premio como reconocimiento a mi desempeño como líder', area : 'E'},
    {pregunta: 'He organizado algún club, grupo o equipo', area : 'E'},
    {pregunta: 'He puesto un negocio o servicio', area : 'E'},
    {pregunta: 'Sé como tener éxito como dirigente', area : 'E'},
    {pregunta: 'Soy muy bueno para defender mis ideas y discutirlas', area : 'E'},
    {pregunta: 'Escribo rápidamente en una máquina de escribir o computador', area : 'C'},
    {pregunta: 'Sé manejar una impresora o fotocopiadora', area : 'C'},
    {pregunta: 'Sé tomar buenos apuntes', area : 'C'},
    {pregunta: 'Tengo habilidad para organizar información, preparar archivos', area : 'C'},
    {pregunta: 'He realizado trabajos de oficina', area : 'C'},
    {pregunta: 'Sé planillas de cálculo (excel) o realizar contabilidad', area : 'C'},
    {pregunta: 'Me demoro poco en tramitar documentos', area : 'C'},
    {pregunta: 'Sé utilizar una calculadora', area : 'C'},
    {pregunta: 'Puedo contabilizar haberes y deberes', area : 'C'},
    {pregunta: 'Sé utilizar un computador', area : 'C'},
    {pregunta: 'Puedo llevar registros de compra y venta', area : 'C'},



  ];
}
