import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TablaCComponent } from "../../../components/tabla-c/tabla-c.component";
import { TablaHComponent } from "../../../components/tabla-h/tabla-h.component";
import { TablaAComponent } from "../../../components/tabla-a/tabla-a.component";
import { TablaSComponent } from "../../../components/tabla-s/tabla-s.component";
import { TablaIComponent } from "../../../components/tabla-i/tabla-i.component";
import { TablaDComponent } from "../../../components/tabla-d/tabla-d.component";
import { TablaEComponent } from "../../../components/tabla-e/tabla-e.component";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-result-form',
  imports: [TablaCComponent, TablaHComponent, TablaAComponent, TablaSComponent, TablaIComponent, TablaDComponent, TablaEComponent, RouterModule],
  templateUrl: './result-form.component.html',
  styleUrl: './result-form.component.css'
})
export class ResultFormComponent {
  @ViewChild('contenidoPDF', {static: false}) contenido!: ElementRef;
  bdform: boolean = false;
  nombre: string = '';
  colegio: string = '';
  carnet: string = '';
  interes: number = 0;
  aptitud: number = 0;
  holland: string = '';
  chaside: string = '';
  celular: string = '';
  curso: string = '';
  edad: number = 0;
  hollandPerfil = { R: 'Realista', I: 'Investigador', A: 'Artístco', S: 'Social', E: 'Emprendedor', C: 'Convencional' };
  chasideDesc = {
    C: 'Ciencias Económicas y Financieras',
    H: 'Humanidades y Ciencias Sociales y Políticas',
    A: 'Artes, arquitectura y diseño',
    S: 'Salud, Enfermería, Medicina',
    I: 'Investigación, Ingeniería, Tecnología',
    D: 'Defensa',
    E: 'Exactas, Ciencias Puras'
  };
  chasideTabla = {
    C: 'Tabla 1C',
    H: 'Tabla 2H',
    A: 'Tabla 3A',
    S: 'Tabla 4S',
    I: 'Tabla 5I',
    D: 'Tabla 6D',
    E: 'Tabla 7E'
  };
  hollandDesc = {
    R: 'Prefieres lo práctico, físico y técnico. Te gusta construir, reparar o usar herramientas.',
    I: 'Te interesa descubrir, analizar y comprender cómo funcionan las cosas.',
    A: 'Eres creativo, expresivo y valoras la originalidad y el arte.',
    S: 'Te gusta ayudar, enseñar y colaborar con otras personas.',
    E: 'Tienes iniciativa, te gusta liderar y tomar decisiones.',
    C: 'Valoras el orden, la organización y trabajar con datos o procesos claros.'
  }
  personalidadP: string = '';
  personalidadS: string = '';
  personalidadT: string = '';
  descripcionP: string = '';
  descripcionS: string = '';
  descripcionT: string = '';
  ramaChaside: string = '';
  tablaChaside: string='';
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      //const navigation = this.router.getCurrentNavigation();
      const state = history.state as {
        bdform: boolean,
        nombre: string,
        colegio: string,
        carnet: string,
        interes: number,
        aptitud: number,
        holland: string,
        chaside: string,
        celular: string,
        curso: string,
        edad: number,
      }
      if (!state || !state.nombre) {
        this.router.navigate(['/']);
        return;
      }
      this.bdform = state.bdform!;
      this.nombre = state.nombre!;
      this.colegio = state.colegio!;
      this.carnet = state.carnet!;
      this.interes = state.interes!;
      this.aptitud = state.aptitud!;
      this.holland = state.holland!;
      this.chaside = 'E';
      this.celular = state.celular!;
      this.curso = state.curso!;
      this.edad = state.edad!;
      this.personalidadP = this.hollandPerfil[this.holland[0] as keyof typeof this.hollandPerfil];
      this.personalidadS = this.hollandPerfil[this.holland[1] as keyof typeof this.hollandPerfil];
      this.personalidadT = this.hollandPerfil[this.holland[2] as keyof typeof this.hollandPerfil];
      this.descripcionP = this.hollandDesc[this.holland[0] as keyof typeof this.hollandDesc];
      this.descripcionS = this.hollandDesc[this.holland[1] as keyof typeof this.hollandDesc];
      this.descripcionT = this.hollandDesc[this.holland[2] as keyof typeof this.hollandDesc];
      this.ramaChaside = this.chasideDesc[this.chaside as keyof typeof this.chasideDesc];
      this.tablaChaside = this.chasideTabla[this.chaside as keyof typeof this.chasideTabla];
    }
  }
  fecha = new Date();
  fechaStr = this.fecha.toLocaleDateString('es-ES');
  
  generarPdf(){
    if(isPlatformBrowser(this.platformId)){
      const elemento = this.contenido.nativeElement;
      html2canvas(elemento).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidht = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidht) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidht, pdfHeight);
        pdf.save('resultados.pdf')
      })
    }
  }
}
