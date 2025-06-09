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
    'Arquitectura': 'Se centra en el diseño, planificación y construcción de edificios, espacios habitables y otros entornos. Es una disciplina que combina creatividad, conocimiento técnico y una visión holística del entorno construido, abarcando desde el diseño de interiores hasta el diseño urbano y la planificación de ciudades.',
    'Artes': 'Ofrece una formación integral en diversas disciplinas artísticas, preparando a los estudiantes para la gestión, ejecución y docencia en áreas como la música, fotografía, artes digitales, artes plásticas y artes escénicas. La carrera busca desarrollar habilidades creativas, el pensamiento crítico y la capacidad de expresarse a través de diferentes medios artísticos.',
    'Diseño': 'Forma profesionales capaces de crear soluciones visuales, funcionales y estratégicas, adaptadas a las necesidades y contextos diversos. Se centra en la comunicación visual, la creatividad y la innovación, abarcando áreas como diseño gráfico, branding, diseño de interiores y más.'
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
