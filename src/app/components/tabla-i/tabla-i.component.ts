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
} 
