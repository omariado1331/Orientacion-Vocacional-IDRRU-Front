import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-i',
  imports: [],
  templateUrl: './tabla-i.component.html',
  styleUrl: './tabla-i.component.css'
})
export class TablaIComponent {
  @Input() perfil!: string;

  facultades = {FI : 0, FT: 0, FCG: 0}

  //facultad de ingenieria
  hollandFI= {I: 0, C:0};
  FI = {
    nombre : 'Facultad Ingeniería',
    codigo: 'FI'
  }
  carrerasFI= [
    'Ingeniería Civíl',
    'Ingeniería Industrial',
    'Ingeniería Química',
    'Ingeniería Electrónica',
    'Ingeniería Eléctrica',
    'Ingeniería Petrolera',
    'Ingeniería Metalurgia y Minerales',
    'Ingeniería Mecánica'
  ]
  hollandFIArray = Object.entries(this.hollandFI);

  //Facultad de Tecnologia FT
  hollandFT = {I: 0, R: 0};
  FT = {
    nombre: 'Facultad de Tecnología',
    codigo: 'FT'
  }
  carrerasFT = [
    'Construcciones Civiles',
    'Química Industrial',
    'Topografía y Geodesia',
    'Electromecánica',
    'Electrónica y Telecomunicaciones',
    'Aeronáutica',
    'Electricidad',
    'Mecánica Automotriz',
    'Mecánica Industrial'
  ]
  hollandFTArray = Object.entries(this.hollandFT);

  //Facultad de Ciencias Geologicas FCG
  hollandFCG = {I: 0, E: 0};
  FCG = {
    nombre: 'Facultad de Ciencias Geológicas',
    codigo: 'FCG'
  }
  carrerasFCG = [
    'Ingeniería Geológica',
    'Ingeniería Geográfica'
  ]
  hollandFCGArray = Object.entries(this.hollandFCG);

  //facultades array
  facultadesArray = Object.entries(this.facultades);

  descripcionCarreras = {
    'Ingeniería Civíl': 'Se dedica al diseño, planificación, construcción y mantenimiento de infraestructura, como edificios, puentes, carreteras y sistemas hídricos, para mejorar la calidad de vida.',
    'Ingeniería Industrial': 'Se enfoca en la optimización de procesos y sistemas de producción, mejorando la eficiencia, la calidad y la competitividad en diversas industrias.',
    'Ingeniería Química': 'Aplica principios de química, física, biología y matemáticas para transformar materias primas en productos útiles y sostenibles, diseñando procesos industriales eficientes y respetuosos con el medio ambiente.',
    'Ingeniería Electrónica': 'Se enfoca en el diseño, construcción y aplicación de sistemas electrónicos, incluyendo circuitos, dispositivos y software para la comunicación, automatización y control.',
    'Ingeniería Eléctrica': 'Se centra en el diseño, construcción y mantenimiento de sistemas eléctricos, incluyendo generación, transmisión y distribución de energía, así como su aplicación en diversas industrias.',
    'Ingeniería Petrolera': 'Es la disciplina que se ocupa de la exploración, extracción, procesamiento y producción de petróleo y gas natural, enfocada en la eficiencia y sostenibilidad.',
    'Ingeniería Metalurgia y Minerales': 'Capacita a profesionales para la extracción, procesamiento y tratamiento de minerales y metales, buscando optimizar su uso y transformación para diversas aplicaciones industriales.',
    'Ingeniería Mecánica': 'La ingeniería mecánica es una disciplina de ingeniería que se centra en el diseño, análisis, fabricación, mantenimiento y operación de sistemas mecánicos.',
    'Construcciones Civiles': 'La carrera de Construcciones Civiles capacita a profesionales para diseñar, construir y gestionar obras civiles, como edificios, carreteras y puentes, aplicando conocimientos de ingeniería y gestión.',
    'Química Industrial': 'La Química Industrial se enfoca en la transformación de materias primas en productos industriales a gran escala, utilizando procesos químicos y físicos, buscando la eficiencia y sostenibilidad.',
    'Topografía y Geodesia': 'Comprende el estudio de la medición, representación y análisis de la superficie terrestre, así como la determinación de su forma y dimensiones, fundamental para proyectos de ingeniería y planificación.',
    'Electromecánica': 'Combina la mecánica, la electricidad y la electrónica para diseñar, construir, mantener y optimizar sistemas y dispositivos electromecánicos, especialmente en la industria.',
    'Electrónica y Telecomunicaciones': 'Forma profesionales para diseñar, implementar y gestionar sistemas de comunicación y dispositivos electrónicos, desde redes hasta satélites y dispositivos móviles.',
    'Aeronáutica': 'La carrera de Aeronáutica se centra en el estudio, diseño, construcción y operación de aeronaves, así como en la investigación en aerodinámica y propulsión.',
    'Electricidad': 'La carrera de Electricidad capacita para el diseño, instalación, mantenimiento y gestión de sistemas eléctricos, desde generación hasta distribución, con foco en eficiencia y sostenibilidad.',
    'Mecánica Automotriz': 'La Mecánica Automotriz es una carrera que enseña a diagnosticar, reparar y mantener vehículos, enfocándose en sistemas mecánicos, eléctricos y electrónicos.',
    'Mecánica Industrial': 'Es una carrera que prepara profesionales para el diseño, fabricación, mantenimiento y mejora de maquinaria e instalaciones industriales, enfocados en la eficiencia y seguridad de los procesos.',
    'Ingeniería Geológica': ' Es una disciplina que combina geología y ingeniería para analizar el subsuelo, evaluar riesgos y diseñar soluciones para obras civiles y proyectos de exploración y explotación de recursos.',
    'Ingeniería Geográfica': 'Estudia el espacio geográfico y sus interacciones, utilizando herramientas como la cartografía y los Sistemas de Información Geográfica para la planificación territorial, gestión ambiental y desarrollo sostenible.'
  }

  logosCarreras = {
    'Ingeniería Civíl': './assets/logos-carreras/carreras-I/CIVIL.png',
    'Ingeniería Industrial': './assets/logos-carreras/carreras-I/INDUS.png',
    'Ingeniería Química': './assets/logos-carreras/carreras-I/QUIMICA.jpeg',
    'Ingeniería Electrónica': './assets/logos-carreras/carreras-I/ELECTRONICA.png',
    'Ingeniería Eléctrica': './assets/logos-carreras/carreras-I/ELECTRICA.png',
    'Ingeniería Petrolera': './assets/logos-carreras/carreras-I/PETROLERA.png',
    'Ingeniería Metalurgia y Minerales': './assets/logos-facultades/FI.png',
    'Ingeniería Mecánica': './assets/logos-carreras/carreras-I/MECANICA.png',
    'Construcciones Civiles': './assets/logos-carreras/carreras-I/CONSTRUCCIONES.jpeg',
    'Química Industrial': './assets/logos-carreras/carreras-I/QUIMICAIND.png',
    'Topografía y Geodesia': './assets/logos-carreras/carreras-I/TOPOGEO.png',
    'Electromecánica': './assets/logos-carreras/carreras-I/ELECTROMECANICA.png',
    'Electrónica y Telecomunicaciones': './assets/logos-carreras/carreras-I/ELECTELE.jpeg',
    'Aeronáutica': './assets/logos-carreras/carreras-I/AERONAUTICA.jpeg',
    'Electricidad': './assets/logos-carreras/carreras-I/ELECTRICIDAD.jpeg',
    'Mecánica Automotriz': './assets/logos-carreras/carreras-I/MECAUTO.jpeg',
    'Mecánica Industrial': './assets/logos-carreras/carreras-I/MECINDUS.png',
    'Ingeniería Geológica': './assets/logos-carreras/carreras-I/GEO.png',
    'Ingeniería Geográfica': './assets/logos-carreras/carreras-I/GEOGRAF.jpeg'
  }

  ngOnInit(){
    //Primer facultad FI
    for(const key in this.hollandFI){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, si solo tiene una clave en HollandFCS
          this.hollandFI[key as keyof typeof this.hollandFI] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFI = Object.values(this.hollandFI).reduce((sum, val) => sum + val, 0);
    this.facultades['FI'] += totalFI;

    //segunda facultad FT
    for(const key in this.hollandFT){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, solo si tiene una clave en HollandFDCP
          this.hollandFT[key as keyof typeof this.hollandFT] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFT = Object.values(this.hollandFT).reduce((sum, val) => sum + val, 0);
    this.facultades['FT'] += totalFT;

    //tercera facultad FCG
    for(const key in this.hollandFCG){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, solo si tiene una clave en HollandFDCP
          this.hollandFCG[key as keyof typeof this.hollandFCG] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFCFB = Object.values(this.hollandFCG).reduce((sum, val) => sum + val, 0);
    this.facultades['FCG'] += totalFCFB;

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
