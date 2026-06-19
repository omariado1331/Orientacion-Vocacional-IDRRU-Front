import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Estudiante } from '../../../../interfaces/estudiante-interface';
import { ResultadoDto } from '../../../../interfaces/resultado-interface';
import { Provincia } from '../../../../interfaces/provincia-interface';
import { Municipio } from '../../../../interfaces/municipio-interface';
import { Colegio } from '../../../../interfaces/colegio-interface';
import { Chaside } from '../../../../interfaces/chaside-interface';
import { Holland } from '../../../../interfaces/holland-interface';
import { EstudianteService } from '../../../../services/estudiante.service';
import { ResultadoService } from '../../../../services/resultado.service';
import { MunicipioService } from '../../../../services/municipio.service';
import { ColegioService } from '../../../../services/colegio.service';
import { NotificacionService } from '../../../../services/notificacion.service';
import Swal from 'sweetalert2';
import { Observable, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-modal-editar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-editar.component.html',
  styleUrls: ['./modal-editar.component.css'],
  providers: [ColegioService, MunicipioService]
})
export class ModalEditarComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() estudiante: Estudiante | null = null;
  @Input() resultados: ResultadoDto[] = [];
  @Input() provincias: Provincia[] = [];
  @Input() municipios: Municipio[] = [];
  @Input() municipiosPorProvincia: { [provinciaId: number]: Municipio[] } = {};
  @Input() colegios: Colegio[] = [];
  @Input() chasideOpciones: Chaside[] = [];
  @Input() hollandOpciones: Holland[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  editarForm!: FormGroup;
  resultadosForm!: FormArray;
  municipiosFiltrados: Municipio[] = [];
  colegiosFiltrados: Colegio[] = [];
  loading = false;

  get resultadosFormGroups(): FormArray<FormGroup> {
    return this.resultadosForm as FormArray<FormGroup>;
  }

  /** Helper para castear AbstractControl a FormGroup en el template */
  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  constructor(
    private formBuilder: FormBuilder,
    private estudianteService: EstudianteService,
    private resultadoService: ResultadoService,
    private municipioService: MunicipioService,
    private colegioService: ColegioService,
    private notificacionService: NotificacionService
  ) {
    this.inicializarFormularios();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.cargarDatosAlFormulario();
    }
  }

  private inicializarFormularios(): void {
    this.editarForm = this.formBuilder.group({
      ciEstudiante: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apPaterno: ['', [Validators.required]],
      apMaterno: [''],
      idColegio: [null, [Validators.required]],
      curso: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(10), Validators.max(30)]],
      celular: ['', [Validators.pattern(/^\d+$/)]],
      idProvincia: [null, [Validators.required]],
      idMunicipio: [null, [Validators.required]]
    });

    this.resultadosForm = this.formBuilder.array([]);
  }

  private cargarDatosAlFormulario(): void {
    if (!this.estudiante) return;

    // Normalizar el municipio (puede venir como string desde el backend)
    const idMunicipioEstudiante: number | null = this.estudiante.idMunicipio
      ? Number(this.estudiante.idMunicipio)
      : null;
    const idColegioEstudiante: number | null = this.estudiante.idColegio
      ? Number(this.estudiante.idColegio)
      : null;
    const provinciaEstudiante = idMunicipioEstudiante
      ? this.getProvinciaByMunicipio(idMunicipioEstudiante)
      : null;

    this.editarForm.patchValue({
      ciEstudiante: this.estudiante.ciEstudiante,
      nombre: this.estudiante.nombre,
      apPaterno: this.estudiante.apPaterno,
      apMaterno: this.estudiante.apMaterno,
      curso: this.estudiante.curso,
      edad: this.estudiante.edad,
      celular: this.estudiante.celular,
      idProvincia: provinciaEstudiante ? provinciaEstudiante.idProvincia : null,
      idMunicipio: idMunicipioEstudiante,
      idColegio: idColegioEstudiante
    });

    if (idMunicipioEstudiante) {
      // Cargar colegios por municipio via HTTP
      this.colegioService.getColegiosPorMunicipioHttp(idMunicipioEstudiante).subscribe({
        next: (colegios: Colegio[]) => {
          this.colegiosFiltrados = colegios.length > 0
            ? colegios
            : this.colegios.filter(c => c.idMunicipio === idMunicipioEstudiante);
          // Re-asignar idColegio después de cargar opciones para que el select lo muestre
          setTimeout(() => {
            this.editarForm.patchValue({ idColegio: idColegioEstudiante });
          }, 0);
        },
        error: () => {
          this.colegiosFiltrados = this.colegios.filter(c => c.idMunicipio === idMunicipioEstudiante);
          setTimeout(() => {
            this.editarForm.patchValue({ idColegio: idColegioEstudiante });
          }, 0);
        }
      });
    } else {
      this.colegiosFiltrados = this.colegios;
    }

    if (provinciaEstudiante) {
      const idProv: number = provinciaEstudiante.idProvincia;
      this.municipiosFiltrados = this.municipiosPorProvincia[idProv] ||
        this.municipios.filter((m: Municipio) => m.idProvincia === idProv);
    } else {
      this.municipiosFiltrados = this.municipios;
    }

    // Cargar resultados en el FormArray
    this.resultadosForm.clear();
    this.resultados.forEach(r => {
      this.resultadosForm.push(this.crearFormularioResultado(r));
    });
  }

  getProvinciaByMunicipio(idMunicipio: number): Provincia | undefined {
    const municipio = this.municipios.find(m => m.idMunicipio === idMunicipio);
    if (municipio && municipio.idProvincia) {
      return this.provincias.find(p => p.idProvincia === municipio.idProvincia);
    }
    return undefined;
  }

  onProvinciaChangeEditar(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const idProvincia = Number(select.value);
    if (!isNaN(idProvincia) && idProvincia > 0) {
      this.municipiosFiltrados = this.municipiosPorProvincia[idProvincia] ||
        this.municipios.filter(m => m.idProvincia === idProvincia);
      this.editarForm.patchValue({ idMunicipio: null, idColegio: null });
      this.colegiosFiltrados = [];
    } else {
      this.municipiosFiltrados = this.municipios;
      this.editarForm.patchValue({ idMunicipio: null, idColegio: null });
      this.colegiosFiltrados = [...this.colegios];
    }
  }

  onMunicipioChangeEditar(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const idMunicipio = Number(select.value);
    if (!isNaN(idMunicipio) && idMunicipio > 0) {
      const provincia = this.getProvinciaByMunicipio(idMunicipio);
      if (provincia) {
        const idProvinciaActual = Number(this.editarForm.get('idProvincia')?.value);
        if (idProvinciaActual !== provincia.idProvincia) {
          this.editarForm.patchValue({ idProvincia: provincia.idProvincia });
          this.municipiosFiltrados = this.municipiosPorProvincia[provincia.idProvincia] ||
            this.municipios.filter(m => m.idProvincia === provincia.idProvincia);
        }
      }
      // Cargar colegios del municipio via HTTP para obtener datos frescos
      this.colegioService.getColegiosPorMunicipioHttp(idMunicipio).subscribe({
        next: (colegios) => {
          this.colegiosFiltrados = colegios.length > 0
            ? colegios
            : this.colegios.filter(c => c.idMunicipio === idMunicipio);
          const idColegioActual = Number(this.editarForm.get('idColegio')?.value);
          if (idColegioActual && !this.colegiosFiltrados.some(c => c.idColegio === idColegioActual)) {
            this.editarForm.patchValue({ idColegio: null });
          }
        },
        error: () => {
          this.colegiosFiltrados = this.colegios.filter(c => c.idMunicipio === idMunicipio);
        }
      });
    } else {
      this.colegiosFiltrados = [...this.colegios];
    }
  }

  crearFormularioResultado(resultado?: Partial<ResultadoDto>): FormGroup {
    const fechaResultado = resultado?.created_at || resultado?.createdAt || resultado?.fecha;
    return this.formBuilder.group({
      idResultado: [resultado?.idResultado || null],
      interes: [resultado?.interes || null, [Validators.required, Validators.min(0), Validators.max(100)]],
      aptitud: [resultado?.aptitud || null, [Validators.required, Validators.min(0), Validators.max(100)]],
      puntajeHolland: [resultado?.puntajeHolland || 'N/A'],
      fecha: [fechaResultado ? this.formatearFechaParaInput(fechaResultado) :
        this.formatearFechaParaInput(new Date().toISOString())],
      idEstudiante: [resultado?.idEstudiante || null],
      idChaside: [resultado?.idChaside || null, Validators.required],
      idHolland: [resultado?.idHolland || null, Validators.required]
    });
  }

  formatearFechaParaInput(fechaIso: string): string {
    const d = new Date(fechaIso);
    const anio = d.getFullYear();
    const mes = ('0' + (d.getMonth() + 1)).slice(-2);
    const dia = ('0' + d.getDate()).slice(-2);
    return `${anio}-${mes}-${dia}`;
  }

  agregarNuevoResultado(): void {
    const nuevoResultado = this.crearFormularioResultado({
      idEstudiante: this.estudiante?.idEstudiante ?? undefined,
    });
    this.resultadosForm.push(nuevoResultado);
  }

  eliminarResultado(index: number): void {
    this.resultadosForm.removeAt(index);
  }

  cerrarModal(): void {
    if (this.editarForm.dirty || this.resultadosForm.dirty) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "Tienes cambios sin guardar. ¿Deseas descartarlos?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, descartar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.close.emit();
        }
      });
    } else {
      this.close.emit();
    }
  }

  esFormularioValido(): boolean {
    if (this.editarForm.invalid) return false;
    for (let i = 0; i < this.resultadosForm.length; i++) {
      if (this.resultadosForm.at(i).invalid) return false;
    }
    return true;
  }

  async guardarEdicion(): Promise<void> {
    if (!this.esFormularioValido() || !this.estudiante) {
      this.notificacionService.mostrar('Por favor, complete todos los campos requeridos', 'error');
      return;
    }

    // Confirmacion con SweetAlert
    const confirm = await Swal.fire({
      title: 'Guardar Cambios',
      text: '¿Estás seguro de que deseas guardar los cambios en este estudiante?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1756A3',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    this.loading = true;
    const formVal = this.editarForm.value;
    const estudianteActualizado = {
      ...this.estudiante,
      ...formVal,
      idMunicipio: formVal.idMunicipio
    };

    this.estudianteService.update(estudianteActualizado.idEstudiante, estudianteActualizado).subscribe({
      next: () => {
        const resultadosOperaciones: Observable<unknown>[] = [];
        for (let i = 0; i < this.resultadosForm.length; i++) {
          const resultadoForm = this.resultadosForm.at(i) as FormGroup;
          const resultadoData = resultadoForm.value;
          resultadoData.idEstudiante = estudianteActualizado.idEstudiante;
          if (resultadoData.idResultado) {
            resultadosOperaciones.push(
              this.resultadoService.update(resultadoData.idResultado, resultadoData)
            );
          } else {
            resultadosOperaciones.push(
              this.resultadoService.create(resultadoData)
            );
          }
        }
        
        if (resultadosOperaciones.length === 0) {
          this.loading = false;
          this.notificacionService.mostrar('Estudiante actualizado con éxito', 'success');
          this.saved.emit();
          return;
        }

        forkJoin(resultadosOperaciones.length ? resultadosOperaciones : [of(null)]).subscribe({
          next: () => {
            this.loading = false;
            this.notificacionService.mostrar('Estudiante y resultados actualizados con éxito', 'success');
            this.saved.emit();
          },
          error: (err: any) => {
            this.loading = false;
            console.error('Error al guardar resultados', err);
            this.notificacionService.mostrar('Datos del estudiante actualizados, pero hubo errores con los resultados', 'warning');
            this.saved.emit();
          }
        });
      },
      error: (err: any) => {
        console.error('Error al guardar estudiante', err);
        this.loading = false;
        this.notificacionService.mostrar('Hubo un problema al guardar el estudiante', 'error');
      }
    });
  }
}
