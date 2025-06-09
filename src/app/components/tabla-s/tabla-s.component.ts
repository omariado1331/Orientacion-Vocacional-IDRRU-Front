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
    'Medicina': 'Es una formación profesional que busca formar a individuos con sólidos conocimientos científicos y éticos para la prevención, diagnóstico, tratamiento y rehabilitación de la salud humana. Los médicos desempeñan un papel fundamental en la sociedad, contribuyendo a la salud individual, familiar y comunitaria.',
    'Enfermería': 'Se enfoca en la atención, cuidado y promoción de la salud, tanto de individuos como de grupos y comunidades. Forma profesionales capaces de brindar cuidados integrales en diferentes entornos, desde hospitales hasta centros de salud comunitarios, y en todas las etapas de la vida.',
    'Nutrición y Dietética': 'Se enfoca en el estudio de la alimentación y nutrición para promover la salud, prevenir enfermedades y tratar problemas relacionados con la nutrición. Los profesionales de esta área pueden trabajar en diversos ámbitos, como la clínica, la salud pública, la educación, la investigación y la administración de servicios de alimentación.',
    'Tecnología Médica': 'Forma profesionales capacitados para aplicar conocimientos y tecnologías en el ámbito de la salud, con el objetivo de contribuir al diagnóstico, tratamiento, prevención y rehabilitación de enfermedades. Estos profesionales, llamados tecnólogos médicos, trabajan en diversos ámbitos, incluyendo laboratorios clínicos, imagenología, fisioterapia, entre otros.',
    'Odontología': 'Se enfoca en la prevención, diagnóstico y tratamiento de enfermedades y condiciones relacionadas con los dientes, encías y la boca en general. La Odontología abarca una amplia gama de especialidades, desde la atención dental general hasta tratamientos más especializados como ortodoncia, periodoncia, endodoncia, entre otros.',
    'Bioquímica': 'Se centra en el estudio de las sustancias químicas y los procesos que ocurren en los seres vivos, desde una perspectiva molecular. Los bioquímicos investigan la composición, estructura y función de las moléculas biológicas, como las proteínas, los carbohidratos, los lípidos y los ácidos nucleicos. Esta disciplina es fundamental para comprender la base química de la vida, la salud y la enfermedad.',
    'Química Farmacéutica': 'Es una disciplina que combina la química, la biología y la salud para desarrollar, producir, controlar y dispensar medicamentos, productos cosméticos y otros bienes relacionados con la salud. Los químicos farmacéuticos son profesionales sanitarios que desempeñan un papel crucial en la prevención, el tratamiento y el control de las enfermedades, garantizando la seguridad y eficacia de los medicamentos.'
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
