import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-h',
  imports: [],
  templateUrl: './tabla-h.component.html',
  styleUrl: './tabla-h.component.css'
})
export class TablaHComponent {
  @Input() perfil!: string;

  constructor(){}
  facultades = {FCS: 0, FDCP: 0, FHCE: 0};

  //facultad de ciencias sociales
  hollandFCS= {S: 0};
  FCS = {
    nombre : 'Facultad de Ciencias Sociales',
    codigo: 'FSC'
  }
  carrerasFCS= [
    'Antropología y Arqueología',
    'Comunicación Social',
    'Sociología',
    'Trabajo Social'
  ]
  hollandFCSArray = Object.entries(this.hollandFCS);

  //Facultad de derecho y ciencias politicas
  hollandFDCP = {S: 0, E: 0};
  FDCP = {
    nombre: 'Facultad de Derecho y Ciencias Políticas',
    codigo: 'FDCP'
  }
  carrerasFDCP = [
    'Derecho',
    'Ciencias Políticas y Gestión Pública'
  ]

  hollandFDCPArray = Object.entries(this.hollandFDCP);

  //facultad de humanidades y ciencias de la educacion
  hollandFHCE = {S: 0, C: 0};
  FHCE = {
    nombre : 'Facultad de Humanidades y Ciencias de la Educación',
    codigo: 'FHCE'
  }
  carrerasFHCE = [
    'Bibliotecología y Ciencias de la Información',
    'Ciencias de la Educación',
    'Filosofía',
    'Historia',
    'Lingüistica e Idiomas',
    'Literatura',
    'Psicología',
    'Turismo'
  ]
  descripcionCarreras = {
    'Antropología y Arqueología' : 'La Antropología y Arqueología son disciplinas que estudian la humanidad, culturas, sociedades y el pasado a través de vestigios materiales y la investigación de campo.' ,
    'Comunicación Social': 'La Comunicación Social es una carrera que estudia la comunicación humana en diversos contextos, desde los medios masivos hasta las relaciones interpersonales y la construcción de la opinión pública.',
    'Sociología': 'La Sociología estudia la sociedad, las interacciones y relaciones humanas, analizando estructuras sociales, culturas, grupos y fenómenos sociales para comprender y proponer soluciones a problemas.',
    'Trabajo Social': 'La carrera de Trabajo Social forma profesionales comprometidos con el bienestar social, quienes analizan y diseñan intervenciones para mejorar la calidad de vida de individuos y comunidades.',
    'Derecho': 'La carrera de Derecho, un campo de estudio interdisciplinario, forma profesionales capaces de analizar, interpretar y aplicar las leyes, buscando justicia y orden en la sociedad.',
    'Ciencias Políticas y Gestión Pública': 'Estudia la teoría y práctica de la política y el gobierno, así como la gestión de instituciones públicas, con el objetivo de formar profesionales para la vida pública.',
    'Bibliotecología y Ciencias de la Información': 'Es una carrera que estudia la organización, administración, preservación y difusión de la información en diversos formatos, utilizando herramientas tecnológicas y conocimientos especializados.',
    'Ciencias de la Educación': 'Prepara profesionales para el estudio y la mejora de los sistemas educativos, enfocándose en la enseñanza, el aprendizaje, la investigación y la innovación en el campo de la educación.',
    'Filosofía': 'La filosofía explora las preguntas fundamentales sobre la existencia, el conocimiento, la ética y el sentido de la vida. Es una disciplina que busca la sabiduría a través del pensamiento crítico y la reflexión.',
    'Historia': 'La carrera de Historia investiga y analiza eventos pasados para entender el presente y el futuro, formando profesionales críticos y analíticos que puedan transmitir la memoria histórica.',
    'Lingüistica e Idiomas': 'Forma profesionales con conocimientos teóricos y prácticos sobre el lenguaje, su estructura, evolución y uso, con foco en la enseñanza y traducción, contribuyendo a la interculturalidad.',
    'Literatura': 'La carrera de Literatura se centra en el estudio crítico de textos literarios, explorando su contexto histórico, cultural y estético, además de fomentar la escritura creativa y la comunicación efectiva.',
    'Psicología': 'La Psicología es el estudio científico de la mente y el comportamiento, buscando comprender cómo pensamos, sentimos, aprendemos y nos relacionamos con el mundo.',
    'Turismo': 'La carrera de Turismo capacita para la gestión de empresas turísticas, planificación de destinos y creación de experiencias inolvidables, promoviendo el turismo sostenible y consciente.'
  }

  logosCarreras = {
    'Bibliotecología y Ciencias de la Información': './assets/logos-carreras/carreras-H/BCI.png',
    'Ciencias de la Educación': './assets/logos-carreras/carreras-H/CE.jpeg',
    'Filosofía': './assets/logos-carreras/carreras-H/FILO.png',
    'Historia': './assets/logos-carreras/carreras-H/HISTO.png',
    'Lingüistica e Idiomas': './assets/logos-carreras/carreras-H/LEI.jpeg',
    'Literatura': './assets/logos-carreras/carreras-H/LITE.png',
    'Psicología': './assets/logos-carreras/carreras-H/PSICO.png',
    'Turismo': './assets/logos-carreras/carreras-H/TURIS.png',
    'Derecho': './assets/logos-carreras/carreras-H/DER.png',
    'Ciencias Políticas y Gestión Pública': './assets/logos-carreras/carreras-H/CPGP.png',
    'Antropología y Arqueología': './assets/logos-carreras/carreras-H/ANTARQ.jpeg',
    'Comunicación Social': './assets/logos-carreras/carreras-H/CCS.png',
    'Sociología': './assets/logos-carreras/carreras-H/SOCIO.png',
    'Trabajo Social': './assets/logos-carreras/carreras-H/TS.png'
  }
  hollandFHCEArray = Object.entries(this.hollandFHCE);

  //facultades array
  facultadesArray = Object.entries(this.facultades);
  ngOnInit(){
    //Primer facultad FCS
    for(const key in this.hollandFCS){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, si solo tiene una clave en HollandFCS
          this.hollandFCS[key as keyof typeof this.hollandFCS] += (3-i)*2;
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFCS = Object.values(this.hollandFCS).reduce((sum, val) => sum + val, 0);
    this.facultades['FCS'] += totalFCS;

    //segunda facultad FDCP
    for(const key in this.hollandFDCP){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, solo si tiene una clave en HollandFDCP
          this.hollandFDCP[key as keyof typeof this.hollandFDCP] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFDCP = Object.values(this.hollandFDCP).reduce((sum, val) => sum + val, 0);
    this.facultades['FDCP'] += totalFDCP;

    //tercera facultad FHCE
    for(const key in this.hollandFHCE){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, solo si tiene una clave en HollandFDCP
          this.hollandFHCE[key as keyof typeof this.hollandFHCE] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFHCE = Object.values(this.hollandFHCE).reduce((sum, val) => sum + val, 0);
    this.facultades['FHCE'] += totalFHCE;

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
