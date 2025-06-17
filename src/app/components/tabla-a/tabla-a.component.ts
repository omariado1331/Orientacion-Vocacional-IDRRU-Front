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

  descripcionCarreras = {
    'Arquitectura': 'La arquitectura es una disciplina creativa que combina arte, técnica y ciencia para diseñar y construir edificios, espacios y comunidades, buscando la funcionalidad, la estética y la sostenibilidad.',
    'Artes': 'La carrera de Artes busca desarrollar la creatividad y el talento artístico, formando profesionales capaces de crear, interpretar y comprender diversas manifestaciones artísticas.',
    'Diseño': 'La carrera de Diseño, en sus diferentes ramas, capacita para crear soluciones visuales, funcionales y estratégicas, utilizando la creatividad y el pensamiento crítico para mejorar la calidad de productos y experiencias.'
  }

  logosCarreras = {
    'Arquitectura': './assets/logos-carreras/carreras-A/arqui.png',
    'Artes': './assets/logos-carreras/carreras-A/ARTES.jpg',
    'Diseño': './assets/logos-carreras/carreras-A/arqui.png'
  }

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
