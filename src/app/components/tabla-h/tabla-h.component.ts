import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-h',
  imports: [],
  templateUrl: './tabla-h.component.html',
  styleUrl: './tabla-h.component.css'
})
export class TablaHComponent {
  @Input() perfil!: string;
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
    'Ciencias Políticas y Gestón Pública'
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
}
