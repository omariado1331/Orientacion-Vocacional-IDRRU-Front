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
}
