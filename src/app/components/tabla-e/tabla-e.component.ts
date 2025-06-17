import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla-e',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './tabla-e.component.html',
  styleUrl: './tabla-e.component.css'
})
export class TablaEComponent {
  @Input() perfil!: string;

  constructor(private dialog: MatDialog){

  }
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

  descripcionCarreras = {
    'Biología': 'La Biología es el estudio integral de la vida, desde el nivel molecular hasta los ecosistemas, explorando su estructura, función, evolución, diversidad e interrelaciones con el entorno.',
    'Estadística': 'Es una ciencia que utiliza métodos matemáticos para recolectar, analizar y representar datos, con el objetivo de extraer conclusiones, predecir tendencias y apoyar la toma de decisiones.',
    'Física': 'Es una carrera científica que explora la naturaleza, desde partículas subatómicas hasta galaxias, buscando leyes fundamentales y aplicando conocimientos a la tecnología y la investigación.',
    'Matemática': 'Estudia conceptos abstractos y las relaciones entre ellos, formando profesionales capaces de analizar, modelar y resolver problemas complejos, aplicando el pensamiento lógico y riguroso.',
    'Ciencias Químicas': 'Prepara profesionales para estudiar la materia, sus propiedades y transformaciones, con énfasis en la investigación, la creación de nuevos productos y la aplicación de normas de calidad.',
    'Ingeniería Agronómica': 'Es la ciencia que estudia y aplica conocimientos en la producción vegetal, animal y en la gestión de recursos naturales de forma sostenible, con el objetivo de optimizar la agricultura y la alimentación.',
    'Ingeniería de Producción y Comercialización': 'La Ingeniería de Producción y Comercialización combina conocimientos técnicos y empresariales para optimizar procesos productivos y desarrollar estrategias de comercialización efectiva.',
    'Agropecuaria': 'La carrera de Agropecuaria prepara profesionales para la gestión de sistemas de producción agrícola y pecuaria, buscando optimizar la eficiencia, productividad y sostenibilidad del sector agropecuario.',
    'Medicina Veterinaria y Zootecnia': 'Forma profesionales capaces de cuidar la salud de los animales, prevenir enfermedades, mejorar la producción animal y promover la salud pública y el bienestar animal.'
  } 

  logosCarreras = {
    'Biología': './assets/logos-carreras/carreras-E/BIOLOGIA.jpeg',
    'Estadística': './assets/logos-carreras/carreras-E/ESTADISTICA.jpeg',
    'Física': './assets/logos-carreras/carreras-E/FISICA.png',
    'Informática': './assets/logos-carreras/carreras-E/INFORMATICA.png',
    'Matemática': './assets/logos-carreras/carreras-E/MATEMATICA.png',
    'Ciencias Químicas': './assets/logos-carreras/carreras-E/QUIMICA.png',
    'Ingeniería Agronómica': './assets/logos-carreras/carreras-E/AGRONOMIA.png',
    'Ingeniería de Producción y Comercialización': './assets/logos-carreras/carreras-E/ALIMENTOS.jpeg',
    'Agropecuaria': './assets/logos-facultades/FA.png',
    'Medicina Veterinaria y Zootecnia': './assets/logos-carreras/carreras-E/VETERINARIA.jpeg'
  }

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
