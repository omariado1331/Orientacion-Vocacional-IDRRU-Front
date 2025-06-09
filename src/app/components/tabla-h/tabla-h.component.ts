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
    'Antropología y Arqueología' : 'Ofrece una visión integral del ser humano y sus culturas, explorando tanto el pasado (arqueología) como el presente (antropología social y física). Se centra en el estudio de la evolución, la diversidad, las sociedades, las creencias y la cultura material de los grupos humanos. ' ,
    'Comunicación Social': 'Se centra en el estudio y la práctica de la comunicación en sus diferentes formas, incluyendo la producción, difusión y recepción de mensajes en diversos medios. Los comunicadores sociales se encargan de diseñar, implementar y evaluar estrategias de comunicación, tanto en medios masivos como en instituciones y organizaciones. ',
    'Sociología': 'Es una disciplina que estudia la sociedad, sus estructuras, relaciones y dinámicas sociales. Se centra en comprender cómo los individuos interactúan entre sí y cómo se forman y evolucionan las instituciones sociales, culturales y políticas',
    'Trabajo Social': 'Se enfoca en la promoción del bienestar social y la justicia social. Los profesionales en Trabajo Social trabajan con individuos, familias, grupos y comunidades para abordar problemas sociales, promover el desarrollo y los derechos humanos, y mejorar la calidad de vida de las personas más vulnerables. ',
    'Derecho': 'Es una disciplina académica y profesional que se centra en el estudio de las leyes, su aplicación, interpretación y el papel que juegan en la sociedad. Los estudiantes de Derecho aprenden a analizar, argumentar y resolver conflictos de manera jurídica, desarrollando habilidades para defender los derechos de las personas y contribuir a un sistema legal justo.',
    'Ciencias Políticas y Gestión Pública': 'Tiene como objetivo formar profesionales capaces de analizar, comprender y participar en la gestión de los asuntos públicos. Esta disciplina combina el estudio de la teoría política con la práctica de la administración y gestión gubernamental, enfocándose en el diseño, implementación y evaluación de políticas públicas.',
    'Bibliotecología y Ciencias de la Información': 'Se enfoca en la gestión, organización y acceso a la información, tanto en formatos físicos como digitales. Los profesionales en esta área se encargan de la creación, administración, catalogación, recuperación y difusión de la información, con el objetivo de facilitar su acceso a la comunidad.',
    'Ciencias de la Educación': 'Es un campo académico interdisciplinario que se enfoca en el estudio y la mejora de los procesos de enseñanza y aprendizaje. Esta carrera busca comprender la educación desde una perspectiva teórica y práctica, preparando profesionales para diversos roles en el ámbito educativo.',
    'Filosofía': 'Es una disciplina que se centra en la investigación crítica y sistemática de las cuestiones fundamentales del conocimiento, la existencia, la moral, la belleza y el lenguaje, entre otros temas. Se busca comprender la naturaleza de la realidad y la experiencia humana a través del razonamiento y el análisis.',
    'Historia': 'Es un campo de estudio que investiga y analiza los procesos históricos de las sociedades a través del tiempo, con el objetivo de comprender el presente y proyectar el futuro. Los historiadores estudian eventos, fenómenos y movimientos sociales para reconstruir el pasado y entender cómo ha impactado en el desarrollo de las sociedades y la cultura.',
    'Lingüistica e Idiomas': 'Disciplina académica que se centra en el estudio del lenguaje y la comunicación, tanto en su estructura como en su uso. Implica la investigación y análisis de diferentes lenguas, incluyendo tanto lenguas nativas como extranjeras, y abarca diversas áreas como la fonética, la gramática, la semántica, la pragmática y la sintaxis.',
    'Literatura': 'Es un estudio universitario que profundiza en la lengua española, la literatura, y sus relaciones con la cultura, el arte y la comunicación. Esta formación prepara a los egresados para analizar, interpretar, criticar y difundir el valor cultural de la lengua y la literatura.',
    'Psicología': 'Se enfoca en el estudio del comportamiento humano y los procesos mentales. Se ocupa de entender cómo las personas piensan, sienten y actúan, así como de cómo se adaptan a su entorno. Esta ciencia busca comprender los factores que influyen en el comportamiento, las emociones y la cognición, con el objetivo de mejorar el bienestar psicológico y social de las personas y comunidades.',
    'Turismo': 'Prepara a los profesionales para gestionar y dirigir empresas y destinos turísticos, planificando y promocionando actividades turísticas, desde la planificación de viajes hasta la administración de hoteles y agencias. La carrera abarca diversos aspectos del turismo, incluyendo la economía, la cultura, la sociedad, la política y la legislación.'
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
