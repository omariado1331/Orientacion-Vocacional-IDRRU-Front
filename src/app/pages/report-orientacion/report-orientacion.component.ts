import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultadoService } from '../../services/resultado.service';
import { ResultadoDtoResponse } from '../../interfaces/resultado-dto-response';
import { NgChartsModule } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import { ProvinciaService } from '../../services/provincia.service';
import { MunicipioService } from '../../services/municipio.service';
import { Provincia } from '../../interfaces/provincia-interface';
import { Municipio } from '../../interfaces/municipio-interface';
import { DatePipe } from '@angular/common';
Chart.register(...registerables);
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-report-orientacion',
  templateUrl: './report-orientacion.component.html',
  styleUrls: ['./report-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  providers: [DatePipe]
})

export class ReportOrientacionComponent implements OnInit {

  resultados: ResultadoDtoResponse[] = [];
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  listaAnios: string[] = []; 

  idProvincia?: number;
  idMunicipio?: number;
  fechaInicio?: string;
  fechaFin?: string;

  nombreProvinciaSeleccionada: string = '---';
  nombreMunicipioSeleccionado: string = '---';

  isBrowser: boolean = false;
  mostrarGrafico: boolean = false;
  mostrarBotonesExportar: boolean = false;
  mostrarTabla: boolean = false;
  mostrarImagenNoResultados: boolean = true;
  porcentajes: { codigo: string; cantidad: number; porcentaje: string }[] = [];
  leyenda: { label: string, desc: string, color: string }[] = [];
  // Leyenda original, no cambia
  nombresPorLabel: { [label: string]: string[] } = {
    'TABLA 1C': ['Ciencias Económicas', 'Ciencias Financieras'],
    'TABLA 2H': ['Humanísticas', 'Ciencias Jurídicas', 'Ciencias Sociales'],
    'TABLA 3A': ['Artes', 'Arquitectura', 'Diseño'],
    'TABLA 4S': ['Salud', 'Enfermería', 'Medicina'],
    'TABLA 5I': ['Investigación', 'Ingeniería', 'Tecnología'],
    'TABLA 6D': ['Defensa', 'Seguridad'],
    'TABLA 7E': ['Exactas', 'Ciencias Puras']
  };

  descripcionesFijas: { [key: string]: string } = {
    'TABLA 1C': 'Administrativas, Contables, Económicas',
    'TABLA 2H': 'Humanísticas, Ciencias Jurídicas, Sociales',
    'TABLA 3A': 'Artísticasasd',
    'TABLA 4S': 'Ciencias de la Salud',
    'TABLA 5I': 'Ingenierías, Técnicas, Computación',
    'TABLA 6D': 'Defensa, Seguridad',
    'TABLA 7E': 'Ciencias Agrarias, Zoológicas, Biológicas'
  };


  // Aquí vamos a mantener una copia actualizada para que Angular detecte cambios
  nombresPorLabelActualizada: { [label: string]: string[] } = {};

  chartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
          '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
        ]
      }
    ]
  };
  // opciones para mostrar el grafico (personalizar)
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const data = context.chart.data.datasets[0].data;
            const total = data.reduce((acc: number, val: number) => acc + val, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return `${value} (${percent}%)`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        formatter: (value: number, context: any) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((acc: number, val: number) => acc + val, 0);
          const percent = ((value / total) * 100).toFixed(1);
          return `${context.chart.data.labels[context.dataIndex]}\n${percent}%`;
        },
        font: {
          weight: 'bold' as const,
          size: 15
        },
        align: 'center' as const,
        anchor: 'center' as const,
      }
    }
  };

constructor(
  private resultadoService: ResultadoService,
  private provinciaService: ProvinciaService,
  private municipioService: MunicipioService,
  private datePipe: DatePipe,
  @Inject(PLATFORM_ID) private platformId: Object,
  private cd: ChangeDetectorRef
) {}  

ngOnInit(): void {
  this.isBrowser = isPlatformBrowser(this.platformId);
  if (this.isBrowser) {
    this.cargarProvincias();
    // No llamar a cargarResultados() acá
    // this.cargarResultados();
  }
}

cargarProvincias() {
    this.provinciaService.getProvinciasAll().subscribe({
      next: (data) => this.provincias = data,
      error: (err) => console.error('Error cargando provincias', err)
    });
  }

cargarAniosDisponibles(): void {
  this.resultadoService.obtenerAniosDisponibles(this.idProvincia, this.idMunicipio)
    .subscribe({
      next: (años: string[]) => {
        this.listaAnios = años.sort((a, b) => parseInt(b) - parseInt(a)); // orden descendente
      },
      error: (err) => {
        console.error('Error al cargar años disponibles:', err);
        this.listaAnios = [];
      }
    });
}


onProvinciaChange(): void {
  if (this.idProvincia != null) {

    // Buscá la provincia por id para obtener el nombre
    const provincia = this.provincias.find(p => p.id === this.idProvincia);
    this.nombreProvinciaSeleccionada = provincia ? provincia.nombre : '---';

    this.municipioService.getMunicipiosPorProvinciaList(this.idProvincia).subscribe(muns => {
      //console.log('Municipios recibidos:', muns); // Aquí deberías ver el array con municipios
      this.municipios = muns;
      this.idMunicipio = undefined;

      this.cargarAniosDisponibles();
    });
  } else {
    this.municipios = [];
    this.idMunicipio = undefined;
  }
}

onMunicipioChange(): void {
  console.log('ID Municipio seleccionado:', this.idMunicipio);
  console.log('Lista municipios:', this.municipios);
  if (this.idMunicipio != null) {

    const municipio = this.municipios.find(m => m.idMunicipio === this.idMunicipio);
    this.nombreMunicipioSeleccionado = municipio ? municipio.nombre : '---';
  } else {
    this.nombreMunicipioSeleccionado = '---';
  }

  // Recarga años con filtro provincia + municipio
  this.cargarAniosDisponibles();
}

cargarResultados(validarFiltros: boolean = true): void {
  // Validación simple para rango de años
  if ((this.fechaInicio && !this.fechaFin) || (!this.fechaInicio && this.fechaFin)) {
    alert('Debes seleccionar año inicio y año fin para filtrar por rango.');
    return;
  }
  if (this.fechaInicio && this.fechaFin && this.fechaInicio > this.fechaFin) {
    alert('El año inicio no puede ser mayor que el año fin.');
    return;
  }



  this.resultadoService.busquedaProvincia(this.idProvincia, this.idMunicipio, this.fechaInicio, this.fechaFin)
    .subscribe({
      next: (data: ResultadoDtoResponse[]) => {
        this.resultados = data;

        // Validar si al menos uno de los filtros está aplicado (no nulo o vacío)
        const filtrosAplicados = 
          (this.idProvincia !== null && this.idProvincia !== undefined) &&
          (this.idMunicipio !== null && this.idMunicipio !== undefined) &&
          (!!this.fechaInicio && this.fechaInicio.trim() !== '') &&
          (!!this.fechaFin && this.fechaFin.trim() !== '');

        if(!filtrosAplicados){
          // Si no hay filtros, limpiar todo y ocultar todo.
          this.resultados = [];
          this.mostrarBotonesExportar = false;
          this.mostrarGrafico = false;
          // mostrar imagen "no resultados" o dejar en false si no querés nada
          this.mostrarImagenNoResultados = true;
          return; // salir antes de hacer la petición

        }

        // Mostrar botones exportar sólo si filtros están aplicados y hay resultados
        this.mostrarBotonesExportar = validarFiltros && filtrosAplicados && data.length > 0;

        // Mostrar tabla o imagen según si hay resultados
        if (data.length > 0) {
          this.mostrarImagenNoResultados = false;  // ocultar imagen si hay resultados
          this.mostrarGrafico = true;               // mostrar gráfico si quieres
          if(this.mostrarBotonesExportar) this.generarGrafico();
        } else {
          this.mostrarImagenNoResultados = true;   // mostrar imagen si no hay resultados
          this.mostrarGrafico = false;
          this.mostrarBotonesExportar = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar resultados:', err);
        this.resultados = [];
        this.mostrarBotonesExportar = false;
        this.mostrarGrafico = false;
        this.mostrarImagenNoResultados = true;  // mostrar imagen en caso de error
      }
    });
}

limpiarFiltros(): void {
  this.idProvincia = undefined;
  this.idMunicipio = undefined;
  this.fechaInicio = undefined;
  this.nombreProvinciaSeleccionada = '';
  this.nombreMunicipioSeleccionado = '';

  // Vaciar o resetear las listas de municipios y años
  this.municipios = [];
  this.listaAnios = [];
  this.resultados = [];
  this.mostrarGrafico = false;
  this.mostrarBotonesExportar = false;
  this.mostrarImagenNoResultados = true;  // mostrar imagen al limpiar
  // No llamar a cargarResultados para no recargar la tabla

}

private generarGrafico(): void {
  const conteo: { [codigo: string]: number } = {};
  for (const item of this.resultados) {
    conteo[item.chaside] = (conteo[item.chaside] || 0) + item.cantidadEstudiantes;
  }
  const total = Object.values(conteo).reduce((a, b) => a + b, 0);
  this.porcentajes = Object.entries(conteo).map(([codigo, cantidad]) => {
    return {
      //codigo,
      cantidad,
      codigo,
      porcentaje: ((cantidad / total) * 100).toFixed(2)
    };
  });
    // Definimos etiquetas y datos para el gráfico (reemplazamos objeto completo para detectar cambios)
  const labels = Object.keys(conteo);
  const data = Object.values(conteo);

  this.chartData = {
    labels: Object.keys(conteo),  // labels dinámicos, no fijos
    datasets: [
      {
        data: Object.values(conteo),
        backgroundColor: [
          '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
          '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
        ]
      }
    ],

  };

  // Actualizar la leyenda personalizada con un nuevo objeto para que Angular refresque la vista
  this.nombresPorLabelActualizada = { ...this.nombresPorLabel };
  this.mostrarGrafico = true;
  this.leyenda = this.chartData.labels.map((label, index) => {
    const descripcion = this.descripcionesFijas[label.trim()] || 'Sin descripción';
    return {
      label,
      desc: descripcion,
      color: this.chartData.datasets[0].backgroundColor[index]
    };
  });
    // Forzamos la detección de cambios para actualizar el DOM
    this.cd.detectChanges();
}

private async dibujarCabecera(doc: jsPDF, pageWidth: number, margin: number, dezplazamiento: number): Promise<number> {
  const colorTitulo: [number, number, number] = [0, 54, 107];
  const colorTexto: [number, number, number] = [0, 54, 107];
  const logoWidth = 50; // Ancho del logo
  const logoHeight = 50; // Alto del logo

  let yPos = margin + 25;
  const anchoPagina = doc.internal.pageSize.getWidth(); 

  // 1. Cambiar rutas (usar assets/ en lugar de src/assets/)
  const logoIzquierdoUrl = "assets/umsac.png"; // Ruta corregida
  const logoDerechoUrl = "assets/idrdu.png";

  // 2. Convertir imágenes a Base64 antes de usarlas
  const [logoIzqBase64, logoDerBase64] = await Promise.all([
    this.convertirImagenABase64(logoIzquierdoUrl),
    this.convertirImagenABase64(logoDerechoUrl)
  ]);

    // variables
    const textoUmsa = 'UNIVERSIDAD MAYOR DE SAN ANDRÉS';
    const textoVicerrectorado = 'VICERRECTORADO'
    const textoInstituto = 'INSTITUTO DE DESARROLLO REGIONAL Y DESCONCENTRACIÓN UNIVERSITARIA'
    const tituloPdf = 'Reporte de Resultados del Test'

  // 3. Usar las imágenes convertidas
  doc.addImage(logoIzqBase64, 'PNG', margin + dezplazamiento - 5, yPos - 10, logoWidth, logoHeight);
  doc.addImage(logoDerBase64, 'PNG', pageWidth - margin - logoWidth - dezplazamiento, yPos - 10, logoWidth, logoHeight);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorTitulo);
  doc.text(textoUmsa, pageWidth / 2, yPos, { align: 'center' });
  yPos += 14;

  doc.setFontSize(10);
  doc.setTextColor(...colorTexto);
  doc.text(textoVicerrectorado, pageWidth / 2, yPos, { align: 'center' });
  yPos += 14;

  
  const anchoTexto =  doc.getTextWidth(textoInstituto) + 8;
  const centroPagina = pageWidth/2;
  const inicioLinea = centroPagina - (anchoTexto/2)
  const finLinea = centroPagina  + (anchoTexto/2);
  doc.setDrawColor(...colorTitulo)
  doc.setLineWidth(0.8)
  doc.line(inicioLinea, yPos - 10, finLinea, yPos - 10)
  doc.line(inicioLinea, (yPos - 10) + 2.75, finLinea, (yPos - 10) + 2.75)
  yPos += 4;
  
  doc.setFontSize(10);  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colorTexto);
  doc.text(textoInstituto, centroPagina, yPos, { align: 'center' });
  yPos += 30;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(tituloPdf, pageWidth / 2, yPos, { align: 'center' });

  return yPos;
}

private async dibujarPiePagina(doc: jsPDF) {
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
  doc.text(textoLinea1, anchoPagina / 2, altoPagina - 30, { align: 'center' });
  doc.text(textoLinea2, anchoPagina / 2, altoPagina - 20, { align: 'center' });
}

// Añade este nuevo método en tu clase
private async convertirImagenABase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

//PDF
async generarPDFconGraficoYTabla() {
  //debuggear
  //console.log('Municipio seleccionado:', this.nombreMunicipioSeleccionado);

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin1 = 10;  // declara e inicializa primero
  const dezplazamiento = 25;
  //let yPos 
  await this.dibujarCabecera(doc, pageWidth, margin1, dezplazamiento);


  // Título centrado
  //const titulo = 'REPORTE DEL TEST VOCACIONAL';
 // doc.setFontSize(18);
 // doc.setFont('helvetica', 'bold');
  //const tituloWidth = doc.getTextWidth(titulo);
  const tituloY = 80;
  //doc.text(titulo, (pageWidth - tituloWidth) / 2, tituloY);

  // Filtros uno debajo de otro
  const marginLeft = 40;
  const filtroY = tituloY + 45;
  const lineHeight = 20;

  //(arreglo de objetos):
  const filtros: {titulo: string, valor: string}[] = [];

  function capitalizar(texto: string): string {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  if(this.nombreProvinciaSeleccionada && this.nombreProvinciaSeleccionada !== 'Todos'){
    filtros.push({titulo: 'Provincia:', valor: capitalizar(this.nombreProvinciaSeleccionada)});
  }

  if(this.nombreMunicipioSeleccionado && this.nombreMunicipioSeleccionado !== 'Todos'){
    filtros.push({titulo: 'Municipio:', valor: capitalizar(this.nombreMunicipioSeleccionado)});
  }

  // pdf el filtro de las fechas
  if(this.fechaInicio){
    let valorAnio = this.fechaInicio;
    if(this.fechaInicio && this.fechaFin !== this.fechaInicio)
    {
      valorAnio = `${this.fechaInicio} - ${this.fechaFin}`
    }
    filtros.push({titulo: 'Año:', valor: valorAnio});
  }

  /*
  const filtros = [
    `Provincia: ${this.nombreProvinciaSeleccionada}`,
    `Municipio: ${this.nombreMunicipioSeleccionado}`,
    `Año: ${this.year || '---'}`
    
  ];*/
  // tamaño titulo de los nombres 
  doc.setFontSize(12);
  filtros.forEach((filtro, i) => {
    
    const y = filtroY + i * lineHeight;
    // Este son los titulos
    doc.setFont('helvetica', 'bold');
    doc.text(filtro.titulo, marginLeft, y);

    // Este para provincia y municipio
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(filtro.valor, marginLeft + doc.getTextWidth(filtro.titulo) + 25, y);

    // Este es para el resto, es decir el año
    doc.setFontSize(12);
    
  });

  // justo debajo de filtros espacio botton
  const startYTable = filtroY + 58; 

  // TABLA DE RESULTADOS
  // Tabla centrada y angosta
  const columns = ['Chaside', 'Respuestas Test', 'Porcentaje Total'];

  //Suma el total de estudintes
  // resultados es un arrays
  //.reduce() es como un for que acumula el 0 es valor inicial
  // Acumulador acc + r.cantidadEstudiantes
  const totalEstudiantes = this.resultados.reduce((acc, r) => acc + r.cantidadEstudiantes, 0);

  // MAP Sirve para recorrer un array y transformar cada elemento, devolviendo un nuevo array con los resultados.
  // this.resultados es
  /*
    [
      { chaside: 'TABLA 1C', cantidadEstudiantes: 10 },
      { chaside: 'TABLA 2H', cantidadEstudiantes: 5 }
    ]
  */

  const rows = this.resultados.map(r => [
    // tabla 1C
    r.chaside,
    // cantidad que ya se calcula de consulta del backend
    r.cantidadEstudiantes,
    // toFixed(2) lo limita a 2 decimales.
    // muestra % si fuera cero evitando division por 0, se muestra 0%
    totalEstudiantes > 0 ? ((r.cantidadEstudiantes / totalEstudiantes) * 100).toFixed(2) + '%' : '0%'
  ]);

  const margin = 20;
  const colCount = columns.length;
  const tableWidth = (pageWidth - 2 * marginLeft);
  const colWidth = tableWidth / colCount;

  // Aquí va el autoTable con los parámetros actualizados
  (doc as any).autoTable({
    startY: startYTable,
    // Centrar la pagina
    margin: { left: marginLeft  },
    //Define el encabezado de las columnas
    head: [columns],
    //Datos de la tabla
    body: rows,
    //Define el ancho de las columnas
    columnStyles: {
      0: { cellWidth: colWidth },
      1: { cellWidth: colWidth },
      2: { cellWidth: colWidth },
    },
    //Estilo
    //Define el ancho de cada columna 
    styles: { fontSize: 9, cellPadding: 5, halign: 'center' },
    //Estilo general fuente, espaciado, alinear horizontalmente
    headStyles: { fillColor: [78, 121, 167], textColor: 255 },
    // filas con rayas
    theme: 'striped',
  });

  // Leyenda con colores a la izquierda con espacio
  const leyendaStartY = (doc as any).autoTable.previous.finalY + 30;
  const leyendaX = marginLeft;
  const colorBoxSize = 14;
  const spacingY = 18;

  // Si se cambia aqui, se cambia del PDF
  const descripcionesFijas: {[key: string]: string} = {
    'TABLA 1C': ' Ciencias Económicas, Ciencias Financieras',
    'TABLA 2H': ' Humanidades, Ciencias Jurídicas, Ciencias Sociales',
    'TABLA 3A': ' Artes, Arquitectura, Diseño',
    'TABLA 4S': ' Salud, Enfermería, Medicina',
    'TABLA 5I': '  Investigación, Ingeniería, Tecnología',
    'TABLA 6D': ' Defensa, Seguridad',
    'TABLA 7E': ' Ciencias Exactas, Ciencias Puras, Biológicas'
  };

  const colores = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
  ];


  const leyenda = this.chartData.labels.map((label, index) => {
    return {
      label,
      desc: descripcionesFijas[label] || 'Sin descripción',
      color: colores[index] || '#000000'
    };
  });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESULTADOS:', leyendaX, leyendaStartY);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  leyenda.forEach((item, i) => {
    const y = leyendaStartY + 8 + (i + 1) * spacingY;

    doc.setFillColor(item.color);
    doc.rect(leyendaX, y - 12, colorBoxSize, colorBoxSize, 'F');

    doc.text(`${item.label}: ${item.desc}`, leyendaX + colorBoxSize + 8, y);
  });

  // Gráfico centrado y con espacio arriba
  const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
  if (canvas) {
    const imgData = canvas.toDataURL('image/png');
    const imgProps = doc.getImageProperties(imgData);

    const maxImgWidth = 230;
    const imgHeight = (imgProps.height * maxImgWidth) / imgProps.width;
    const imgX = (pageWidth - maxImgWidth) / 2;

    const lastLeyendaY = leyendaStartY + 12 + leyenda.length * spacingY;
    let imgY = lastLeyendaY + 12;

    if (imgY + imgHeight > pageHeight - 20) {
      imgY = pageHeight - imgHeight - 20;
    }
    
    doc.addImage(imgData, 'PNG', imgX, imgY, maxImgWidth, imgHeight);
  } else {
    console.warn('No se encontró el canvas del gráfico');
  }
  await this.dibujarPiePagina(doc);

  doc.save('reporte-del-test-vocacional.pdf');
}

}