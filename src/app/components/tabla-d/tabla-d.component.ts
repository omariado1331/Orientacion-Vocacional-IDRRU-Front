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
    'Ingeniería de Tránsito y Viabilidad',
    'Investigación Criminal',
    'Orden y Seguridad',
    'Administración Policial',
  ]
  hollandANAPOLArray = Object.entries(this.hollandANAPOL);

  facultadesArray = Object.entries(this.facultades);

  descripcionCarreras= {
    'Infantería': 'Es una rama militar que se enfoca en la formación de soldados de infantería, los cuales son la columna vertebral de las fuerzas terrestres. Su misión principal es la de llevar a cabo operaciones anfibias, terrestres, ribereñas, de comandos y especiales, tanto en tiempos de paz como en crisis o guerra.',
    'Artillería': 'implica la formación de especialistas en el manejo, operación y mantenimiento de sistemas de artillería. Los egresados están capacitados para liderar, coordinar y ejecutar operaciones con armas de fuego, como cañones, obuses y cohetes, para destruir, neutralizar o reprimir al enemigo.',
    'Caballería': 'Se refiere a la formación y el empleo de fuerzas montadas a caballo, o en su evolución moderna, a unidades que cumplen roles similares utilizando vehículos blindados o helicópteros.',
    'Ingenería': 'Es una disciplina que combina conocimientos de ingeniería con el entorno militar, enfocándose en el diseño, construcción y mantenimiento de obras de ingeniería para apoyar las operaciones militares y la logística. Los ingenieros militares trabajan en una variedad de áreas, como la construcción de bases, puentes, aeródromos y sistemas de comunicación, así como en la gestión de riesgos y la protección de infraestructuras.',
    'Comunicaciones': 'Abarca la especialización en la transmisión y gestión de información dentro de las fuerzas armadas, utilizando diversas tecnologías y procedimientos para asegurar la seguridad y eficacia de la comunicación. Incluye aspectos como el uso de sistemas de radio, la criptografía, la ciberseguridad, y la guerra electrónica, con el objetivo de facilitar la coordinación y el control de las operaciones militares.',
    'Logística': 'Es la disciplina que gestiona el movimiento, abastecimiento y mantenimiento de las fuerzas armadas, asegurando que el material, el personal y las instalaciones estén donde y cuando se necesitan. Esto implica la planificación, adquisición, almacenamiento, distribución y disposición de recursos, así como la gestión de transporte, instalaciones y servicios de apoyo.',
    'Ingeniería de Tránsito y Viabilidad': 'Se enfoca en el estudio, planificación, diseño, construcción y mantenimiento de sistemas viales para la movilidad de personas y bienes. Implica un enfoque multidisciplinario que combina elementos de ingeniería civil, transporte, logística, urbanismo y, en algunos casos, medio ambiente.',
    'Investigación Criminal': 'También conocida como Criminalística, se enfoca en la investigación de delitos utilizando métodos científicos y técnicas para analizar evidencias y determinar la verdad de los hechos. Los profesionales en esta área analizan la escena del crimen, recopilan pruebas, identifican a los involucrados y reconstruyen los eventos para esclarecer la verdad y llevar a cabo una investigación rigurosa.',
    'Orden y Seguridad': 'Forma profesionales capaces de prevenir, mantener y restablecer el orden público. Estos profesionales interactúan con la sociedad, desarrollando acciones preventivas, de mediación y auxilio para preservar la paz social y el normal desenvolvimiento de las actividades.',
    'Administración Policial': 'Se centra en la gestión y dirección de instituciones policiales, enfocándose en la planificación, organización, control y supervisión de recursos humanos y materiales para el mantenimiento de la seguridad pública y la prevención del delito.'
  }

  logosCarreras = {
    'Infantería': './assets/logos-facultades/COLMIL.jpeg',
    'Artillería': './assets/logos-facultades/COLMIL.jpeg',
    'Caballería': './assets/logos-facultades/COLMIL.jpeg',
    'Ingenería': './assets/logos-facultades/COLMIL.jpeg',
    'Comunicaciones': './assets/logos-facultades/COLMIL.jpeg',
    'Logística': './assets/logos-facultades/COLMIL.jpeg',
    'Ingeniería de Tránsito y Viabilidad': './assets/logos-facultades/ANAPOL.jpeg',
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
