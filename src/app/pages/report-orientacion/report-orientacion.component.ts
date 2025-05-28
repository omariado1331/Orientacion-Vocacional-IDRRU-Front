import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultadoService } from '../../services/resultado.service';
import { ResultadoDtoResponse } from '../../interfaces/resultado-dto-response';

import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-report-orientacion',
  templateUrl: './report-orientacion.component.html',
  styleUrls: ['./report-orientacion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule]
})
export class ReportOrientacionComponent implements OnInit {

  resultados: ResultadoDtoResponse[] = [];

  idProvincia?: number;
  idMunicipio?: number;
  year?: string;

  isBrowser: boolean = false;  // <-- para controlar renderizado en navegador

  constructor(
    private resultadoService: ResultadoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.cargarResultados();
    }
  }

  cargarResultados(): void {
    this.resultadoService.busquedaProvincia(this.idProvincia, this.idMunicipio, this.year)
      .subscribe({
        next: (data: ResultadoDtoResponse[]) => {
          this.resultados = data;
          if (this.idProvincia != null && this.idMunicipio != null && this.year) {
            this.generarGrafico();
          } else {
            this.mostrarGrafico = false;
          }
        },
        error: (err) => console.error('Error al cargar resultados:', err)
      });
  }

  limpiarFiltros(): void {
    this.idProvincia = undefined;
    this.idMunicipio = undefined;
    this.year = undefined;
    this.cargarResultados(); // vuelve a cargar la tabla completa sin filtros
  }

  mostrarGrafico: boolean = false;

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
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const data = context.chart.data.datasets[0].data;
            const total = data.reduce((acc: number, val: number) => acc + val, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percent}%)`;
          }
        }
      }
    }
  };

private generarGrafico(): void {
  const conteo: { [codigo: string]: number } = {};

  for (const item of this.resultados) {
    conteo[item.chaside] = (conteo[item.chaside] || 0) + item.cantidadEstudiantes;
  }

  const labels = Object.keys(conteo);
  const data = Object.values(conteo);

  // Actualizar chartData clonando el objeto para disparar el cambio
  this.chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: [
          '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
          '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
        ]
      }
    ]
  };

  this.mostrarGrafico = true;
}
}