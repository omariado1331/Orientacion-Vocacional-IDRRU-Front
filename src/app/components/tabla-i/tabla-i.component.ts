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
    'Ingenería Civíl',
    'Ingenería Industrial',
    'Ingenería Química',
    'Ingenería Electrónica',
    'Ingenería Eléctrica',
    'Ingenería Petrolera',
    'Ingenería Metalurgia y Minerales',
    'Ingenería Mecánica'
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
    'Ingenería Geológica',
    'Ingenería Geográfica'
  ]
  hollandFCGArray = Object.entries(this.hollandFCG);

  //facultades array
  facultadesArray = Object.entries(this.facultades);

  descripcionCarreras = {
    'Ingenería Civíl': 'Es una disciplina que se encarga del diseño, construcción, mantenimiento y gestión de infraestructuras esenciales para la sociedad. Los ingenieros civiles trabajan en una amplia gama de proyectos, desde carreteras y puentes hasta edificios y sistemas de agua, contribuyendo al desarrollo urbano y la mejora de la calidad de vida.',
    'Ingenería Industrial': 'Se centra en la optimización y mejora de procesos, sistemas y organizaciones, buscando aumentar la eficiencia y productividad en diferentes sectores. Los ingenieros industriales aplican principios de ingeniería, matemáticas, ciencias físicas y sociales para diseñar, implementar y gestionar sistemas integrados, con el objetivo de obtener productos y servicios de alta calidad y garantizar la productividad de las empresas.',
    'Ingenería Química': 'Es una disciplina que se centra en el diseño, desarrollo, operación y optimización de procesos industriales que transforman materias primas en productos finales, utilizando conocimientos de química, física, matemáticas y otras ciencias. Es una carrera que involucra la aplicación de estos conocimientos para crear, mejorar y controlar procesos químicos en diversos sectores industriales.',
    'Ingenería Electrónica': 'Es una disciplina que se enfoca en el diseño, desarrollo y aplicación de sistemas electrónicos. Su campo de estudio abarca una amplia gama de áreas, desde la electrónica analógica y digital hasta las telecomunicaciones, la robótica, y los sistemas de control. Los ingenieros electrónicos trabajan en la industria, las telecomunicaciones, la instrumentación, y el diseño de dispositivos electrónicos de alta tecnología.',
    'Ingenería Eléctrica': 'Es una disciplina que se enfoca en el diseño, desarrollo, instalación, operación y mantenimiento de sistemas eléctricos. Los ingenieros eléctricos trabajan en áreas como la generación, transmisión, distribución y control de la energía eléctrica, así como en la creación de dispositivos y sistemas electrónicos.',
    'Ingenería Petrolera': 'Es una disciplina que se enfoca en la extracción, procesamiento y aprovechamiento de hidrocarburos, como el petróleo y el gas natural, de forma eficiente y responsable. Los ingenieros petroleros están involucrados en todas las etapas de la industria, desde la exploración y perforación hasta la producción, transporte y refinación.',
    'Ingenería Metalurgia y Minerales': 'Se enfoca en la extracción, tratamiento y procesamiento de minerales y metales. Los ingenieros metalúrgicos y de minerales diseñan, desarrollan y supervisan procesos metalúrgicos para obtener metales y aleaciones a partir de minerales. Su trabajo es fundamental para la industria minera y metalúrgica, contribuyendo a la obtención de materiales esenciales para diversos sectores.',
    'Ingenería Mecánica': 'Se enfoca en el diseño, construcción, análisis, y mantenimiento de sistemas y componentes mecánicos. Implica la aplicación de principios de física, matemáticas y ciencia de los materiales para desarrollar soluciones a problemas técnicos y mejorar la eficiencia de los sistemas.',
    'Construcciones Civiles': 'Se enfoca en la planificación, diseño, construcción, gestión y supervisión de proyectos de infraestructura. Los profesionales de esta área están involucrados en la creación de obras como edificios, puentes, carreteras, túneles, presas y sistemas de agua y alcantarillado. La carrera busca formar profesionales con conocimientos técnicos, científicos y administrativos para llevar a cabo estos proyectos con eficiencia y calidad.',
    'Química Industrial': 'Se enfoca en la aplicación de los conocimientos químicos para desarrollar, mejorar y controlar procesos industriales a gran escala, con el objetivo de producir bienes y servicios de manera eficiente y sostenible. Implica el manejo de sustancias químicas, la optimización de procesos y la gestión de recursos en la industria.',
    'Topografía y Geodesia': 'Prepara profesionales para medir, representar y analizar la superficie terrestre, utilizando técnicas avanzadas y tecnologías como GPS, drones y software de modelado. Se enfoca en la precisión y calidad en la representación de la Tierra, tanto en escalas pequeñas (topografía) como en grandes escalas (geodesia). Los graduados pueden trabajar en proyectos de ingeniería, construcción, planificación urbana y gestión ambiental, entre otros.',
    'Electromecánica': 'Es una disciplina que combina la ingeniería eléctrica y mecánica, enfocada en el diseño, desarrollo, implementación y mantenimiento de sistemas y dispositivos electromecánicos. Estos sistemas son aquellos que integran partes mecánicas y eléctricas para funcionar. Los ingenieros electromecánicos trabajan en la industria, el sector público y privado, y se involucran en la automatización, control, generación y distribución de energía.',
    'Electrónica y Telecomunicaciones': 'Es una disciplina que se enfoca en el diseño, desarrollo, implementación y mantenimiento de sistemas electrónicos y de telecomunicaciones. Este campo abarca la transmisión, almacenamiento y procesamiento de información a través de dispositivos y circuitos electrónicos, así como la planificación, gestión y operación de redes de comunicación.',
    'Aeronáutica': 'Se enfoca en el diseño, desarrollo, construcción, mantenimiento y operación de aeronaves, incluyendo aviones, helicópteros, drones y otros vehículos aéreos. Los ingenieros aeronáuticos aplican la ciencia y la tecnología para la investigación, diseño, fabricación y mantenimiento de aeronaves y sus sistemas.',
    'Electricidad': 'Se enfoca en la aplicación de la electricidad y el electromagnetismo para el diseño, construcción, operación y mantenimiento de sistemas eléctricos. Esta carrera forma profesionales capaces de gestionar la energía eléctrica en áreas como generación, transmisión, distribución, y control.',
    'Mecánica Automotriz': 'Se enfoca en el estudio, mantenimiento, reparación y diagnóstico de los sistemas mecánicos, eléctricos y electrónicos de los vehículos motorizados, desde el motor hasta el chasis. Implica conocimientos tanto teóricos como prácticos, preparando a los estudiantes para el campo laboral en talleres, concesionarias y más.',
    'Mecánica Industrial': 'Se centra en el diseño, fabricación, instalación, mantenimiento y mejora de máquinas y sistemas mecánicos utilizados en diversos procesos industriales. Los profesionales de esta área trabajan en la optimización de la eficiencia, productividad y seguridad de las industrias, mediante la aplicación de principios de ingeniería mecánica, materiales y procesos de fabricación.',
    'Ingenería Geológica': 'Es una disciplina que integra la geología y la ingeniería para abordar problemas relacionados con la Tierra, como la exploración de recursos naturales, la evaluación de riesgos naturales, el diseño de obras de ingeniería civil y la protección del medio ambiente.',
    'Ingenería Geográfica': 'se enfoca en la gestión y planificación del territorio, la evaluación de riesgos ambientales y la aplicación de tecnologías geomáticas para el desarrollo sostenible. Se trata de una carrera multidisciplinaria que combina conocimientos de ingeniería, geografía, ciencias ambientales y tecnología.'
  }

  logosCarreras = {
    'Ingenería Civíl': './assets/logos-carreras/carreras-I/CIVIL.png',
    'Ingenería Industrial': './assets/logos-carreras/carreras-I/INDUS.png',
    'Ingenería Química': './assets/logos-carreras/carreras-I/QUIMICA.jpeg',
    'Ingenería Electrónica': './assets/logos-carreras/carreras-I/ELECTRONICA.png',
    'Ingenería Eléctrica': './assets/logos-carreras/carreras-I/ELECTRICA.png',
    'Ingenería Petrolera': './assets/logos-carreras/carreras-I/PETROLERA.png',
    'Ingenería Metalurgia y Minerales': './assets/logos-facultades/FI.png',
    'Ingenería Mecánica': './assets/logos-carreras/carreras-I/MECANICA.png',
    'Construcciones Civiles': './assets/logos-carreras/carreras-I/CONSTRUCCIONES.jpeg',
    'Química Industrial': './assets/logos-carreras/carreras-I/QUIMICAIND.png',
    'Topografía y Geodesia': './assets/logos-carreras/carreras-I/TOPOGEO.png',
    'Electromecánica': './assets/logos-carreras/carreras-I/ELECTROMECANICA.png',
    'Electrónica y Telecomunicaciones': './assets/logos-carreras/carreras-I/ELECTELE.jpeg',
    'Aeronáutica': './assets/logos-carreras/carreras-I/AERONAUTICA.jpeg',
    'Electricidad': './assets/logos-carreras/carreras-I/ELECTRICIDAD.jpeg',
    'Mecánica Automotriz': './assets/logos-carreras/carreras-I/MECAUTO.jpeg',
    'Mecánica Industrial': './assets/logos-carreras/carreras-I/MECINDUS.png',
    'Ingenería Geológica': './assets/logos-carreras/carreras-I/GEO.png',
    'Ingenería Geográfica': './assets/logos-carreras/carreras-I/GEOGRAF.jpeg'
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
