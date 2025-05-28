import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-e',
  imports: [],
  templateUrl: './tabla-e.component.html',
  styleUrl: './tabla-e.component.css'
})
export class TablaEComponent {
  @Input() perfil!: string;

  facultades = {FCPN: 0, FA: 0}

  //Facultad de Ciencias Puras y Naturales
  hollandFCPN= {I: 0};
  FCPN = {
    nombre : 'Facultad de Ciencias Puras y Naturales',
    codigo: 'FCPN'
  }
  carrerasFCPN= [
    'Biología',
    'Estadística',
    'Física',
    'Informática',
    'Matemática',
    'Ciencias Químicas',
  ]
  hollandFCPNArray = Object.entries(this.hollandFCPN);

  //Facultad de Agronomía
  hollandFA = {I: 0, S: 0};
  FA = {
    nombre: 'Facultad de Agronomía',
    codigo: 'FA'
  }
  carrerasFA = [
    'Ingeniería Agronómica',
    'Ingeniería de Producción y Comercialización',
    'Agropecuaria',
    'Medicina Veterinaria y Zootecnia'
  ]
  hollandFAArray = Object.entries(this.hollandFA);

  facultadesArray = Object.entries(this.facultades);

  ngOnInit(){
    //Primer facultad FCPN
    for(const key in this.hollandFCPN){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, si solo tiene una clave en HollandFCS
          this.hollandFCPN[key as keyof typeof this.hollandFCPN] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFCPN = Object.values(this.hollandFCPN).reduce((sum, val) => sum + val, 0);
    this.facultades['FCPN'] += totalFCPN;

    //segunda facultad FA
    for(const key in this.hollandFA){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          //Se multiplica por dos, solo si tiene una clave en HollandFDCP
          this.hollandFA[key as keyof typeof this.hollandFA] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFA = Object.values(this.hollandFA).reduce((sum, val) => sum + val, 0);
    this.facultades['FA'] += totalFA;

    //por ultimo ordenar de mayor a menor facultades en un array
    this.facultadesArray = Object.entries(this.facultades).sort((a,b) => b[1]-a[1]);
  }
}
