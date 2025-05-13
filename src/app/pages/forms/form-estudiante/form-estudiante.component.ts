import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { Estudiante } from '../../../interfaces/estudiante-interface';
import { ProvinciaService } from '../../../services/provincia.service';
import { Provincia } from '../../../interfaces/provincia-interface';
import { MunicipioService } from '../../../services/municipio.service';
import { Municipio } from '../../../interfaces/municipio-interface';
import { Router } from '@angular/router';
import { ChasideInteresPService } from '../../../services/chaside-interes-p.service';
import { ChasideAptitudPService } from '../../../services/chaside-aptitud-p.service';
import { chasidePregunta } from '../../../interfaces/chaside-pregunta-intf';
import { HollandFirstService } from '../../../services/holland-first.service';
import { HollandSecondService } from '../../../services/holland-second.service';
import { HollandThirdService } from '../../../services/holland-third.service';
import { HollandAutoevService } from '../../../services/holland-autoev.service';
import { hollandPregunta } from '../../../interfaces/holland-pregunta-intf';


@Component({
  selector: 'app-form-estudiante',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './form-estudiante.component.html',
  styleUrl: './form-estudiante.component.css'
})
export class FormEstudianteComponent {

  //datos del estudiante para guardar y crear el objeto estudiante
  carnetNumber: string  = '';
  carnetExt: string  = '';
  carnet: string = '';
  nombre: string | null = null;
  apellidoPaterno: string | null = null;
  apellidoMaterno: string | null = null;
  colegio: string | null = null;
  curso: string  = '6to SECUNDARIA';
  edad: number | null = null;
  celular: string | null = null;
  idMunicipio: number = 0;
  //arreglos para cargar en el DOM de preguntas chasides y holland, de municipio y provincias
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  pregChasideAptitud: chasidePregunta[] = [];
  pregChasideInteres: chasidePregunta[] = [];
  pregHollandFirst: hollandPregunta[] = [];
  pregHollandSecond: hollandPregunta[] = [];
  pregHollandThird: hollandPregunta[] = [];
  pregHollandAutoev: hollandPregunta[] = [];
  //campos de provincia y municipio seleccionados
  provinciaSelected:string = '';
  municipioSelected:string = '';
  //resultados de interes y aptitud del test chasides
  resultadoInteres: Record<string, number> = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
  resultadoAptitud: Record<string, number> = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
  resultadoChaside: Record<string, number> = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
  //resultados del test de holland
  resultadoHolland: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0};

  //condicionales para mostrar los formularios
  formularioActived: boolean= false;
  chasideActivated: boolean = true;
  hollandActivated: boolean = true;

  constructor(
    private provinciaService: ProvinciaService, 
    private municipioService: MunicipioService,
    private router: Router,
    private chasideInteresPService: ChasideInteresPService,
    private chasideAptitudPService: ChasideAptitudPService,
    private hollandFirstService : HollandFirstService,
    private hollandSecondService: HollandSecondService,
    private hollandThirdService: HollandThirdService,
    private hollandAutoevService: HollandAutoevService) 
    { }

  ngOnInit(){
    this.provincias = this.provinciaService.provincias;
    this.municipios = this.municipioService.municipios;
    this.pregChasideInteres = this.chasideInteresPService.preguntasInteresChasides;
    this.pregChasideAptitud = this.chasideAptitudPService.preguntasAptitudChaside;
    this.pregHollandFirst = this.hollandFirstService.preguntasHollandFirst;
    this.pregHollandSecond= this.hollandSecondService.preguntasHollandSecond
    this.pregHollandThird = this.hollandThirdService.preguntasHollandThird;
    this.pregHollandAutoev = this.hollandAutoevService.preguntasHollandAutoev;
  }

  mostrarRegistroEstudiante(){
    this.formularioActived = false;
    this.chasideActivated = true;
    this.hollandActivated = true;
  }

  mostrarChaside(){
    this.formularioActived = true;
    this.chasideActivated = false;
    this.hollandActivated = true;
  }
  mostrarHolland(){
    this.formularioActived = true;
    this.chasideActivated = true;
    this.hollandActivated = false;
  }


  guardarEstudiante(){
    if(this.nombre == null ||
      this.apellidoPaterno == null ||
      this.apellidoMaterno == null ||
      this.carnetExt.trim() === '' ||
      this.carnetNumber.trim() === '' ||
      this.colegio == null ||
      this.curso.trim() === '' ||
      this.edad == null ||
      this.celular == null ||
      this.provinciaSelected.trim() == '' ||
      this.municipioSelected.trim() == ''
     ){
        console.log("DEBE INGRESAR TODOS LOS CAMPOS")
        return;
    }
    //unir numero de carnet con la extension
    this.carnet = this.carnetNumber+this.carnetExt;
    //obtener el idmunucipio seleccionado
    for (let municipio of this.municipios){
        if(municipio.nombre === this.municipioSelected){
          this.idMunicipio = municipio.id;
        }
    }
    //crear el objeto estudiante con los datos ingresados en el formulario
    const estudiante = new Estudiante(null, this.carnet, this.nombre, this.apellidoPaterno, 
      this.apellidoMaterno, this.colegio, this.curso, this.edad, 
      this.celular, this.idMunicipio);
    
    //calcular el resultado de interes
    this.resultadoInteres = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
    for (const preg of this.pregChasideInteres) {
      this.resultadoInteres[preg.area] += preg.respuesta || 0;
    }
    //calcular el resultado de aptitud
    this.resultadoAptitud = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
    for (const preg of this.pregChasideAptitud) {
      this.resultadoAptitud[preg.area] += preg.respuesta || 0;
    }

    this.resultadoHolland = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0};
    for (const preg of this.pregHollandFirst){
      this.resultadoHolland[preg.area] += preg.respuesta || 0;
    }
    for (const preg of this.pregHollandSecond){
      this.resultadoHolland[preg.area] += preg.respuesta || 0;
    }
    for (const preg of this.pregHollandThird){
      this.resultadoHolland[preg.area] += preg.respuesta || 0;
    }
    for (const preg of this.pregHollandAutoev){
      this.resultadoHolland[preg.area] += preg.respuesta || 0;
    }

    console.log(estudiante)
    console.log(this.resultadoInteres);
    console.log(this.resultadoAptitud);
    console.log(this.resultadoHolland)
    this.router.navigate(['/formulario/resultado']);
  }
  
  
  
}
