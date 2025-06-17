import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-s',
  imports: [],
  templateUrl: './tabla-s.component.html',
  styleUrl: './tabla-s.component.css'
})
export class TablaSComponent {
  @Input() perfil!: string;

  facultades = {FMENT : 0, FO: 0, FCFB: 0}

  //facultad de medicina enfermeria nutricion y tecnologia medica
  hollandFMENT= {S: 0, I:0};
  FMENT = {
    nombre : 'Facultad Medicina, Enfermería, Nutrición y Tecnología Médica',
    codigo: 'FMENT'
  }
  carrerasFMENT= [
    'Medicina',
    'Enfermería',
    'Nutrición y Dietética',
    'Tecnología Médica'
  ]
  hollandFMENTArray = Object.entries(this.hollandFMENT);

  //Facultad de Odontologia
  hollandFO = {E: 0, I: 0};
  FO = {
    nombre: 'Facultad de Odontología',
    codigo: 'FO'
  }
  carrerasFO = [
    'Odontología'
  ]
  hollandFOArray = Object.entries(this.hollandFO);

  //Facultad de ciencias farmacueticas y bioquimicas
  hollandFCFB = {C: 0, I: 0};
  FCFB = {
    nombre: 'Facultad de Ciencias Farmacéuticas y Bioquímicas',
    codigo: 'FDCP'
  }
  carrerasFCFB = [
    'Bioquímica',
    'Química Farmacéutica'
  ]
  hollandFCFBArray = Object.entries(this.hollandFCFB);

  //facultades array
  facultadesArray = Object.entries(this.facultades);

  descripcionCarreras = {
    'Medicina': 'La carrera de Medicina capacita para la prevención, diagnóstico y tratamiento de enfermedades, promoviendo la salud a nivel individual y comunitario con un enfoque humanista y ético.',
    'Enfermería': 'La enfermería es una profesión de atención a la salud que abarca la promoción, prevención y cuidado de pacientes, familias y comunidades. Es una disciplina con un enfoque holístico en el bienestar.',
    'Nutrición y Dietética': 'La carrera de Nutrición y Dietética capacita para estudiar la alimentación y nutrición humana, promoviendo la salud y bienestar, y diseñando planes alimentarios para individuos y comunidades.',
    'Tecnología Médica': 'Es una disciplina de salud que capacita profesionales para implementar, ejecutar, evaluar e interpretar análisis y procedimientos, contribuyendo al diagnóstico, tratamiento y prevención de enfermedades.',
    'Odontología': 'La Odontología es la disciplina de la salud que se enfoca en la prevención, diagnóstico, tratamiento y rehabilitación de la salud bucal, incluyendo dientes, encías y tejidos adyacentes.',
    'Bioquímica': 'La Bioquímica es la ciencia que estudia la composición química de los seres vivos y sus procesos biológicos. Explora las moléculas, las reacciones y los mecanismos que sustentan la vida.',
    'Química Farmacéutica': 'La Química Farmacéutica es una disciplina que estudia la química aplicada a la salud, abarcando el diseño, síntesis, desarrollo, producción y control de calidad de medicamentos y productos relacionados.'
  }
  logosCarreras = {
    'Medicina': './assets/logos-facultades/FMENT.png',
    'Enfermería': './assets/logos-carreras/carreras-S/ENFER.jpeg',
    'Nutrición y Dietética': './assets/logos-carreras/carreras-S/NUTRI.jpeg',
    'Tecnología Médica': './assets/logos-carreras/carreras-S/TECMED.jpeg',
    'Odontología': './assets/logos-carreras/carreras-S/ODON.jpeg',
    'Bioquímica': './assets/logos-carreras/carreras-S/FARBIO.png',
    'Química Farmacéutica': './assets/logos-carreras/carreras-S/FARBIO.png'
  }

  ngOnInit(){
    //Primer facultad FMENT
    for(const key in this.hollandFMENT){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, si solo tiene una clave en HollandFCS
          this.hollandFMENT[key as keyof typeof this.hollandFMENT] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFMENT = Object.values(this.hollandFMENT).reduce((sum, val) => sum + val, 0);
    this.facultades['FMENT'] += totalFMENT;

    //segunda facultad FO
    for(const key in this.hollandFO){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, solo si tiene una clave en HollandFDCP
          this.hollandFO[key as keyof typeof this.hollandFO] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFO = Object.values(this.hollandFO).reduce((sum, val) => sum + val, 0);
    this.facultades['FO'] += totalFO;

    //tercera facultad FCFB
    for(const key in this.hollandFCFB){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, solo si tiene una clave en HollandFDCP
          this.hollandFCFB[key as keyof typeof this.hollandFCFB] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFCFB = Object.values(this.hollandFCFB).reduce((sum, val) => sum + val, 0);
    this.facultades['FCFB'] += totalFCFB;

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
