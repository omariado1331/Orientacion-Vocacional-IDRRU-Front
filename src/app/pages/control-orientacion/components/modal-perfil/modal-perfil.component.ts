import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Estudiante } from '../../../../interfaces/estudiante-interface';
import { ResultadoDto } from '../../../../interfaces/resultado-interface';
import { NotificacionService } from '../../../../services/notificacion.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Municipio } from '../../../../interfaces/municipio-interface';
import { Provincia } from '../../../../interfaces/provincia-interface';
import { Facultad } from '../../../../services/facultad.service';

@Component({
  selector: 'app-modal-perfil',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe, NotificacionService],
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.css']
})
export class ModalPerfilComponent {
  @Input() visible: boolean = false;
  @Input() estudiante: Estudiante | null = null;
  @Input() resultados: ResultadoDto[] = [];
  @Input() logoUrl: string = 'assets/escudo.png';
  @Input() logoUrlc: string = 'assets/umsac.png';
  @Input() logoIDRU: string = 'assets/idrdu.png';
  @Input() colegios: any[] = [];
  @Input() municipios: Municipio[] = [];
  @Input() provincias: Provincia[] = [];
  @Input() todasLasFacultades: Facultad[] = [];

  @Output() close = new EventEmitter<void>();

  exportando = false;

  constructor(
    private datePipe: DatePipe,
    private notificacionService: NotificacionService
  ) {}

  cerrarModal(): void {
    this.close.emit();
  }

  getColegioNombre(idColegio: number | null): string {
    if (idColegio === null) return 'Desconocido';
    const colegio = this.colegios.find(c => c.idColegio === idColegio);
    return colegio ? colegio.nombre : 'Desconocido';
  }

  getChasideDescription(resultado: ResultadoDto): string {
    return (resultado as any).chaside?.descripcion || 'No disponible';
  }

  cargarImagen(url: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || img.naturalWidth;
        canvas.height = img.height || img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(null);
        }
      };
      img.onerror = () => {
        console.warn(`Error al cargar la imagen: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  }

  getChasideCode(resultado: ResultadoDto): string {
    const code = (resultado as any).chaside?.codigo;
    return code ? code.slice(-1) : '?';
  }

  getHollandName(resultado: ResultadoDto): string {
    return (resultado as any).holland?.nombre || 'No disponible';
  }

  getHollandDescription(resultado: ResultadoDto): string {
    return (resultado as any).holland?.descripcion || 'No disponible';
  }


  async exportarPerfilPDF(): Promise<void> {
    const doc = new jsPDF('portrait', 'mm', 'letter');
    const colorAzulUMSA: [number, number, number] = [0, 51, 153];
    const colorVinoUMSA: [number, number, number] = [128, 0, 32];
    const colorAzulClaro: [number, number, number] = [235, 245, 255];
    const colorGrisClaro: [number, number, number] = [240, 240, 240];
    const colorVerdeClaro: [number, number, number] = [230, 255, 230];
    const margenIzquierdo = 15;
    const margenDerecho = 15;
    const anchoUtil = doc.internal.pageSize.width - margenIzquierdo - margenDerecho;
    const estudiante = this.estudiante;
    if (!estudiante) {
      this.notificacionService.mostrar('No hay estudiante seleccionado', 'warning');
      return;
    }
    if (!this.resultados || this.resultados.length === 0) {
      this.notificacionService.mostrar('No hay resultados disponibles para exportar', 'warning');
      return;
    }
    /*=================================================
    * Encabezado, marca de agua y pie de pagina del PDF
    =================================================*/
    let y = 15;
    const logoUmsaColor = 'assets/umsac.png';
    const logoIDRUColor = 'assets/idrdu.png';
    const logoUMSA = await this.cargarImagen(logoUmsaColor);
    const logoIDRDU = await this.cargarImagen(logoIDRUColor);
    const agregarEncabezado = (logoUMSA: string | null, logoIDRDU: string | null) => {
      // === ===
      const anchoPagina = doc.internal.pageSize.getWidth();
      const margen = 10;
      const anchoLogo = 16;
      const altoLogo = 16;

      // === Estilos ===
      const fuenteNormal = 'helvetica';
      const fuenteNegrita = 'helvetica';
      const estiloNormal = 'normal';
      const estiloNegrita = 'bold';

      const tamTitulo = 10;
      const tamSubtitulo = 10;
      const colorTitulo: [number, number, number] = [0, 54, 107];
      const colorTexto: [number, number, number] = [0, 54, 107];

      // === Textos ===
      const textoUMSA = 'UNIVERSIDAD MAYOR DE SAN ANDRÉS';
      const textoVicerrectorado = 'VICERRECTORADO';
      const textoInstituto = 'INSTITUTO DE DESARROLLO REGIONAL Y DESCONCENTRACIÓN UNIVERSITARIA';

      // === posicionamiento ===
      y = margen + 5;

      // === logos ===
      if (logoUMSA) doc.addImage(logoUMSA, 'PNG', margen, margen, anchoLogo, altoLogo);
      if (logoIDRDU) doc.addImage(logoIDRDU, 'PNG', anchoPagina - margen - anchoLogo - 5, margen, anchoLogo, altoLogo);

      // === umsa ===
      doc.setFont(fuenteNormal, estiloNormal);
      doc.setFontSize(tamTitulo);
      doc.setTextColor(...colorTitulo);
      doc.text(textoUMSA, anchoPagina / 2, y, { align: 'center' });

      // === vicerectorado ===
      y += 4;
      doc.setFontSize(tamSubtitulo);
      doc.setTextColor(...colorTexto);
      doc.text(textoVicerrectorado, anchoPagina / 2, y, { align: 'center' });

      // === Lineas ===
      y += 1;
      const anchoTexto = doc.getTextWidth(textoInstituto) + 3;
      const inicioLinea = (anchoPagina - anchoTexto) / 2;
      const finLinea = inicioLinea + anchoTexto;
      doc.setDrawColor(...colorTitulo)
      doc.setLineWidth(0.3);
      doc.line(inicioLinea, y, finLinea, y);
      doc.line(inicioLinea, y + 0.75, finLinea, y + 0.75);

      // === instituto ===
      y += 4.5;
      doc.setFont(fuenteNegrita, estiloNegrita);
      doc.setTextColor(...colorTexto);
      doc.text(textoInstituto, anchoPagina / 2, y, { align: 'center' });

      y += 10;
    };
    const agregarPiePagina = () => {
      // === tamano pagina ===
      const anchoPagina = doc.internal.pageSize.getWidth();
      const altoPagina = doc.internal.pageSize.getHeight();

      // ===estilo ===
      const fuente = 'helvetica';
      const estilo = 'normal';
      const tamañoFuente = 8;
      const colorTexto: [number, number, number] = [0, 54, 107];

      // === texto ===
      const textoLinea1 = 'Av. 6 de Agosto 2170 · Edificio Hoy Piso 12 · Teléfono - Fax (591) 2-2118556 · IP (591) 2-2612211';
      const textoLinea2 = 'e-mail: idrdu@umsa.bo · https://www.facebook.com/IDR.DU.UMSA';
      const fechaGeneracion = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

      // === estilos ===
      doc.setTextColor(...colorTexto);
      doc.setFont(fuente, estilo);
      doc.setFontSize(tamañoFuente);

      // === texto ===
      doc.text(textoLinea1, anchoPagina / 2, altoPagina - 12, { align: 'center' });
      doc.text(textoLinea2, anchoPagina / 2, altoPagina - 8, { align: 'center' });
    };
    const agregarMarcaDeAgua = async (logoIDRDU: string | null) => {
      if (!logoIDRDU) return;

      // === Dimensiones de la página ===
      const anchoPagina = doc.internal.pageSize.getWidth();
      const altoPagina = doc.internal.pageSize.getHeight();

      // === tamano de la marca de agua ===
      const anchoMarcaAgua = 100;
      const altoMarcaAgua = 100;

      // === centro ===
      const posX = (anchoPagina - anchoMarcaAgua) / 2;
      const posY = (altoPagina - altoMarcaAgua) / 2;

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            canvas.width = img.naturalWidth || 200;
            canvas.height = img.naturalHeight || 200;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 0.15;
            ctx.drawImage(img, 0, 0);

            resolve();
          };

          img.onerror = () => reject(new Error('Error al cargar imagen'));
          img.src = logoIDRDU;
        });
        const imagenConOpacidad = canvas.toDataURL('image/png');
        doc.addImage(imagenConOpacidad, 'PNG', posX, posY, anchoMarcaAgua, altoMarcaAgua);

      } catch (error) {
        console.warn('Error al crear marca de agua:', error);
        doc.addImage(logoIDRDU, 'PNG', posX, posY, anchoMarcaAgua * 0.8, altoMarcaAgua * 0.8);
      }
    };
    /*==================================
    * Encabezado y pie de pagina del PDF
    ====================================*/
    const crearTitulo = (texto: string, color: [number, number, number] = colorAzulUMSA): void => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.5);
      doc.line(margenIzquierdo, y, doc.internal.pageSize.width - margenDerecho, y);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...color);
      doc.text(texto, margenIzquierdo, y + 5);
      y += 8;
    };
    const obtenerDescripcionArea = (codigo: string): string => {
      const areas = {
        'C': 'Administrativas, Contables y Económicas',
        'H': 'Humanísticas y Sociales',
        'A': 'Artísticas',
        'S': 'Medicina y Cs. de la Salud',
        'I': 'Ingeniería y Computación',
        'D': 'Defensa y Seguridad',
        'E': 'Ciencias Exactas y Agrarias'
      };
      return areas[codigo[codigo.length - 1] as keyof typeof areas] || '';
    };
    const correspondeACodigoChaside = (facultad: Facultad, codigoChaside: string): boolean => {
      const mapeoCodigoANumero = {
        'C': 1, // Administrativas, Contables y Económicas
        'H': 2, // Humanísticas y Sociales
        'A': 3, // Artísticas
        'S': 4, // Medicina y Cs. de la Salud
        'I': 5, // Ingeniería y Computación
        'D': 6, // Defensa y Seguridad
        'E': 7  // Ciencias Exactas y Agrarias
      };
      return facultad.idChaside === mapeoCodigoANumero[codigoChaside[codigoChaside.length - 1] as keyof typeof mapeoCodigoANumero];
    };
    const obtenerDescripcionHolland = (codigo: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'): string => {
      const descripciones = {
        'R': 'Realista: Práctico, físico, concreto, orientado a la acción',
        'I': 'Investigador: Prefiere observar, aprender, investigar, analizar',
        'A': 'Artístico: Prefiere actividades creativas y expresivas',
        'S': 'Social: Prefiere trabajar con personas, ayudar y orientar',
        'E': 'Emprendedor: Prefiere liderar, persuadir y gestionar',
        'C': 'Convencional: Prefiere actividades ordenadas y sistemáticas'
      };
      return descripciones[codigo];
    };
    const procesarAreasCHASIDE = (chasideData: { codigo?: string } | null | undefined) => {
      if (!chasideData?.codigo) {
        return { intereses: [], aptitudes: [] };
      }
      const codigo = chasideData.codigo.toString().toUpperCase();
      if (codigo.includes('-')) {
        const partes = codigo.split('-');
        return {
          intereses: partes[0]?.split('') || [],
          aptitudes: partes[1]?.split('') || []
        };
      }
      return {
        intereses: [codigo],
        aptitudes: [codigo]
      };
    };
    const verificarEspacioDisponible = async (espacioNecesario: number): Promise<boolean> => {
      const espacioDisponible = doc.internal.pageSize.height - y - 20;
      if (espacioDisponible < espacioNecesario) {
        doc.addPage();
        y = 15;
        agregarEncabezado(logoUMSA, logoIDRDU);
        await agregarMarcaDeAgua(logoIDRDU);
        agregarPiePagina();
        return true;
      }
      else {

        return false;
      }
    };

    agregarEncabezado(logoUMSA, logoIDRDU);
    await agregarMarcaDeAgua(logoIDRDU);
    agregarPiePagina();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PERFIL DEL ESTUDIANTE', pageWidth / 2, y, { align: 'center' });
    y += 4;
    doc.setDrawColor(...colorAzulUMSA);
    doc.setFillColor(...colorAzulClaro);
    doc.setLineWidth(0.3);
    doc.roundedRect(margenIzquierdo, y, anchoUtil, 28, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('DATOS DEL ESTUDIANTE:', margenIzquierdo + 3, y + 5);
    doc.setFont('helvetica', 'normal');
    let lugar = 'Lugar no disponible';
    let municipio: Municipio | null = null;
    let provincia: Provincia | null = null;
    if (estudiante.idMunicipio) {
      municipio = this.municipios.find((m: Municipio) => m.idMunicipio === estudiante.idMunicipio) ?? null;
      if (municipio) {
        provincia = this.provincias.find((p: Provincia) => p.idProvincia === municipio!.idProvincia) ?? null;
      }
    }
    const nombreCompleto = `${estudiante.nombre} ${estudiante.apPaterno} ${estudiante.apMaterno || ''}`;
    doc.text(`Nombre: ${nombreCompleto}`, margenIzquierdo + 5, y + 10);
    doc.text(`C.I.: ${estudiante.ciEstudiante}`, margenIzquierdo + 5, y + 15);
    doc.text(`Edad: ${estudiante.edad} años`, margenIzquierdo + 5, y + 20);
    doc.text(`Provincia: ${provincia ? provincia.nombre : 'Desconocida'}`, margenIzquierdo + 5, y + 25);
    doc.text(`Colegio: ${this.getColegioNombre(estudiante.idColegio)}`, margenIzquierdo + anchoUtil / 2, y + 10);
    doc.text(`Celular: ${estudiante.celular || 'No especificado'}`, margenIzquierdo + anchoUtil / 2, y + 15);
    doc.text(`Curso: ${estudiante.curso}`, margenIzquierdo + anchoUtil / 2, y + 20);
    doc.text(`Municipio: ${municipio ? municipio.nombre : 'Desconocido'}`, margenIzquierdo + anchoUtil / 2, y + 25);
    y += 30;
    const todosChaside = this.resultados
      .filter((r: any) => r.chaside)
      .map((r: any, idx: number) => ({
        data: r.chaside,
        areas: procesarAreasCHASIDE(r.chaside),
        orden: idx + 1,
        fechaCreacion: r.fecha,
        idResultado: r.idResultado,
        puntajeInteres: r.interes,
        puntajeAptitud: r.aptitud
      }));
    const todosHolland = this.resultados
      .filter((r: any) => r.holland && r.puntajeHolland)
      .map((r: any, idx: number) => {
        const codigoHolland = r.puntajeHolland || 'N/A';
        return {
          data: r.holland,
          codigo: codigoHolland,
          orden: idx + 1,
          fechaCreacion: r.fecha
        };
      });
    const facultadesRecomendadas = new Map<number, { data: Facultad, coincidencias: number, codigosChaside: string[], fechaCreacion?: string }>();
    const todosChasideUnicos = new Set<string>();
    this.resultados
      .filter((r: any) => r.chaside && r.chaside.codigo)
      .forEach((resultado: any) => {
        if (!resultado.chaside) return;
        const codigoChaside = resultado.chaside.codigo;
        todosChasideUnicos.add(codigoChaside);
        if (this.todasLasFacultades) {
          this.todasLasFacultades
            .filter((facultad: Facultad) => correspondeACodigoChaside(facultad, codigoChaside))
            .forEach((facultad: Facultad) => {
              if (!facultadesRecomendadas.has(facultad.idFacultad)) {
                facultadesRecomendadas.set(facultad.idFacultad, {
                  data: facultad,
                  coincidencias: 1,
                  codigosChaside: [codigoChaside],
                  fechaCreacion: resultado.fecha
                });
              } else {
                const existing = facultadesRecomendadas.get(facultad.idFacultad);
                if (existing) {
                  if (!existing.codigosChaside.includes(codigoChaside)) {
                    existing.codigosChaside.push(codigoChaside);
                  }
                }
              }
            });
        }
      });
    const todasFacultades = Array.from(facultadesRecomendadas.values())
      .map((item, idx) => ({
        ...item,
        orden: idx + 1
      }));
    if (todosChaside.length > 0) {
      await verificarEspacioDisponible(70);
      crearTitulo('RESULTADOS TEST CHASIDE');
      doc.setFillColor(...colorGrisClaro);
      doc.rect(margenIzquierdo, y, anchoUtil, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('CÓDIGO', margenIzquierdo + 5, y + 6);
      doc.text('DESCRIPCIÓN', margenIzquierdo + 35, y + 6);
      doc.text('INTERES', margenIzquierdo + 120, y + 6);
      doc.text('APTITUD', margenIzquierdo + 140, y + 6);
      doc.text('FECHA', margenIzquierdo + 160, y + 6);
      y += 10;
      const resultadoFinal = todosChaside[todosChaside.length - 1];

      if (resultadoFinal && resultadoFinal.data) {
        doc.setFillColor(255, 255, 255);
        doc.rect(margenIzquierdo, y, anchoUtil, 8, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(resultadoFinal.data.codigo ? resultadoFinal.data.codigo[resultadoFinal.data.codigo.length - 1] : 'N/A', margenIzquierdo + 5, y + 5);
        doc.text(resultadoFinal.data.descripcion || 'N/A', margenIzquierdo + 35, y + 5);
        doc.text(resultadoFinal.puntajeInteres?.toString() || 'N/A', margenIzquierdo + 120, y + 5);
        doc.text(resultadoFinal.puntajeAptitud?.toString() || 'N/A', margenIzquierdo + 140, y + 5);
        const fechaStr = estudiante.createdAt
          ? this.datePipe.transform(new Date(estudiante.createdAt), 'dd/MM/yyyy')
          : 'No disponible';
        doc.text(fechaStr || 'N/A', margenIzquierdo + 160, y + 5);
        y += 15;
      }
    }
    if (todosHolland.length > 0) {
      await verificarEspacioDisponible(50);
      crearTitulo('RESULTADOS TEST HOLLAND');
      doc.setFillColor(...colorGrisClaro);
      doc.rect(margenIzquierdo, y, anchoUtil, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('CÓDIGO', margenIzquierdo + 5, y + 6);
      doc.text('TIPO', margenIzquierdo + 35, y + 6);
      doc.text('DESCRIPCIÓN', margenIzquierdo + 70, y + 6);
      doc.text('FECHA', margenIzquierdo + anchoUtil - 25, y + 6);

      y += 12;
      doc.setTextColor(0, 0, 0);

      todosHolland.forEach((holland: any, idx: number) => {
        const colorBase: [number, number, number] = idx % 2 === 0 ? [255, 255, 255] : [245, 245, 245];
        const fechaStr = estudiante.createdAt
          ? this.datePipe.transform(new Date(estudiante.createdAt), 'dd/MM/yyyy')
          : 'No disponible';
        doc.setFillColor(...colorBase);
        doc.rect(margenIzquierdo, y, anchoUtil, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text(holland.codigo, margenIzquierdo + 8, y + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(fechaStr || '', margenIzquierdo + anchoUtil - 25, y + 5);

        y += 8;
        doc.setTextColor(0, 0, 0);

        holland.codigo.split('').forEach((letra: string, letraIdx: number) => {
          if (['R', 'I', 'A', 'S', 'E', 'C'].includes(letra)) {
            const colorDetalle: [number, number, number] = letraIdx % 2 === 0
              ? [252, 252, 252]
              : [248, 248, 248];

            doc.setFillColor(...colorDetalle);
            doc.rect(margenIzquierdo + 10, y, anchoUtil - 10, 9, 'F');
            doc.setDrawColor(40, 100, 160);
            doc.setLineWidth(1);
            doc.line(margenIzquierdo + 10, y, margenIzquierdo + 10, y + 9);

            const descripcion = obtenerDescripcionHolland(letra as 'R' | 'I' | 'A' | 'S' | 'E' | 'C');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.text(letra, margenIzquierdo + 37, y + 6);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(50, 50, 50);
            doc.text(descripcion, margenIzquierdo + 60, y + 6, {
              maxWidth: anchoUtil - 70
            });

            y += 9;
          }
        });

        y += 8;

        if (idx < todosHolland.length - 1) {
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.2);
          doc.line(margenIzquierdo + 20, y - 4, margenIzquierdo + anchoUtil - 20, y - 4);
        }
      });
    }
    if (todasFacultades.length > 0) {
      await verificarEspacioDisponible(50);
      crearTitulo('RECOMENDACIONES ACADÉMICAS BASADO EN RESULTADOS', colorVinoUMSA);
      doc.setTextColor(0, 54, 107);
      for (const [idx, facultadItem] of todasFacultades.entries()) {
        await verificarEspacioDisponible(40);
        const facultad = facultadItem.data;
        const imgWidth = 15;
        const imgHeight = 15;
        const imgX = margenIzquierdo + 2;
        const imgY = y + 5;

        doc.addImage(facultad.imgLogo, 'PNG', imgX, imgY, imgWidth, imgHeight);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`${facultadItem.orden}. ${facultad.nombre}`, margenIzquierdo, y + 3);
        doc.setTextColor(0, 0, 0);
        y += 7;

        if (facultad.carreras && facultad.carreras.length > 0) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.text('Carreras disponibles:', margenIzquierdo + 22, y);
          y += 4;
          const columnasCarreras = 1;
          const anchoColumna = anchoUtil / columnasCarreras;
          let columnaActual = 0;
          for (const carrera of (facultad.carreras as string[]).slice(0, 10)) {
            const xPos = margenIzquierdo + 25 + (columnaActual * anchoColumna);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(`• ${carrera}`, xPos + 2, y);
            columnaActual++;
            if (columnaActual >= columnasCarreras) {
              columnaActual = 0;
              y += 4;
            }
          }
          if (columnaActual > 0) y += 8;
          y += 2;
        }
        if (facultad.carreras.length < 3) y += 4;
        if (facultad.url) {
          y += 2;
          doc.setFontSize(6);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 200);
          doc.text(`Más información: ${facultad.url}`, margenIzquierdo, y);
          doc.setTextColor(0, 0, 0);
        }
        y += 4;
      }
    } else {
      await verificarEspacioDisponible(30);
      crearTitulo('RECOMENDACIONES ACADÉMICAS', colorVinoUMSA);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Para obtener recomendaciones específicas de facultades y carreras,', margenIzquierdo, y);
      y += 5;
      doc.text('consulte con un orientador vocacional basándose en sus resultados CHASIDE y Holland.', margenIzquierdo, y);
      y += 10;
    }
    await verificarEspacioDisponible(30);
    crearTitulo('CONSIDERACIONES IMPORTANTES', colorVinoUMSA);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');

    const textoConsejos = [
      "• Este informe es una guía orientativa basada en tus respuestas a los tests vocacionales.",
      "• Investiga más sobre las carreras sugeridas, visitando facultades o hablando con profesionales.",
      "• Considera tus intereses personales, habilidades y el mercado laboral al tomar tu decisión.",
      "• Puedes solicitar una entrevista con un orientador profesional para profundizar en tus resultados.",
      "• Tu vocación puede evolucionar con el tiempo y las experiencias que vayas adquiriendo."
    ];
    textoConsejos.forEach((consejo, index) => {
      doc.text(consejo, margenIzquierdo, y);
      y += 3.5;
    });
    doc.save(`Perfil_Vocacional_${estudiante.nombre}_${estudiante.apPaterno}.pdf`);
    this.notificacionService.mostrar('Perfil exportado a PDF correctamente', 'success');
  }
}
