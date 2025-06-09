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
    'Administración de Empresas',
    'Contaduría Pública',
    'Economía',
  ]
  hollandFCEFArray = Object.entries(this.hollandFCEF);

  facultadesArray = Object.entries(this.facultades); 
  
  descripcionCarreras = {
    'Administración de Empresas': 'Es una disciplina académica que se enfoca en la gestión y dirección de organizaciones, tanto públicas como privadas, con o sin fines de lucro. Su objetivo principal es lograr la eficiencia y efectividad en la operación de una empresa, maximizando el rendimiento y la sostenibilidad a largo plazo.',
    'Contaduría Pública': 'Es una carrera profesional que se enfoca en la gestión financiera de empresas y organizaciones. Los contadores públicos registran, analizan e interpretan la información financiera, brindando asesoramiento para la toma de decisiones estratégicas y el cumplimiento normativo.',
    'Economía': 'Estudia la producción, distribución y consumo de bienes y servicios, con el objetivo de comprender cómo las sociedades utilizan sus recursos limitados para satisfacer sus necesidades. Los economistas analizan el comportamiento económico de individuos, empresas y gobiernos, así como las relaciones entre ellos, utilizando herramientas teóricas y cuantitativas.'
  }
  logosCarreras = {
    'Administración de Empresas': './assets/logos-carreras/carreras-C/ADMI.jpeg',
    'Contaduría Pública': './assets/logos-carreras/carreras-C/CP.png',
    'Economía': './assets/logos-carreras/carreras-C/ECO.jpeg'
  }

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
