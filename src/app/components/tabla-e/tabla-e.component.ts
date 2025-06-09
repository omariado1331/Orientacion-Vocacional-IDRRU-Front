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
    'Biología': 'Se centra en el estudio de la vida en todas sus formas, desde el nivel molecular hasta los ecosistemas, abarcando áreas como la genética, la evolución, la ecología, la fisiología, y la diversidad biológica. La biología busca comprender la estructura, función, origen, evolución y las interacciones de los seres vivos, así como los procesos que los mantienen.',
    'Estadística': 'Disciplina académica que se centra en el estudio de la recolección, análisis e interpretación de datos, utilizando métodos y técnicas estadísticas para extraer conclusiones significativas. El objetivo principal es entender y modelar la variabilidad de los fenómenos, así como realizar inferencias y predicciones basadas en los datos.',
    'Física': 'Disciplina científica que estudia la naturaleza y propiedades de la materia, la energía, el espacio y el tiempo. Los físicos buscan comprender las leyes que gobiernan el comportamiento de la materia, desde las partículas subatómicas hasta las galaxias.',
    'Informática': 'Es una disciplina que se centra en el estudio, diseño, desarrollo y aplicación de sistemas informáticos y tecnologías de la información. Esta carrera tiene como objetivo principal formar profesionales capaces de analizar, diseñar, implementar, y mantener sistemas informáticos, software, redes de computadoras, y otros componentes relacionados con la tecnología de la información.',
    'Matemática': 'Disciplina académica que se enfoca en el estudio de las relaciones cuantitativas, las estructuras abstractas y las operaciones lógicas. Prepara a los estudiantes para comprender y aplicar los principios matemáticos en diversas áreas, desde la investigación científica hasta la modelación de problemas en la vida real.',
    'Ciencias Químicas': 'Forma profesionales capaces de comprender y manipular la materia a nivel molecular, utilizando su conocimiento para desarrollar nuevos productos, procesos y tecnologías. Su objetivo principal es la investigación y aplicación de la química en diversos campos, desde la industria hasta la medicina y el medio ambiente.',
    'Ingeniería Agronómica': 'Se enfoca en el estudio y gestión de la producción agropecuaria, con el objetivo de mejorar la eficiencia, la sostenibilidad y la calidad de los alimentos. Esta carrera combina conocimientos de ciencias naturales, exactas y sociales para abordar los desafíos de la agricultura y la ganadería, promoviendo el desarrollo rural y la seguridad alimentaria.',
    'Ingeniería de Producción y Comercialización': 'Es una carrera que combina conocimientos de ingeniería de producción con la gestión de negocios y comercialización. Los profesionales de esta área se enfocan en la optimización de procesos productivos, la gestión de recursos y la planificación estratégica para la venta de productos o servicios.',
    'Agropecuaria': 'Es una disciplina que combina la ciencia, la tecnología y la ingeniería para mejorar la producción agrícola y pecuaria, con un enfoque en la sostenibilidad y la eficiencia. La carrera busca formar profesionales capaces de diseñar, implementar y gestionar sistemas productivos integrales en el sector agropecuario, optimizando el uso de los recursos y respetando el medio ambiente.',
    'Medicina Veterinaria y Zootecnia': 'Forma profesionales capacitados para cuidar la salud animal, mejorar la producción pecuaria y proteger la salud pública. Se enfocan en prevenir, diagnosticar y tratar enfermedades animales, así como en el manejo de la reproducción, nutrición y bienestar de los animales.'
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
