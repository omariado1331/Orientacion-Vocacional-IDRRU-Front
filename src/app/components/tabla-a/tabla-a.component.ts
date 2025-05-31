import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tabla-a',
  imports: [],
  templateUrl: './tabla-a.component.html',
  styleUrl: './tabla-a.component.css'
})
export class TablaAComponent {
  @Input() perfil!: string;
  facultades = {FAADU : 0}

  hollandFAADU = {A: 0}
  FAADU = {
    nombre: 'Facultad de Arquitectura, Artes, Diseño y Urbanismo',
    codigo: 'FAADU'
  }
  carrerasFAADU = [
    'Arquitectura',
    'Artes',
    'Diseño'
  ]
  hollandFAADUArray = Object.entries(this.hollandFAADU)

  facultadesArray = Object.entries(this.facultades);

  ngOnInit(){
    //Primer facultad FAADU
    for(const key in this.hollandFAADU){
      for(let i=0; i<3; i++){
        if(key == this.perfil[i]){
          this.hollandFAADU[key as keyof typeof this.hollandFAADU] += (3-i)*2;
        }
      }
    }
    //suma todos los valores obtenidos para la facultad y los almacenas en facultades según el código de facultad
    const totalFCEF = Object.values(this.hollandFAADU).reduce((sum, val) => sum + val, 0);
    this.facultades['FAADU'] += totalFCEF;

    this.facultadesArray = Object.entries(this.facultades).sort((a,b)=> b[1] - a[1]);
  }
}
