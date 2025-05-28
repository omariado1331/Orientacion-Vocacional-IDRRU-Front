import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-c',
  imports: [],
  templateUrl: './tabla-c.component.html',
  styleUrl: './tabla-c.component.css'
})
export class TablaCComponent {
  @Input() perfil!: string;
  facultades = {FCEF: 0};

  hollandFCEF = {C:0, E:0 };
  FCEF = {
    nombre : 'Facultad de Ciencias Económicas y Financiera',
    codigo: 'FCEF'
  }
  carrerasFCEF= [
    'Medicina',
    'Enfermeria',
    'Nutrición y Dietética',
    'Tecnología Médica'
  ]
  hollandFCEFArray = Object.entries(this.hollandFCEF);

  facultadesArray = Object.entries(this.facultades); 
  
  // get facultadesArray(){
  //   return Object.entries(this.facultades);
  // }

  ngOnInit(){
    //Primer facultad FCEF
    for(const key in this.hollandFCEF){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          this.hollandFCEF[key as keyof typeof this.hollandFCEF] += (3-i);
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFCEF = Object.values(this.hollandFCEF).reduce((sum, val) => sum + val, 0);
    this.facultades['FCEF'] += totalFCEF;
    console.log(this.hollandFCEF);
    
  }


  constructor(){
  }
}
