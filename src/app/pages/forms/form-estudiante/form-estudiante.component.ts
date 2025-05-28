import { Component, PLATFORM_ID, Inject, computed, signal } from '@angular/core';
import { NavigationExtras, RouterModule } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder} from '@angular/forms';
import { Estudiante, EstudianteI } from '../../../interfaces/estudiante-interface';
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
import { Resultado } from '../../../interfaces/resultado-interface';
import { EstudianteService } from '../../../services/estudiante.service';
import { ResultadoService } from '../../../services/resultado.service';


@Component({
  selector: 'app-form-estudiante',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './form-estudiante.component.html',
  styleUrl: './form-estudiante.component.css'
})
export class FormEstudianteComponent {
  submitted = false;
  carnet: string = '';
  idMunicipio: number = 0;
  areaChaside:string[] = [];
  puntajeAptitud: number = 0;
  puntajeInteres: number = 0;
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
  //resultado del test chasides
  //resultadoChaside = signal<Record<string, number>>({ C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 });
  //resultados del test de holland
  resultadoHolland = signal<Record<string, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  estudianteGuardados!: EstudianteI;
  estudianteI: EstudianteI={
    id_municipio: 0,
    idEstudiante: null,
    ciEstudiante: '',
    nombre: '',
    apPaterno: '',
    apMaterno: '',
    colegio: '',
    curso: '',
    edad: 0,
    celular: '',
  };
  perfil = computed(() => {
    const res = this.resultadoHolland();
    return Object.entries(res)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key]) => key);
  });
  chasidePtj:string = '';

  //condicionales para mostrar los formularios
  formularioActived: boolean= false;
  chasideActivated: boolean = true;
  hollandActivated: boolean = true;

  //formularios
  form : FormGroup;
  enviadoEst = signal(false);
  enviadoCh = signal(false);
  enviadoHl = signal(false);

  resultadoEnviar : Resultado = {
    idResultado: null,
    interes: 0,
    aptitud: 0,
    puntajeHolland: '',
    fecha: '',
    idEstudiante: 0,
    idChaside: 0,
    idHolland: 0
  }
  resultIdChaside = ['C','H','A','S','I','D','E'];
  resultIdHolland = ['R','I','A','S','E','C'];

  constructor(
    private provinciaService: ProvinciaService, 
    private municipioService: MunicipioService,
    private router: Router,
    private chasideInteresPService: ChasideInteresPService,
    private chasideAptitudPService: ChasideAptitudPService,
    private hollandFirstService : HollandFirstService,
    private hollandSecondService: HollandSecondService,
    private hollandThirdService: HollandThirdService,
    private hollandAutoevService: HollandAutoevService,
    private formBuilder: FormBuilder,
    private estudianteService: EstudianteService,
    private resultadoService: ResultadoService) 
    { 
      this.pregChasideInteres = this.chasideInteresPService.preguntasInteresChasides;
      this.pregChasideAptitud = this.chasideAptitudPService.preguntasAptitudChaside;
      this.pregHollandFirst = this.hollandFirstService.preguntasHollandFirst;
      this.pregHollandSecond= this.hollandSecondService.preguntasHollandSecond
      this.pregHollandThird = this.hollandThirdService.preguntasHollandThird;
      this.pregHollandAutoev = this.hollandAutoevService.preguntasHollandAutoev;

      this.form = this.formBuilder.group({
        carnetNum: new FormControl(123, Validators.required),
        carnetExt: new FormControl('', Validators.required),
        nombre: new FormControl('OMAR', Validators.required),
        apPaterno: new FormControl('CALLE', Validators.required),
        apMaterno: new FormControl('GUACHALLA', Validators.required),
        colegio: new FormControl('SIMON BOLIVAR', Validators.required),
        curso: new FormControl('6TO SECUNDARIA', Validators.required),
        edad: new FormControl(21, Validators.required),
        celular: new FormControl('3215', Validators.required),
        provincia: new FormControl('', Validators.required),
        municipio: new FormControl('', Validators.required),
        respuestasChI : this.formBuilder.array(this.pregChasideInteres.map(
          () => new FormControl(1, Validators.required)
        )),
        respuestasChA : this.formBuilder.array(this.pregChasideAptitud.map(
          () => new FormControl(1, Validators.required)
        )),
        respuestasHF : this.formBuilder.array(this.pregHollandFirst.map(
          () => new FormControl(0)
        )),
        respuestasHS : this.formBuilder.array(this.pregHollandSecond.map(
          () => new FormControl(0)
        )),
        respuestasHT : this.formBuilder.array(this.pregHollandThird.map(
          () => new FormControl(0)
        )),
        respuestasHA : this.formBuilder.array(this.pregHollandAutoev.map(
          () => new FormControl(7, Validators.required)
        ))
      });
  
    }
    get carnetNum(){
      return this.form.get('carnetNum')
    }
    get carnetExt(){
      return this.form.get('carnetExt')
    }
    get nombre(){
      return this.form.get('nombre')
    }
    get apPaterno(){
      return this.form.get('apPaterno')
    }
    get apMaterno(){
      return this.form.get('apMaterno')
    }
    get colegio(){
      return this.form.get('colegio')
    }
    get curso(){
      return this.form.get('curso')
    }
    get edad(){
      return this.form.get('edad')
    }
    get celular(){
      return this.form.get('celular')
    }
    get provincia(){
      return this.form.get('provincia')
    }
    get municipio(){
      return this.form.get('municipio')
    }
    get respuestasChI(): FormArray{
      return this.form.get('respuestasChI') as FormArray
    }
    get respuestasChA(): FormArray{
      return this.form.get('respuestasChA') as FormArray
    }
    get respuestasHF(): FormArray{
      return this.form.get('respuestasHF') as FormArray
    }
    get respuestasHS(): FormArray{
      return this.form.get('respuestasHS') as FormArray
    }
    get respuestasHT(): FormArray{
      return this.form.get('respuestasHT') as FormArray
    }
    get respuestasHA(): FormArray{
      return this.form.get('respuestasHA') as FormArray
    }

  //verifica si sale del formulario y pide confirmacion para continuar
  canDeactivate(): boolean{
    if(!this.submitted && this.form.dirty){
      return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir del formulario?')
    }
    return true;
  }

  ngOnInit(): void{
    this.provincias = this.provinciaService.provincias;
    this.municipios = this.municipioService.municipios;
    //instanciar el evento cerrar ventana
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.beforeUnloadHandler);
    }
  }

  ngOnDestroy(): void {
    //eliminar el evento cerrar ventana
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    }
  }

  //verifica el evento si se cierra la ventana
  beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    if (this.form.dirty && !this.submitted) {
      event.preventDefault();
      event.returnValue = ''; // necesario para activar la alerta
    }
  };

  mostrarRegistroEstudiante(){
    this.formularioActived = false;
    this.chasideActivated = true;
    this.hollandActivated = true;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
  }
  mostrarChaside(){
    this.formularioActived = true;
    this.chasideActivated = false;
    this.hollandActivated = true;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
  }
  mostrarHolland(){
    this.formularioActived = true;
    this.chasideActivated = true;
    this.hollandActivated = false;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
  }

  guardarResultado(){
    this.enviadoEst.set(true);
    this.enviadoCh.set(true);
    this.enviadoHl.set(true);
    if(this.form.invalid){
      return;
    }else{
      this.submitted = true;
    }
    //unir numero de carnet con la extension
    this.carnet = this.carnetNum?.value+this.carnetExt?.value;
    //obtener el idmunucipio seleccionado
    for (let municipiod of this.municipios){
        if(municipiod.nombre === this.municipio?.value){
          this.idMunicipio = municipiod.id;
        }
    }
    this.estudianteI.ciEstudiante = this.carnet;
    this.estudianteI.nombre = this.nombre?.value;
    this.estudianteI.apPaterno = this.apPaterno?.value;
    this.estudianteI.apMaterno = this.apMaterno?.value;
    this.estudianteI.colegio = this.colegio?.value;
    this.estudianteI.curso = this.curso?.value;
    this.estudianteI.edad = this.edad?.value;
    this.estudianteI.celular = this.celular?.value;
    this.estudianteI.id_municipio = this.idMunicipio;

      //resultado general chaside
      const resultadoChaside = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };

      //resultado seccion interes
      const resultadoInteres = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
      this.respuestasChI.controls.forEach((control, i) =>{
        const area = this.pregChasideInteres[i].area;
        //sumar los resultados de interes
        resultadoInteres[area] += Number(control.value);
        //sumar los resultados al resultado general
        resultadoChaside[area] += Number(control.value);
      });
      //resultado seccion aptitud
      const resultadoAptitud = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
      this.respuestasChA.controls.forEach((control, i) =>{
        const area = this.pregChasideAptitud[i].area;
        resultadoAptitud[area] += Number(control.value);
        resultadoChaside[area] += Number(control.value);
      })

      this.chasidePtj = Object.entries(resultadoChaside).reduce((a, b) => {
        return b[1] > a[1] ? b : a;
      })[0];

      this.puntajeInteres = resultadoInteres[this.chasidePtj as keyof typeof resultadoInteres];
      this.puntajeAptitud = resultadoAptitud[this.chasidePtj as keyof typeof resultadoAptitud];


      //resultado general de test de holland
      const resultadoHolland = {R: 0, I: 0, A: 0, S: 0, E: 0, C: 0};
      
      //resultados del test de holland
      this.respuestasHF.controls.forEach((control, i)=>{
        const area = this.pregHollandFirst[i].area;
        resultadoHolland[area] += Number(control.value);
      });
      this.respuestasHS.controls.forEach((control, i)=>{
        const area = this.pregHollandSecond[i].area;
        resultadoHolland[area] += Number(control.value);
      });
      this.respuestasHT.controls.forEach((control, i)=>{
        const area = this.pregHollandThird[i].area;
        resultadoHolland[area] += Number(control.value);
      });
      this.respuestasHA.controls.forEach((control, i)=>{
        const area = this.pregHollandAutoev[i].area;
        resultadoHolland[area] += Number(control.value);
      });

      this.resultadoHolland.set(resultadoHolland);

    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString(); 
    const perfilStr = this.perfil().join('');

    this.resultadoEnviar.idResultado = null;
    this.resultadoEnviar.interes = this.puntajeInteres;
    this.resultadoEnviar.aptitud = this.puntajeAptitud;
    this.resultadoEnviar.fecha = fechaStr;
    this.resultadoEnviar.puntajeHolland = perfilStr;
    
    const idChasideEnviar = this.resultIdChaside.indexOf(this.chasidePtj)+1;
    this.resultadoEnviar.idChaside = idChasideEnviar;

    const idHollandEnviar = this.resultIdHolland.indexOf(perfilStr[0])+1
    this.resultadoEnviar.idHolland = idHollandEnviar;

    let estudianteGuardado: EstudianteI;
    //conecta con el back para guardar el estudiante y recibir los datos guardados
    this.estudianteService.create(this.estudianteI).subscribe({
      next: (datos) => 
        {estudianteGuardado = datos;
          this.resultadoEnviar.idEstudiante = estudianteGuardado.idEstudiante;
          this.guardarResultadoForm(estudianteGuardado, this.resultadoEnviar);
        },
      error: (error:any) => {     
        console.log('Error al guardar los datos', error)
        const navigationExtras: NavigationExtras = {
          state:{
            bdform: false,
            nombre: [`${this.nombre?.value} ${this.apPaterno?.value} ${this.apMaterno?.value}`],
            colegio: this.colegio?.value,
            carnet: this.carnet,
            interes: this.puntajeInteres,
            aptitud: this.puntajeAptitud,
            holland: this.perfil().join(''),
            chaside: this.chasidePtj,
            celular: this.celular?.value,
            curso: this.curso?.value,
            edad: this.edad?.value,
          }
        }
        this.router.navigate(['/formulario/resultado'], navigationExtras)
        }
    });
    
  }

  guardarResultadoForm(estudianteGuardado: EstudianteI, resultadoEnviar: Resultado){
    // console.log(estudianteGuardado);
    // console.log(estudianteGuardado.idEstudiante);
    // console.log(resultadoEnviar);
    this.resultadoService.createR(resultadoEnviar).subscribe({
      next: (datos)=> {
        const resultadoGuardado = datos;
        // console.log(resultadoGuardado);
        const navigationExtras: NavigationExtras = {
          state:{
            bdform: true,
            nombre: [`${estudianteGuardado.nombre} ${estudianteGuardado.apPaterno} ${estudianteGuardado.apMaterno}`],
            colegio: estudianteGuardado.colegio,
            carnet: estudianteGuardado.ciEstudiante,
            interes: resultadoGuardado.interes,
            aptitud: resultadoGuardado.aptitud,
            holland: resultadoGuardado.puntajeHolland,
            chaside: this.chasidePtj,
            celular: estudianteGuardado.celular,
            curso: estudianteGuardado.curso,
            edad: estudianteGuardado.edad,
          }
        }
        this.router.navigate(['/formulario/resultado'], navigationExtras)
      },
      error:(error:any) =>{
        console.log('Error al guardar los datos', error)
      }
    });
  }

}