import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { NavigationExtras, RouterModule } from '@angular/router';
import {
  FormArray, FormControl, FormGroup, ReactiveFormsModule,
  Validators, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors,
  FormsModule
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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
import { Resultado } from '../../../interfaces/resultado-interface';
import Swal from 'sweetalert2';
import { Colegio } from '../../../interfaces/colegio-interface';
import { ColegioService } from '../../../services/colegio.service';
import { Chaside } from '../../../interfaces/chaside-interface';
import { Holland } from '../../../interfaces/holland-interface';
import { ChasideService } from '../../../services/chaside.service';
import { HollandService } from '../../../services/holland.service';
import { EvaluacionService } from '../../../services/evaluacion.service';

@Component({
  selector: 'app-form-estudiante',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-estudiante.component.html',
  styleUrl: './form-estudiante.component.css'
})
export class FormEstudianteComponent implements OnInit, OnDestroy {

  // ── Estado del formulario ────────────────────────────────────────────────────
  submitted = false;

  // ── Datos de selección de ubicación ─────────────────────────────────────────
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  municipiosFiltrados: Municipio[] = [];
  colegios: Colegio[] = [];
  colegiosFiltrados: Colegio[] = [];

  private destroy$ = new Subject<void>();

  // ── Preguntas de los tests ───────────────────────────────────────────────────
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

  // ── Resultados del test de Holland ──────────────────────────────────────────
  resultadoHolland = signal<Record<string, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  perfil = computed(() => {
    const res = this.resultadoHolland();
    return Object.entries(res)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key]) => key);
  });
  chasidePtj: string = '';
  areaChaside: string[] = [];
  puntajeAptitud: number = 0;
  puntajeInteres: number = 0;


  // ── Visibilidad de secciones ─────────────────────────────────────────────────
  formularioActived: boolean = false;
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

  // ── Formulario reactivo ──────────────────────────────────────────────────────
  form: FormGroup;

  // ── Señales de validación enviada ───────────────────────────────────────────
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

  // ── Resultado a enviar ───────────────────────────────────────────────────────
  resultadoEnviar: Resultado = {
    idResultado: null,
    interes: 0,
    aptitud: 0,
    puntajeHolland: '',
    puntajeChaside: '',
    fecha: '',
    idChaside: 0,
    idHolland: 0
  };
  chaside: Chaside[]= [];
  holland: Holland[] = [];

  constructor(
    private provinciaService: ProvinciaService,
    private municipioService: MunicipioService,
    private router: Router,
    private chasideInteresPService: ChasideInteresPService,
    private chasideAptitudPService: ChasideAptitudPService,
    private hollandFirstService: HollandFirstService,
    private hollandSecondService: HollandSecondService,
    private hollandThirdService: HollandThirdService,
    private hollandAutoevService: HollandAutoevService,
    private formBuilder: FormBuilder,
    private colegioService: ColegioService,
    private chasideService: ChasideService,
    private hollandService: HollandService,
    private evaluacionService: EvaluacionService
  ) {
    this.pregChasideInteres = this.chasideInteresPService.preguntasInteresChasides;
    this.pregChasideInteresDos = this.chasideInteresPService.preguntasInteresChasideDos;
    this.pregChasideInteresTres = this.chasideInteresPService.preguntasInteresChasideTres;
    this.pregChasideInteresCuatro = this.chasideInteresPService.preguntasChasideInteresCuatro;
    this.pregChasideAptitud = this.chasideAptitudPService.preguntasAptitudChaside;
    this.pregChasideAptitudDos = this.chasideAptitudPService.preguntasAptitudChasideDos;
    this.pregHollandFirst = this.hollandFirstService.preguntasHollandFirst;
    this.pregHollandSecond = this.hollandSecondService.preguntasHollandSecond;
    this.pregHollandThird = this.hollandThirdService.preguntasHollandThird;
    this.pregHollandAutoev = this.hollandAutoevService.preguntasHollandAutoev;

    this.form = this.formBuilder.group({
      carnetNum: new FormControl(null, Validators.required),
      carnetExt: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      apPaterno: new FormControl('', Validators.required),
      apMaterno: new FormControl('', Validators.required),
      curso: new FormControl('', Validators.required),
      edad: new FormControl(null, [Validators.required, Validators.min(14), Validators.max(80)]),
      celular: new FormControl(null, [Validators.required, Validators.pattern(/^\d{8}$/)]),
      // Guarda el idProvincia (number), NO el nombre
      provincia: new FormControl<number | null>(null, Validators.required),
      // Guarda el idMunicipio (number), NO el nombre
      municipio: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
      // Guarda el idColegio (number), NO el nombre
      colegio: new FormControl< number | null >({ value: null, disabled: true }),
      usarNombreColegio: new FormControl(false),
      nombreColegio: new FormControl< string | null>({ value: null, disabled: true}),
      respuestasChI: this.formBuilder.array(this.pregChasideInteres.map(
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
      respuestasChA: this.formBuilder.array(this.pregChasideAptitud.map(
        () => new FormControl(null, Validators.required)
      )),
      respuestasChADos: this.formBuilder.array(this.pregChasideAptitudDos.map(
        () => new FormControl(null, Validators.required)
      )),
      respuestasHF: this.formBuilder.array(this.pregHollandFirst.map(
        () => new FormControl(null)), [this.minimoRespuestasSeleccionadas(5)]
      ),
      respuestasHS: this.formBuilder.array(this.pregHollandSecond.map(
        () => new FormControl(null)), [this.minimoRespuestasSeleccionadas(5)]
      ),
      respuestasHT: this.formBuilder.array(this.pregHollandThird.map(
        () => new FormControl(null)), [this.minimoRespuestasSeleccionadas(5)]
      ),
      respuestasHA: this.formBuilder.array(this.pregHollandAutoev.map(
        () => new FormControl(null, Validators.required)
      ))
    });
  }

  // ── Getters de controles ─────────────────────────────────────────────────────
  get carnetNum() { return this.form.get('carnetNum'); }
  get carnetExt() { return this.form.get('carnetExt'); }
  get nombre() { return this.form.get('nombre'); }
  get apPaterno() { return this.form.get('apPaterno'); }
  get apMaterno() { return this.form.get('apMaterno'); }
  get colegio() { return this.form.get('colegio'); }
  get nombreColegio() { return this.form.get('nombreColegio'); }
  get usarNombreColegio() { return this.form.get('usarNombreColegio'); }
  get curso() { return this.form.get('curso'); }
  get edad() { return this.form.get('edad'); }
  get celular() { return this.form.get('celular'); }
  get provincia() { return this.form.get('provincia'); }
  get municipio() { return this.form.get('municipio'); }
  get respuestasChI(): FormArray { return this.form.get('respuestasChI') as FormArray; }
  get respuestasChIDos(): FormArray { return this.form.get('respuestasChIDos') as FormArray; }
  get respuestasChITres(): FormArray { return this.form.get('respuestasChITres') as FormArray; }
  get respuestasChICuatro(): FormArray { return this.form.get('respuestasChICuatro') as FormArray; }
  get respuestasChA(): FormArray { return this.form.get('respuestasChA') as FormArray; }
  get respuestasChADos(): FormArray { return this.form.get('respuestasChADos') as FormArray; }
  get respuestasHF(): FormArray { return this.form.get('respuestasHF') as FormArray; }
  get respuestasHS(): FormArray { return this.form.get('respuestasHS') as FormArray; }
  get respuestasHT(): FormArray { return this.form.get('respuestasHT') as FormArray; }
  get respuestasHA(): FormArray { return this.form.get('respuestasHA') as FormArray; }

  // ── Ciclo de vida ────────────────────────────────────────────────────────────

  ngOnInit(): void {

    this.chasideService.getAll().subscribe(data => {
        this.chaside = data;
    })

    this.hollandService.getAll().subscribe(data => {
        this.holland = data;
    })

    this.provinciaService.getProvincias().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.provincias = data;
    });
    
    this.municipioService.getAllMunicipios().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.municipios = data;
      // this.municipiosFiltrados = [...this.municipios];
    });

    this.provincia!.valueChanges
  .pipe(takeUntil(this.destroy$))
  .subscribe((idProvincia: number | null) => {

    this.municipio!.reset();
    this.colegio!.reset();

    this.colegio!.disable();

    if (!idProvincia) {
        this.municipio!.disable();
        this.municipiosFiltrados = [];
        return;
    }

    this.municipio!.enable();

    if (idProvincia !== null) {
        this.municipioService.getMunicipiosPorProvinciaHttp(idProvincia).subscribe (data => {
            this.municipiosFiltrados = data
        })
    }

    // if (this._syncingLocation) return;
    // this._syncingLocation = true;
    // try {
    //   if (idProvincia === null || idProvincia <= 0) {
    //     this.municipio!.setValue(null, { emitEvent: false });
    //   }
    // } finally {
    //   this._syncingLocation = false;
    // }
  });

    this.municipio!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((idMunicipio: number | null) => {
        // if (this._syncingLocation) return;
        if (idMunicipio === null || idMunicipio === 0) return;

        this.colegio!.reset();

        if (!idMunicipio) {
            this.colegio!.disable();
            this.colegiosFiltrados = [];
            return;
        }

        this.colegio!.enable();

        this.colegioService.getColegiosPorMunicipioHttp(idMunicipio).subscribe(data => {
            this.colegiosFiltrados = data
        });

        // this._syncingLocation = true;
        // try {
        //   const idProvinciaDelMunicipio = this.todosMunicipios.find(m => m.idMunicipio === idMunicipio)?.idProvincia ?? null;
        //   if (idProvinciaDelMunicipio !== null) {
        //     const idProvinciaActual: number | null = this.provincia!.value;
        //     if (idProvinciaActual !== idProvinciaDelMunicipio) {
        //       this.provincia!.setValue(idProvinciaDelMunicipio, { emitEvent: false });
        //     }
        //   }
        // } finally {
        //   this._syncingLocation = false;
        // }
      });

      this.form.get('usarNombreColegio')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((usarNombre: boolean) => {
        if (usarNombre) {
            this.colegio!.setValue(null);

            this.colegio!.disable();
            this.nombreColegio!.enable();
        } else {
            this.nombreColegio!.setValue(null);

            this.nombreColegio!.disable();

            if (this.municipio?.value) {
                this.colegio!.enable();
            }
        }
      })

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.beforeUnloadHandler);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    }
  }

  // ── funcion aux para validar el colegio ──────────────────────────────────────

  colegioValido(): boolean {
    const colegio = this.colegio?.value;
    const nombreColegio = this.nombreColegio?.value?.trim();

    return !!colegio || !!nombreColegio;
  }

  // ── Guard de salida ──────────────────────────────────────────────────────────

  canDeactivate(): boolean {
    if (!this.submitted && this.form.dirty) {
      return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir del formulario?');
    }
    return true;
  }

  beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    if (this.form.dirty && !this.submitted) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  // ── Navegación entre secciones ───────────────────────────────────────────────

  mostrarRegistroEstudiante(): void {
    this.formularioActived = false;
    this.chasideActivated = true;
    this.hollandActivated = true;
    window.scrollTo({ top: 0.5, behavior: 'instant' });
  }

  mostrarChaside(): void {
    const colegio = this.colegio?.value;
    const nombreColegio = this.nombreColegio?.value;
    if (
      this.carnetNum?.invalid || this.carnetExt?.invalid || this.nombre?.invalid ||
      this.apMaterno?.invalid || this.apPaterno?.invalid || this.curso?.invalid || 
      this.municipio?.invalid || this.provincia?.invalid || !this.colegioValido()
    ) {
      this.mostrarNotificacionIncompleto('Debes llenar todos los campos');
      this.enviadoEst.set(true);
      return;
    } else if (this.edad?.invalid) {
      this.mostrarNotificacionIncompleto('Debes ingresar una edad válida (entre 14 y 80 años)');
      this.enviadoEst.set(true);
      return;
    } else if (this.celular?.invalid) {
      this.mostrarNotificacionIncompleto('Debes ingresar un número de celular válido (8 dígitos)');
      this.enviadoEst.set(true);
      return;
    } else if (colegio && nombreColegio){
        this.mostrarNotificacionIncompleto('Solo puede completarse un campo en colegio')
        return;
    }
    else {
      this.formularioActived = true;
      this.chasideActivated = false;
      this.hollandActivated = true;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarChasideDos(): void {
    if (this.respuestasChI.invalid) {
      this.mostrarNotificacionIncompleto('Debes contestar TODAS las preguntas');
      this.enviadoCh.set(true);
    } else {
      this.chasideActivated = true;
      this.chasideActivatedDos = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarChasideTres(): void {
    if (this.respuestasChIDos.invalid) {
      this.mostrarNotificacionIncompleto('Debes contestar TODAS las preguntas');
      this.enviadoChDos.set(true);
    } else {
      this.chasideActivatedDos = true;
      this.chasideActivatedTres = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarChasideCuatro(): void {
    if (this.respuestasChITres.invalid) {
      this.mostrarNotificacionIncompleto('Debes contestar TODAS las preguntas');
      this.enviadoChTres.set(true);
    } else {
      this.chasideActivatedTres = true;
      this.chasideActivatedCuatro = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarChasideCinco(): void {
    if (this.respuestasChICuatro.invalid) {
      this.mostrarNotificacionIncompleto('Debes contestar TODAS las preguntas');
      this.enviadoChCuatro.set(true);
    } else {
      this.chasideActivatedCuatro = true;
      this.chasideActivatedCinco = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarChasideSeis(): void {
    if (this.respuestasChA.invalid) {
      this.mostrarNotificacionIncompleto('Debes contestar TODAS las preguntas');
      this.enviadoChCinco.set(true);
    } else {
      this.chasideActivatedCinco = true;
      this.chasideActivatedSeis = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarHolland(): void {
    if (this.respuestasChADos.invalid) {
      this.mostrarNotificacionIncompleto('Debes contestar TODAS las preguntas');
      this.enviadoChSeis.set(true);
    } else {
      this.chasideActivatedSeis = true;
      this.hollandActivated = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarHollandDos(): void {
    if (!this.respuestasHF.dirty) {
      this.mostrarNotificacionIncompleto('Debes marcar algunas opciones');
      this.enviadoHl.set(true);
    } else if (this.respuestasHF.invalid && this.respuestasHF?.errors?.['minimoNoCumplido']) {
      this.mostrarNotificacionOpcionesIncompleto('Debes escoger al menos 5 actividades');
    } else {
      this.hollandActivated = true;
      this.hollandActivatedDos = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarHollandTres(): void {
    if (!this.respuestasHS.dirty) {
      this.mostrarNotificacionIncompleto('Debes marcar algunas opciones');
      this.enviadoHlDos.set(true);
    } else if (this.respuestasHS.invalid && this.respuestasHS?.errors?.['minimoNoCumplido']) {
      this.mostrarNotificacionOpcionesIncompleto('Debes escoger al menos 5 habilidades');
    } else {
      this.hollandActivatedDos = true;
      this.hollandActivatedTres = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  mostrarHollandCuatro(): void {
    if (!this.respuestasHT.dirty) {
      this.mostrarNotificacionIncompleto('Debes marcar algunas opciones');
      this.enviadoHlTres.set(true);
    } else if (this.respuestasHT.invalid && this.respuestasHT?.errors?.['minimoNoCumplido']) {
      this.mostrarNotificacionOpcionesIncompleto('Debes escoger al menos 5 ocupaciones');
    } else {
      this.hollandActivatedTres = true;
      this.hollandActivatedCuatro = false;
      window.scrollTo({ top: 0.5, behavior: 'instant' });
    }
  }

  // ── Validadores personalizados ───────────────────────────────────────────────

  minimoRespuestasSeleccionadas(min: number): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const totalRespondidas = (formArray as FormArray).controls
        .filter(control => control.value !== null && control.value !== '').length;
      return totalRespondidas >= min ? null : { minimoNoCumplido: true };
    };
  }

  // ── Notificaciones ───────────────────────────────────────────────────────────

  mostrarNotificacionIncompleto(mensaje: string): void {
    Swal.fire({
      title: 'Incompleto',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#d33',
      background: '#f7f7f7',
      color: '#333',
      buttonsStyling: true
    });
  }

  mostrarNotificacionOpcionesIncompleto(mensaje: string): void {
    Swal.fire({
      title: 'Incompleto',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#d33',
      background: '#f7f7f7',
      color: '#333',
      buttonsStyling: true
    });
  }


  // ── Guardar resultados ───────────────────────────────────────────────────────

  guardarResultado(): void {
    if (this.respuestasHA.invalid) {
      this.mostrarNotificacionIncompleto('Debes calificar en todas las actividades');
      this.enviadoHlCuatro.set(true);
    }
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;

    // Carnet: concatenar número + extensión
    const carnet = `${this.carnetNum?.value}${this.carnetExt?.value}`;

    // Obtener idMunicipio directamente del control (ya es number)
    const idMunicipio: number = this.municipio!.value;

    // Obtener nombre de provincia y municipio para mostrar en el resultado
    const idProvincia: number = this.provincia!.value;
    const provinciaObj = this.provincias.find(p => p.idProvincia === idProvincia);
    const municipioObj = this.municipios.find(m => m.idMunicipio === idMunicipio);
    const provinciaNombre = provinciaObj?.nombre ?? '';
    const municipioNombre = municipioObj?.nombre ?? '';

    // ── Calcular resultados CHASIDE ──────────────────────────────────────────
    const resultadoChaside = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };

    const resultadoInteres = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };

    this.respuestasChI.controls.forEach((control, i) => {
      const area = this.pregChasideInteres[i].area;
      resultadoInteres[area] += Number(control.value);
      resultadoChaside[area] += Number(control.value);
    });
    this.respuestasChIDos.controls.forEach((control, i) => {
      const area = this.pregChasideInteresDos[i].area;
      resultadoInteres[area] += Number(control.value);
      resultadoChaside[area] += Number(control.value);
    });
    this.respuestasChITres.controls.forEach((control, i) => {
      const area = this.pregChasideInteresTres[i].area;
      resultadoInteres[area] += Number(control.value);
      resultadoChaside[area] += Number(control.value);
    });
    this.respuestasChICuatro.controls.forEach((control, i) => {
      const area = this.pregChasideInteresCuatro[i].area;
      resultadoInteres[area] += Number(control.value);
      resultadoChaside[area] += Number(control.value);
    });

    const resultadoAptitud = { C: 0, H: 0, A: 0, S: 0, I: 0, D: 0, E: 0 };
    this.respuestasChA.controls.forEach((control, i) => {
      const area = this.pregChasideAptitud[i].area;
      resultadoAptitud[area] += Number(control.value);
      resultadoChaside[area] += Number(control.value);
    });
    this.respuestasChADos.controls.forEach((control, i) => {
      const area = this.pregChasideAptitudDos[i].area;
      resultadoAptitud[area] += Number(control.value);
      resultadoChaside[area] += Number(control.value);
    });

    // obtener puntaje chaside
    const puntajeChaside = Object.entries(resultadoChaside)
        .sort((a, b) => b[1] - a[1])
        .map(([letra]) => letra)
        .join('');

    // obtener el idChaside correspondiente al puntaje obtenido, tambien obtener el puntaje de interes y de aptitud
    const letraPrincipalChaside = puntajeChaside[0];

    this.puntajeInteres = resultadoInteres[letraPrincipalChaside as keyof typeof resultadoInteres];
    this.puntajeAptitud = resultadoAptitud[letraPrincipalChaside as keyof typeof resultadoAptitud];

    const objChasideEncontrado = this.chaside.find(
        c => c.puntaje === letraPrincipalChaside
    );
    const idChaside = objChasideEncontrado?.idChaside ?? null;

    // ── Calcular resultados HOLLAND ──────────────────────────────────────────
    const resultadoHolland = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    this.respuestasHF.controls.forEach((control, i) => {
      resultadoHolland[this.pregHollandFirst[i].area as keyof typeof resultadoHolland] += Number(control.value);
    });
    this.respuestasHS.controls.forEach((control, i) => {
      resultadoHolland[this.pregHollandSecond[i].area as keyof typeof resultadoHolland] += Number(control.value);
    });
    this.respuestasHT.controls.forEach((control, i) => {
      resultadoHolland[this.pregHollandThird[i].area as keyof typeof resultadoHolland] += Number(control.value);
    });
    this.respuestasHA.controls.forEach((control, i) => {
      resultadoHolland[this.pregHollandAutoev[i].area as keyof typeof resultadoHolland] += Number(control.value);
    });
    this.resultadoHolland.set(resultadoHolland);

    // obtener el puntaje holland de acuerdo a las preguntas del formulario
    const puntajeHolland = Object.entries(resultadoHolland)
        .sort((a,b) => b[1] - a[1])
        .map(([letra]) => letra)
        .join('');

    // obtener el idHolland asociado a la respuestas del formulario
    const letraPrincipalHolland = puntajeHolland[0];

    const objHollandEncontrado = this.holland.find(
        h => h.codigo === letraPrincipalHolland
    );
    const idHolland = objHollandEncontrado?.idHolland ?? null;


    // ── Obtener la fecha actual de llenado del formulario ──────────────────────────────────────────
    const fechaStr = new Date().toLocaleDateString();

    const payload = {
        estudianteDto: {
            ciEstudiante : carnet,
            nombre: this.nombre?.value,
            apPaterno: this.apPaterno?.value,
            apMaterno: this.apMaterno?.value,
            idColegio: this.colegio?.value,
            nombreColegio: this.nombreColegio?.value,
            curso: this.curso?.value,
            edad: this.edad?.value,
            celular: this.celular?.value,
            id_municipio: this.municipio?.value
        },
        resultadoDto: {
            interes: this.puntajeInteres,
            aptitud: this.puntajeAptitud,
            puntajeHolland,
            puntajeChaside,
            fecha: fechaStr,
            idChaside,
            idHolland
        }
    }
    console.log(payload)

    this.evaluacionService.guardarEvaluacion(payload).subscribe({
        next: response => {
            const navigationExtras: NavigationExtras = {
                state: {
                    bdform: response.guardarResultado,
                    nombre: [`${response.nombre} ${response.apPaterno} ${response.apMaterno}`],
                    carnet: response.ciEstudiante,
                    interes: response.puntajeInteres,
                    aptitud: response.puntajeAptitud,
                    holland: response.holland,
                    colegio: response.nombreColegio,
                    chaside: response.chaside[0],
                    celular: response.celular,
                    curso: response.curso,
                    edad: response.edad,
                    municipio: response.municipio,
                    provincia: response.provincia
                }
            };
            this.router.navigate(['formulario/resultado'], navigationExtras);
        },
        error: (error:any) => {
            console.error('error al guardar la evaluacion', error);
        }
    })
  
  }

}