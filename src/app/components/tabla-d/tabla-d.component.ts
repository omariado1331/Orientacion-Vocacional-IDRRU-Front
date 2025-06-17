import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-d',
  imports: [],
  templateUrl: './tabla-d.component.html',
  styleUrl: './tabla-d.component.css'
})
export class TablaDComponent {
  @Input() perfil!: string;

  facultades = {COLMIL: 0, ANAPOL: 0}

  //Colegio militar del ejercito
  hollandCOLMIL= {R: 0, C: 0};
  COLMIL = {
    nombre : 'Colegio Militar del Ejercito',
    codigo: 'COLMIL'
  }
  carrerasCOLMIL= [
    'Infantería',
    'Artillería',
    'Caballería',
    'Ingenería',
    'Comunicaciones',
    'Logística',
  ]
  hollandCOLMILArray = Object.entries(this.hollandCOLMIL);

  //Academia Nacional de Policias
  hollandANAPOL = {R: 0, S: 0};
  ANAPOL = {
    nombre: 'Academia Nacional de Policias',
    codigo: 'ANAPOL'
  }
  carrerasANAPOL = [
    'Ingeniería de Tránsito y Vialidad',
    'Investigación Criminal',
    'Orden y Seguridad',
    'Administración Policial',
  ]
  hollandANAPOLArray = Object.entries(this.hollandANAPOL);

  facultadesArray = Object.entries(this.facultades);

  descripcionCarreras= {
    'Infantería': 'La infantería es la fuerza principal de combate a pie, encargada de la acción directa contra el enemigo, utilizando armas portátiles y tácticas terrestres para alcanzar la victoria.',
    'Artillería': 'La carrera de Artillería capacita para apoyar el combate con fuego, utilizando cañones y misiles, calculando y ejecutando disparos para destruir objetivos terrestres o aéreos.',
    'Caballería': 'La Caballería es una rama del ejército montada a caballo, conocida por su agilidad y capacidad de maniobra, utilizada para reconocimiento, ataque y protección en el campo de batalla.',
    'Comunicaciones': 'Capacita a profesionales para la gestión y transmisión de información estratégica en entornos militares, utilizando equipos y sistemas especializados. Se enfoca en la seguridad y eficacia de las comunicaciones para el cumplimiento de misiones.',
    'Logística': 'Es la disciplina que planifica, gestiona y ejecuta el movimiento, suministro y mantenimiento de personal y material para las fuerzas armadas. Es esencial para el éxito de las operaciones militares.',
    'Ingeniería de Tránsito y Vialidad': 'Es una disciplina que planifica, diseña y opera sistemas de transporte, enfocándose en el flujo vehicular, seguridad y eficiencia en vías urbanas y carreteras.',
    'Investigación Criminal': 'Es una carrera multidisciplinaria que aplica ciencia y técnicas para resolver delitos, investigando escenas, analizando pruebas y reconstruyendo hechos para lograr la justicia.',
    'Orden y Seguridad': 'Prepara profesionales para mantener la seguridad pública, prevenir delitos y garantizar la convivencia pacífica, enfocándose en leyes, estrategias y gestión de riesgos.',
    'Administración Policial': 'Es una carrera que se enfoca en la gestión y dirección de las fuerzas policiales. Se centra en la planificación, organización, ejecución y control de las actividades policiales para mantener la seguridad pública.'
  }

  logosCarreras = {
    'Infantería': './assets/logos-facultades/COLMIL.jpeg',
    'Artillería': './assets/logos-facultades/COLMIL.jpeg',
    'Caballería': './assets/logos-facultades/COLMIL.jpeg',
    'Ingenería': './assets/logos-facultades/COLMIL.jpeg',
    'Comunicaciones': './assets/logos-facultades/COLMIL.jpeg',
    'Logística': './assets/logos-facultades/COLMIL.jpeg',
    'Ingeniería de Tránsito y Vialidad': './assets/logos-facultades/ANAPOL.jpeg',
    'Investigación Criminal': './assets/logos-facultades/ANAPOL.jpeg',
    'Orden y Seguridad': './assets/logos-facultades/ANAPOL.jpeg',
    'Administración Policial': './assets/logos-facultades/ANAPOL.jpeg'
  }

  ngOnInit(){
    //Primer facultad COLMIL
    for(const key in this.hollandCOLMIL){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, si solo tiene una clave en HollandFCS
          this.hollandCOLMIL[key as keyof typeof this.hollandCOLMIL] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalCOLMIL = Object.values(this.hollandCOLMIL).reduce((sum, val) => sum + val, 0);
    this.facultades['COLMIL'] += totalCOLMIL;

    //segunda facultad ANAPOL
    for(const key in this.hollandANAPOL){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, solo si tiene una clave en HollandFDCP
          this.hollandANAPOL[key as keyof typeof this.hollandANAPOL] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalANAPOL = Object.values(this.hollandANAPOL).reduce((sum, val) => sum + val, 0);
    this.facultades['ANAPOL'] += totalANAPOL;

    //por ultimo ordenar de mayor a menor facultades en un array
    this.facultadesArray = Object.entries(this.facultades).sort((a,b) => b[1]-a[1]);
  }

  mostrarModal = false;
  carrera : string = '';
  descripcionCarrera:string = ''
  dirLogo: string = '';


  mostrarInfo(carrera: string){
    this.carrera = carrera;
    this.descripcionCarrera = this.descripcionCarreras[carrera as keyof typeof this.descripcionCarreras];
    this.dirLogo = this.logosCarreras[carrera as keyof typeof this.logosCarreras];
    this.mostrarModal = true;
  }
  ocultarInfo(){
    this.mostrarModal = false;
  }
}
