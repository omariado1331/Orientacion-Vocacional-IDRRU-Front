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
}
