import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultadoService } from '../../services/resultado.service';
import { ResultadoDtoResponse } from '../../interfaces/resultado-dto-response';
import { NgChartsModule } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
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
  imports: [CommonModule, FormsModule, NgChartsModule]
})
export class ReportOrientacionComponent implements OnInit {

  resultados: ResultadoDtoResponse[] = [];
  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  listaAnios: string[] = []; 

  idProvincia?: number;
  idMunicipio?: number;
  year?: string;

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
    'TABLA 2H': ['Humanísticas', 'Ciencias Jurídicas','Ciencias Sociales'],
    'TABLA 3A': ['Artes','Arquitectura ','Diseño'],
    'TABLA 4S': ['Salud','Enfermería','Medicina'],
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
          return `${percent}%\n${context.chart.data.labels[context.dataIndex]}`;
        },
        font: {
          weight: 'bold' as const,
          size: 14
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
  this.resultadoService.busquedaProvincia(this.idProvincia, this.idMunicipio)
    .subscribe((resultados) => {
      const añosUnicos = Array.from(new Set(resultados.map(r => r.fecha)));
      this.listaAnios = añosUnicos;
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
  this.resultadoService.busquedaProvincia(this.idProvincia, this.idMunicipio, this.year)
    .subscribe({
      next: (data: ResultadoDtoResponse[]) => {
        this.resultados = data;

        // Validar si al menos uno de los filtros está aplicado (no nulo o vacío)
        const filtrosAplicados = 
          (this.idProvincia !== null && this.idProvincia !== undefined) ||
          (this.idMunicipio !== null && this.idMunicipio !== undefined) ||
          (!!this.year && this.year.trim() !== '');


        if(!filtrosAplicados){
          // Si no hay filtros, limpiar todo y ocultar todo.
          this.resultados = [];
          this.mostrarBotonesExportar;
          this.mostrarGrafico;
          // mostrar imagen "no resultados" o dejar en false si no querés nada
          this.mostrarImagenNoResultados;
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
  this.year = undefined;

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
      codigo,
      cantidad,
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
    ]
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


private async dibujarCabecera(doc: jsPDF, pageWidth: number, margin: number): Promise<number> {
  const colorAzulUMSA: [number, number, number] = [0, 51, 153];
  const colorVinoUMSA: [number, number, number] = [128, 0, 32];
  const logoWidth = 70; // Ancho del logo
  const logoHeight = 70; // Alto del logo

  let yPos = margin + 25;

  // 1. Cambiar rutas (usar assets/ en lugar de src/assets/)
  const logoIzquierdoUrl = "assets/umsac.png"; // Ruta corregida
  const logoDerechoUrl = "assets/idrdu.png";

  // 2. Convertir imágenes a Base64 antes de usarlas
  const [logoIzqBase64, logoDerBase64] = await Promise.all([
    this.convertirImagenABase64(logoIzquierdoUrl),
    this.convertirImagenABase64(logoDerechoUrl)
  ]);



  // 3. Usar las imágenes convertidas
  doc.addImage(logoIzqBase64, 'PNG', margin, yPos - 10, logoWidth, logoHeight);
  doc.addImage(logoDerBase64, 'PNG', pageWidth - margin - logoWidth, yPos - 10, logoWidth, logoHeight);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colorAzulUMSA);
  doc.text('UNIVERSIDAD MAYOR DE SAN ANDRÉS', pageWidth / 2, yPos, { align: 'center' });
  yPos += 16;

  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text('INSTITUTO DE DESARROLLO REGIONAL Y DESCONCENTRACIÓN UNIVERSITARIA', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(10);
  doc.setTextColor(...colorVinoUMSA);
  doc.text('SISTEMA DE ORIENTACIÓN VOCACIONAL', pageWidth / 2, yPos, { align: 'center' });
  yPos += 25;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Reporte de Resultados', pageWidth / 2, yPos, { align: 'center' });
  yPos += 14;

  return yPos;
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

  let yPos = await this.dibujarCabecera(doc, pageWidth, margin1);


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

  if(this.year){
    filtros.push({titulo: 'Año:', valor: this.year});
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
  const columns = ['Código', 'Cantidad Estudiantes', 'Porcentaje'];

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



  const colCount = columns.length;
  const tableWidth = 520;
  const colWidth = tableWidth / colCount;

  // Aquí va el autoTable con los parámetros actualizados
  (doc as any).autoTable({
  startY: startYTable,
  // Centrar la pagina
  margin: { left: (pageWidth - tableWidth) / 2 },
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
  styles: { fontSize: 10, cellPadding: 6, halign: 'center' },
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

  //PDF 
const descripcionesFijas: {[key: string]: string} = {
  'TABLA 1C': 'Ciencias Económicas, Ciencias Financieras',
  'TABLA 2H': 'Humanidades, Ciencias Jurídicas, Ciencias Sociales',
  'TABLA 3A': 'Artes, Arquitectura ,Diseño',
  'TABLA 4S': 'Salud, Enfermería, Medicina',
  'TABLA 5I': 'Investigación, Ingeniería, Tecnología',
  'TABLA 6D': 'Defensa, Seguridad',
  'TABLA 7E': 'Ciencias Exactas, Ciencias Puras, Biológicas'
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

  const margin = 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const footerY = pageHeight - 40;
  doc.text('UMSA: Teléfono: (591-2) 2612298 | E-mail: informate@umsa.bo', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Av. Villazón N° 1995, Plaza del Bicentenario - Zona Central, La Paz, Bolivia', pageWidth / 2, footerY + 20, { align: 'center' });
  doc.text('IDRDU: Av. 6 de Agosto, Edificio HOY Nro. 2170 Piso 12', pageWidth / 2, footerY + 10, { align: 'center' });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
  }



  doc.save('reporte-con-grafico.pdf');



}



}