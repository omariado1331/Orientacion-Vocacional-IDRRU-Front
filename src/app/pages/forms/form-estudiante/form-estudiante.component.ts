import { Component, computed, inject, signal } from '@angular/core';
import { NavigationExtras, RouterModule } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, Form} from '@angular/forms';
import { EstudianteI } from '../../../interfaces/estudiante-interface';
import { ProvinciaService } from '../../../services/provincia.service';
import { Provincia } from '../../../interfaces/provincia-interface';
import { MunicipioService } from '../../../services/municipio.service';
import { MunicipioN } from '../../../interfaces/municipio-interface';
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
  municipios: MunicipioN[] = [];
  pregChasideInteres: chasidePregunta[] = [];
  pregChasideInteresDos: chasidePregunta[] = [];
  pregChasideInteresTres: chasidePregunta[] = [];
  pregChasideInteresCuatro: chasidePregunta[] = [];
  pregChasideAptitud: chasidePregunta[] = [];
  pregChasideAptitudDos: chasidePregunta[] = [];
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
  chasideActivatedDos: boolean = true;
  chasideActivatedTres: boolean = true;
  chasideActivatedCuatro: boolean = true;
  chasideActivatedCinco: boolean = true;
  chasideActivatedSeis: boolean = true;
  hollandActivated: boolean = true;
  hollandActivatedDos: boolean = true;
  hollandActivatedTres: boolean = true;
  hollandActivatedCuatro: boolean = true; 

  //formularios
  form : FormGroup;
  //señales para verificar si se llenó las preguntas
  enviadoEst = signal(false);
  enviadoCh = signal(false);
  enviadoChDos = signal(false);
  enviadoChTres = signal(false);
  enviadoChCuatro = signal(false);
  enviadoChCinco = signal(false);
  enviadoChSeis = signal(false);
  enviadoHl = signal(false);
  enviadoHlDos = signal(false);
  enviadoHlTres = signal(false);
  enviadoHlCuatro = signal(false);
  
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
      this.pregChasideInteresDos = this.chasideInteresPService.preguntasInteresChasideDos;
      this.pregChasideInteresTres = this.chasideInteresPService.preguntasInteresChasideTres;
      this.pregChasideInteresCuatro = this.chasideInteresPService.preguntasChasideInteresCuatro;
      this.pregChasideAptitud = this.chasideAptitudPService.preguntasAptitudChaside;
      this.pregChasideAptitudDos = this.chasideAptitudPService.preguntasAptitudChasideDos;
      this.pregHollandFirst = this.hollandFirstService.preguntasHollandFirst;
      this.pregHollandSecond= this.hollandSecondService.preguntasHollandSecond
      this.pregHollandThird = this.hollandThirdService.preguntasHollandThird;
      this.pregHollandAutoev = this.hollandAutoevService.preguntasHollandAutoev;

      this.form = this.formBuilder.group({
        carnetNum: new FormControl(null, Validators.required),
        carnetExt: new FormControl('', Validators.required),
        nombre: new FormControl('', Validators.required),
        apPaterno: new FormControl('', Validators.required),
        apMaterno: new FormControl('', Validators.required),
        colegio: new FormControl('', Validators.required),
        curso: new FormControl('', Validators.required),
        edad: new FormControl(null, Validators.required),
        celular: new FormControl('', Validators.required),
        provincia: new FormControl('', Validators.required),
        municipio: new FormControl('', Validators.required),
        respuestasChI : this.formBuilder.array(this.pregChasideInteres.map(
          () => new FormControl(null, Validators.required)
        )),
        respuestasChIDos: this.formBuilder.array(this.pregChasideInteresDos.map(
          () => new FormControl(null, Validators.required)
        )),
        respuestasChITres: this.formBuilder.array(this.pregChasideInteresTres.map(
          () => new FormControl(null, Validators.required)
        )),
        respuestasChICuatro: this.formBuilder.array(this.pregChasideInteresCuatro.map(
          () => new FormControl(null, Validators.required)
        )),
        respuestasChA : this.formBuilder.array(this.pregChasideAptitud.map(
          () => new FormControl(null, Validators.required)
        )),
        respuestasChADos : this.formBuilder.array(this.pregChasideAptitudDos.map(
          () => new FormControl(null, Validators.required)
        )),
        respuestasHF : this.formBuilder.array(this.pregHollandFirst.map(
          () => new FormControl(null)
        )),
        respuestasHS : this.formBuilder.array(this.pregHollandSecond.map(
          () => new FormControl(null)
        )),
        respuestasHT : this.formBuilder.array(this.pregHollandThird.map(
          () => new FormControl(null)
        )),
        respuestasHA : this.formBuilder.array(this.pregHollandAutoev.map(
          () => new FormControl(null, Validators.required)
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
    get respuestasChIDos(): FormArray{
      return this.form.get('respuestasChIDos') as FormArray
    }
    get respuestasChITres(): FormArray{
      return this.form.get('respuestasChITres') as FormArray
    }
    get respuestasChICuatro(): FormArray{
      return this.form.get('respuestasChICuatro') as FormArray
    }
    get respuestasChA(): FormArray{
      return this.form.get('respuestasChA') as FormArray
    }
    get respuestasChADos(): FormArray{
      return this.form.get('respuestasChADos') as FormArray
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
    this.municipios = this.municipioService.municipiosN;
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
    if(this.carnetNum?.invalid || this.carnetExt?.invalid || this.nombre?.invalid || this.apMaterno?.invalid
      || this.apMaterno?.invalid || this.colegio?.invalid || this.curso?.invalid || this.edad?.invalid || this.celular?.invalid
      || this.municipio?.invalid || this.provincia?.invalid){
        alert('Debes llenar todos los campos')
        this.enviadoEst.set(true);
    }else{
      this.formularioActived = true;
      this.chasideActivated = false;
      this.hollandActivated = true;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarChasideDos(){
    if(this.respuestasChI.invalid){
      alert('Debes contestar TODAS las preguntas')
      this.enviadoCh.set(true);
    }else{
    this.chasideActivated = true;
    this.chasideActivatedDos = false;  
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarChasideTres(){
    if(this.respuestasChIDos.invalid){
      alert('Debes contestar TODAS las preguntas')
      this.enviadoChDos.set(true);
    }else{
    this.chasideActivatedDos = true;
    this.chasideActivatedTres = false; 
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarChasideCuatro(){
    if(this.respuestasChITres.invalid){
      alert('Debes contestar TODAS las preguntas')
      this.enviadoChTres.set(true);
    }else{
    this.chasideActivatedTres = true;
    this.chasideActivatedCuatro = false;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarChasideCinco(){
    if(this.respuestasChICuatro.invalid){
      alert('Debes contestar TODAS las preguntas')
      this.enviadoChCuatro.set(true);
    }else{
    this.chasideActivatedCuatro = true;
    this.chasideActivatedCinco = false;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarChasideSeis(){
    if(this.respuestasChA.invalid){
      alert('Debes contestar TODAS las preguntas')
      this.enviadoChCinco.set(true);
    }else{
    this.chasideActivatedCinco = true;
    this.chasideActivatedSeis = false;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarHolland(){
    if(this.respuestasChADos.invalid){
      alert('Debes contestar TODAS las preguntas')
      this.enviadoChSeis.set(true);
    }else{
    this.chasideActivatedSeis = true;
    this.hollandActivated = false;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarHollandDos(){
    if(!this.respuestasHF.dirty){
      alert('Debes marcar algunas opciones')
      this.enviadoHl.set(true);
    }else{
    this.hollandActivated = true;
    this.hollandActivatedDos = false;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarHollandTres(){
    if(!this.respuestasHS.dirty){
      alert('Debes marcar algunas opciones')
      this.enviadoHlDos.set(true);
    }else{
    this.hollandActivatedDos = true;
    this.hollandActivatedTres = false;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }
  mostrarHollandCuatro(){
    if(!this.respuestasHT.dirty){
      alert('Debes marcar algunas opciones')
      this.enviadoHlTres.set(true);
    }else{
    this.hollandActivatedTres = true;
    this.hollandActivatedCuatro = false;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  guardarResultado(){
    if(this.respuestasHA.invalid){
      alert('Debes responder todas las preguntas')
      this.enviadoHlCuatro.set(true);
    }
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
    this.estudianteI.ciEstudiante = this.carnet.toUpperCase();
    this.estudianteI.nombre = this.nombre?.value.toUpperCase();
    this.estudianteI.apPaterno = this.apPaterno?.value.toUpperCase();
    this.estudianteI.apMaterno = this.apMaterno?.value.toUpperCase();
    this.estudianteI.colegio = this.colegio?.value.toUpperCase();
    this.estudianteI.curso = this.curso?.value;
    this.estudianteI.edad = this.edad?.value;
    this.estudianteI.celular = this.celular?.value;
    this.estudianteI.id_municipio = this.idMunicipio;

      //resultado general chaside
      const resultadoChaside = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
      //resultado chaside interes
      const resultadoInteres = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
      //resultado seccion UNO chaside interes
      this.respuestasChI.controls.forEach((control, i) =>{
        const area = this.pregChasideInteres[i].area;
        //sumar los resultados de interes
        resultadoInteres[area] += Number(control.value);
        //sumar los resultados al resultado general
        resultadoChaside[area] += Number(control.value);
      });
      //resultado seccion DOS chaside interes
      this.respuestasChIDos.controls.forEach((control, i) =>{
        const area = this.pregChasideInteresDos[i].area;
        //sumar los resultados de interes
        resultadoInteres[area] += Number(control.value);
        //sumar los resultados al resultado general
        resultadoChaside[area] += Number(control.value);
      });
      //resultado seccion TRES chaside interes
      this.respuestasChITres.controls.forEach((control, i) =>{
        const area = this.pregChasideInteresTres[i].area;
        //sumar los resultados de interes
        resultadoInteres[area] += Number(control.value);
        //sumar los resultados al resultado general
        resultadoChaside[area] += Number(control.value);
      });
      //resultado seccion CUATRO chaside interes
      this.respuestasChICuatro.controls.forEach((control, i) =>{
        const area = this.pregChasideInteresCuatro[i].area;
        //sumar los resultados de interes
        resultadoInteres[area] += Number(control.value);
        //sumar los resultados al resultado general
        resultadoChaside[area] += Number(control.value);
      });
      // resultado seccion aptitud chaside
      const resultadoAptitud = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
      //resultado seccion UNO chaside aptitud
      this.respuestasChA.controls.forEach((control, i) =>{
        const area = this.pregChasideAptitud[i].area;
        resultadoAptitud[area] += Number(control.value);
        resultadoChaside[area] += Number(control.value);
      });
      //resultado seccion UNO chaside aptitud
      this.respuestasChADos.controls.forEach((control, i) =>{
        const area = this.pregChasideAptitudDos[i].area;
        resultadoAptitud[area] += Number(control.value);
        resultadoChaside[area] += Number(control.value);
      });

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
            nombre: [`${this.nombre?.value} ${this.apPaterno?.value} ${this.apMaterno?.value}`.toUpperCase()],
            colegio: this.colegio?.value.toUpperCase(),
            carnet: this.carnet,
            interes: this.puntajeInteres,
            aptitud: this.puntajeAptitud,
            holland: this.perfil().join(''),
            chaside: this.chasidePtj,
            celular: this.celular?.value,
            curso: this.curso?.value,
            edad: this.edad?.value,
            provincia: this.provincia?.value.toUpperCase(),
            municipio: this.municipio?.value.toUpperCase()
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
            provincia: this.provincia?.value.toUpperCase(),
            municipio: this.municipio?.value.toUpperCase()
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