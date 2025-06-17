import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TablaCComponent } from "../../../components/tabla-c/tabla-c.component";
import { TablaHComponent } from "../../../components/tabla-h/tabla-h.component";
import { TablaAComponent } from "../../../components/tabla-a/tabla-a.component";
import { TablaSComponent } from "../../../components/tabla-s/tabla-s.component";
import { TablaIComponent } from "../../../components/tabla-i/tabla-i.component";
import { TablaDComponent } from "../../../components/tabla-d/tabla-d.component";
import { TablaEComponent } from "../../../components/tabla-e/tabla-e.component";
import jsPDF from 'jspdf';

@Component({
  selector: 'app-result-form',
  imports: [TablaCComponent, TablaHComponent, TablaAComponent, TablaSComponent, TablaIComponent, TablaDComponent, TablaEComponent, RouterModule],
  templateUrl: './result-form.component.html',
  styleUrl: './result-form.component.css'
})
export class ResultFormComponent {

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
  provincia: string = '';
  municipio: string = '';
  edad: number = 0;
  hollandPerfil = { R: 'Realista', I: 'Investigador', A: 'Artístico', S: 'Social', E: 'Emprendedor', C: 'Convencional' };
  chasideDesc = {
    C: 'Ciencias Económicas y Financieras',
    H: 'Humanidades y Ciencias Sociales y Políticas',
    A: 'Artes, arquitectura y diseño',
    S: 'Salud, Enfermería, Medicina',
    I: 'Investigación, Ingeniería, Tecnología',
    D: 'Defensa y Seguridad',
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
  facultades: any[] = [];
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
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
        provincia: string,
        municipio: string
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
      // this.chaside = 'S';
      this.chaside = state.chaside!;
      this.celular = state.celular!;
      this.curso = state.curso!;
      this.edad = state.edad!;
      this.provincia = state.provincia!;
      this.municipio = state.municipio!;
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
  
  async generarPdf(){
    const colorAzulUMSA: [number, number, number] = [0, 51, 153];
    const colorVinoUMSA: [number, number, number] = [128, 0, 32];
    const colorAzulClaro: [number, number, number] = [235, 245, 255];
    const colorGrisClaro: [number, number, number] = [240, 240, 240];
    const colorVerdeClaro: [number, number, number] = [230, 255, 230];
    const dark: [number, number, number] = [0, 0, 0];
    if(isPlatformBrowser(this.platformId)){
      const doc = new jsPDF('portrait', 'mm', 'letter');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      // try {
      //   const logoUMSA = await this.cargarImagen('assets/umsaescudo.png');
      //   const logoIDRDU = await this.cargarImagen('assets/idrdu.png');
      //   if (logoUMSA) {
      //     doc.addImage(logoUMSA, 'PNG', margin, margin, 15, 25);
      //   }
      //   if (logoIDRDU) {
      //     doc.addImage(logoIDRDU, 'PNG', pageWidth - margin - 30, margin, 25, 25);
      //   }
      // } catch (error) {
      //   console.warn('No se pudieron cargar las imágenes para el PDF', error);
      // }
      let y =15;
      /*==================================
    * Encabezado y pie de pagina del PDF
    ====================================*/
    const logoUmsaColor = 'assets/umsac.png';
    const logoIDRUColor = 'assets/idrdu.png';
    const logoUMSA = await this.cargarImagen(logoUmsaColor);
    const logoIDRDU = await this.cargarImagen(logoIDRUColor);
    const agregarEncabezado = (logoUMSA: string | null, logoIDRDU: string | null) => {
      // === ===
      const anchoPagina = doc.internal.pageSize.getWidth();
      const margen = 10;
      const anchoLogo = 23;
      const altoLogo = 23;

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
      if (logoUMSA) doc.addImage(logoUMSA, 'PNG', margen, margen-3, anchoLogo, altoLogo);
      if (logoIDRDU) doc.addImage(logoIDRDU, 'PNG', anchoPagina - margen - anchoLogo , margen, anchoLogo-5, altoLogo-5);

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
      // === estilos ===
      doc.setTextColor(...colorTexto);
      doc.setFont(fuente, estilo);
      doc.setFontSize(tamañoFuente);

      // === texto ===
      doc.text(textoLinea1, anchoPagina / 2, altoPagina - 12, { align: 'center' });
      doc.text(textoLinea2, anchoPagina / 2, altoPagina - 8, { align: 'center' });
    };


    agregarEncabezado(logoUMSA, logoIDRDU);
    agregarPiePagina();

      const yPos = 0;
      //doc.setFontSize(14)
      //doc.setFont('helvetica', 'bold')
      //doc.setTextColor(...colorAzulUMSA)
      //doc.text('UNIVERSIDAD MAYOR DE SAN ANDRÉS', pageWidth/2, yPos+10, {align: 'center'})
      //doc.setFontSize(9)
      //doc.text('Instituto de Desarrollo Regional', pageWidth/2, yPos+20, {align: 'center'})
      //doc.text('y Desconcentración Universitaria', pageWidth/2, yPos+25, {align: 'center'})
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...colorVinoUMSA)
      doc.setFontSize(12)
      doc.text('RESULTADOS DEL TEST VOCACIONAL', pageWidth/2, yPos+35, {align: 'center'})
      //doc.line(10, yPos+40, pageWidth-10, yPos+40)
      doc.text('TUS MEJORES OPCIONES SON:', pageWidth/2 , yPos+100, {align: 'center'})
      doc.setFontSize(11)
      doc.text('INTERPRETACIÓN DE RESULTADOS DE TEST HOLLAND: ', 10, yPos+220, {align: 'left'})
      doc.text('DATOS DEL ESTUDIANTE', 10, yPos+50, {align: 'left'})
      doc.text('TEST CHASIDE', pageWidth/2, yPos+50, {align: 'left'})
      doc.text('TEST DE HOLLAND', pageWidth/2, yPos+75, {align: 'left'})
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...colorAzulUMSA)
      doc.text('Nombre:', 10, yPos+55, {align: 'left'})
      doc.text('Carnet:', 10, yPos+60, {align: 'left'})
      doc.text('Curso:', 10, yPos+65, {align: 'left'})
      doc.text('Colegio:', 10, yPos+70, {align: 'left'})
      doc.text('Edad:', 10, yPos+75, {align: 'left'})
      doc.text('Municipio:', 10, yPos+80, {align: 'left'})
      doc.text('Provincia:', 10, yPos+85, {align: 'left'})
      doc.text('Fecha de Evaluación:', 10, yPos+90, {align: 'left'})
      doc.text(`Mejor Puntaje Obtenido: ${this.interes+this.aptitud}`, pageWidth/2, yPos+55, {align: 'left'})
      doc.text('Mejor Opción Vocacional:', pageWidth/2, yPos+60, {align: 'left'})
      doc.text('Personalidades Dominantes: ', pageWidth/2, yPos+80, {align: 'left'})
      doc.setTextColor(...dark);
      doc.text(this.nombre, 35, yPos+55, {align: 'left'})
      doc.text(this.carnet, 35, yPos+60, {align: 'left'})
      doc.text(this.curso, 35, yPos+65, {align: 'left'})
      doc.text(this.colegio, 35, yPos+70, {align: 'left'})
      doc.text(`${this.edad} años`, 35, yPos+75, {align: 'left'})
      doc.text(this.municipio, 35, yPos+80, {align: 'left'})
      doc.text(this.provincia, 35, yPos+85, {align: 'left'})
      doc.text(this.fechaStr, 50, yPos+90, {align: 'left'})
      doc.text(`${this.ramaChaside}`, pageWidth* 3/4 -40, yPos+65, {align: 'left'})
      doc.text(`${this.personalidadP}, ${this.personalidadS}, ${this.personalidadT}`, pageWidth * 3/4 -40, yPos+85, {align: 'left'})
      if(this.chaside == 'C'){
        try {
          const logoFCEF = await this.cargarImagen('assets/logos-facultades/FCEF.png');
          if (logoFCEF) {
            doc.addImage(logoFCEF, 'PNG', pageWidth/2 -20, yPos+105, 40, 40);
          }
        } catch (error) {
          console.warn('No se pudieron cargar las imágenes para el PDF', error);
        }
        doc.setTextColor(...colorAzulUMSA)
        doc.setFont('helvetica', 'bold')
        doc.text('Facultad de Ciencias Económicas', pageWidth/2, yPos+150, {align: 'center'});
        doc.text('y Fincieras', pageWidth/2, yPos+155, {align: 'center'});
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...colorVinoUMSA)
        doc.text('Carreras Disponibles:', pageWidth/2, yPos+165, {align: 'center'});
        doc.setTextColor(...dark)
        doc.text('ADMINISTRACIÓN DE EMPRESAS', pageWidth/2 -29, yPos+170, {align: 'left'});
        doc.text('CONTADURÍA PÚBLICA', pageWidth/2 -29, yPos+175, {align: 'left'});
        doc.text('ECONOMÍA', pageWidth/2 -29, yPos+180, {align: 'left'});
      }
      if(this.chaside == 'H'){
        try {
          const logoFCS = await this.cargarImagen('assets/logos-facultades/FCS.png');
          const logoFDCP = await this.cargarImagen('assets/logos-facultades/FDCP.png');
          const logoFHCE = await this.cargarImagen('assets/logos-facultades/FHCE.png');
          if (logoFCS) {
            doc.addImage(logoFCS, 'PNG', pageWidth/4 -35, yPos+105, 40, 40);
          }
          if (logoFDCP) {
            doc.addImage(logoFDCP, 'PNG', pageWidth/2 -20, yPos+105, 40, 40);
          }
          if (logoFHCE) {
            doc.addImage(logoFHCE, 'PNG', pageWidth* 3/4 -5, yPos+105, 40, 40);
          }
        } catch (error) {
          console.warn('No se pudieron cargar las imágenes para el PDF', error);
        }
        doc.setTextColor(...colorAzulUMSA)
        doc.setFont('helvetica', 'bold')
        doc.text('Facultad de Ciencias Sociales', pageWidth/4 -15, yPos+155, {align: 'center'});
        //doc.text('Ciencias Políticas', pageWidth/4 -35, yPos+155, {align: 'center'});
        doc.text('Facultad de Derecho y', pageWidth/2, yPos+150, {align: 'center'});
        doc.text('Ciencias Políticas', pageWidth/2, yPos+155, {align: 'center'});
        doc.text('Facultad Humanidades y', pageWidth* 3/4 +15, yPos+150, {align: 'center'});
        doc.text('Ciecias de la Educación', pageWidth* 3/4 +15, yPos+155, {align: 'center'});

        doc.setFont('helvetica', 'normal')

        doc.setTextColor(...colorVinoUMSA)
        doc.text('Carreras Disponibles:', pageWidth/4 -15, yPos+165, {align: 'center'});
        doc.text('Carreras Disponibles:', pageWidth/2, yPos+165, {align: 'center'});
        doc.text('Carreras Disponibles:', pageWidth* 3/4 +15, yPos+165, {align: 'center'});

        doc.setTextColor(...dark)
        doc.text('- ANTROPOLOGÍA Y', pageWidth/4 -44, yPos+170, {align: 'left'});
        doc.text('  ARQUEOLOGÍA', pageWidth/4 -44, yPos+175, {align: 'left'});
        doc.text('- COMUNICACIÓN SOCIAL', pageWidth/4 -44, yPos+180, {align: 'left'});
        doc.text('- SOCIOLOGÍA', pageWidth/4 -44, yPos+185, {align: 'left'});
        doc.text('- TRABAJO SOCIAL', pageWidth/4 -44, yPos+190, {align: 'left'});

        doc.text('- DERECHO', pageWidth/2 -29, yPos+170, {align: 'left'});
        doc.text('- CIENCIAS POLÍTICAS', pageWidth/2 -29, yPos+175, {align: 'left'});
        
        doc.text('- BIBLIOTECOLOGÍA Y CIENCIAS', pageWidth* 3/4 -14, yPos+170, {align: 'left'});
        doc.text('  DE LA EDUCACIÓN', pageWidth* 3/4 -14, yPos+175, {align: 'left'});
        doc.text('- FILOSOFÍA', pageWidth* 3/4 -14, yPos+180, {align: 'left'});
        doc.text('- HISTORIA', pageWidth* 3/4 -14, yPos+185, {align: 'left'});
        doc.text('- LINGÜISTICA E IDIOMAS', pageWidth* 3/4 -14, yPos+190, {align: 'left'});
        doc.text('- LITERATURA', pageWidth* 3/4 -14, yPos+195, {align: 'left'});
        doc.text('- PSICOLOGÍA', pageWidth* 3/4 -14, yPos+200, {align: 'left'});
        doc.text('- TURISMO', pageWidth* 3/4 -14, yPos+205, {align: 'left'});
      }
      if(this.chaside == 'A'){
        try {
          const logoFAADU = await this.cargarImagen('assets/logos-facultades/FAADU.png');
          if (logoFAADU) {
            doc.addImage(logoFAADU, 'PNG', pageWidth/2 -25, yPos+105, 50, 50);
          }
        } catch (error) {
          console.warn('No se pudieron cargar las imágenes para el PDF', error);
        }
        doc.setTextColor(...colorAzulUMSA)
        doc.setFont('helvetica', 'bold')
        doc.text('Facultad de Arquitectura, Artes', pageWidth/2, yPos+165, {align: 'center'});
        doc.text('Diseño y Urbanismo', pageWidth/2, yPos+170, {align: 'center'});
        doc.setFont('helvetica', 'normal')

        doc.setTextColor(...colorVinoUMSA)
        doc.text('Carreras Disponibles:', pageWidth/2, yPos+180, {align: 'center'});

        doc.setTextColor(...dark)
        doc.text('ARQUITECTURA', pageWidth/2 -29, yPos+185, {align: 'left'});
        doc.text('ARTES', pageWidth/2 -29, yPos+190, {align: 'left'});
        doc.text('DISEÑO', pageWidth/2 -29, yPos+195, {align: 'left'});
      }

      if(this.chaside == 'S'){
        try {
          const logoFMENT = await this.cargarImagen('assets/logos-facultades/FMENT.png');
          const logoFO = await this.cargarImagen('assets/logos-facultades/FO.png');
          const logoFCFB = await this.cargarImagen('assets/logos-facultades/FCFB.png');
          if (logoFMENT) {
            doc.addImage(logoFMENT, 'PNG', pageWidth/4 -35, yPos+105, 40, 40);
          }
          if (logoFO) {
            doc.addImage(logoFO, 'PNG', pageWidth/2 -20, yPos+105, 45, 45);
          }
          if (logoFCFB) {
            doc.addImage(logoFCFB, 'PNG', pageWidth* 3/4 -5, yPos+105, 40, 40);
          }
        } catch (error) {
          console.warn('No se pudieron cargar las imágenes para el PDF', error);
        }
        doc.setTextColor(...colorAzulUMSA)
        doc.setFont('helvetica', 'bold')
        doc.text('Facultad de Medicina, Enfermería,', pageWidth/4 -15, yPos+150, {align: 'center'});
        doc.text('Nutrición y Tecnología Médica', pageWidth/4 -15, yPos+155, {align: 'center'});
        doc.text('Facultad de Odontología', pageWidth/2, yPos+155, {align: 'center'});
        //doc.text('Ciencias Políticas', pageWidth/2, yPos+155, {align: 'center'});
        doc.text('Facultad de Ciencias', pageWidth* 3/4 +15, yPos+150, {align: 'center'});
        doc.text('Farmacéuticas y Bioquímicas', pageWidth* 3/4 +15, yPos+155, {align: 'center'});

        doc.setTextColor(...colorVinoUMSA)
        doc.setFont('helvetica', 'normal')
        doc.text('Carreras Disponibles:', pageWidth/4 -15, yPos+165, {align: 'center'});
        doc.text('Carreras Disponibles:', pageWidth/2, yPos+165, {align: 'center'});
        doc.text('Carreras Disponibles:', pageWidth* 3/4 +15, yPos+165, {align: 'center'});

        doc.setTextColor(...dark)
        doc.text('- MEDICINA', pageWidth/4 -44, yPos+170, {align: 'left'});
        doc.text('- ENFERMERÍA', pageWidth/4 -44, yPos+175, {align: 'left'});
        doc.text('- NUTRICIÓN Y DIETÉTICA', pageWidth/4 -44, yPos+180, {align: 'left'});
        doc.text('- TECNOLOGÍA MÉDICA', pageWidth/4 -44, yPos+185, {align: 'left'});
        
        doc.text('- ODONTOLOGÍA', pageWidth/2 -29, yPos+170, {align: 'left'});

        doc.text('- BIOQUÍMICA', pageWidth* 3/4 -14, yPos+170, {align: 'left'});
        doc.text('- QUÍMICA FARMACÉUTICA', pageWidth* 3/4 -14, yPos+175, {align: 'left'});
      }

      if(this.chaside == 'I'){
        try {
          const logoFT = await this.cargarImagen('assets/logos-facultades/FT.png');
          const logoFI = await this.cargarImagen('assets/logos-facultades/FI.png');
          const logoFCG = await this.cargarImagen('assets/logos-facultades/FCG.png');
          if (logoFT) {
            doc.addImage(logoFT, 'PNG', pageWidth/4 -35, yPos+105, 40, 40);
          }
          if (logoFI) {
            doc.addImage(logoFI, 'PNG', pageWidth/2 -20, yPos+105, 40, 40);
          }
          if (logoFCG) {
            doc.addImage(logoFCG, 'PNG', pageWidth* 3/4 -5, yPos+105, 40, 40);
          }
        } catch (error) {
          console.warn('No se pudieron cargar las imágenes para el PDF', error);
        }
        
        doc.setTextColor(...colorAzulUMSA)
        doc.setFont('helvetica', 'bold')
        //doc.text('Facultad de Medicina, Enfermería,', pageWidth/4 -15, yPos+150, {align: 'center'});
        doc.text('Facultad de Tecnología', pageWidth/4 -15, yPos+155, {align: 'center'});
        doc.text('Facultad de Ingeniería', pageWidth/2, yPos+155, {align: 'center'});
        //doc.text('Ciencias Políticas', pageWidth/2, yPos+155, {align: 'center'});
        doc.text('Facultad de Ciencias', pageWidth* 3/4 +15, yPos+150, {align: 'center'});
        doc.text('Geológicas', pageWidth* 3/4 +15, yPos+155, {align: 'center'});

        doc.setTextColor(...colorVinoUMSA)
        doc.setFont('helvetica', 'normal')
        doc.text('Carreras Disponibles:', pageWidth/4 -15, yPos+165, {align: 'center'});
        doc.text('Carreras Disponibles:', pageWidth/2, yPos+165, {align: 'center'});  
        doc.text('Carreras Disponibles:', pageWidth* 3/4 +15, yPos+165, {align: 'center'});

        doc.setTextColor(...dark)
        doc.text('- CONSTRUCCIONES CIVILES', pageWidth/4 -44, yPos+170, {align: 'left'});
        doc.text('- QUÍMICA INDUSTRIAL', pageWidth/4 -44, yPos+175, {align: 'left'});
        doc.text('- TOPOGRAFÍA Y GEODESIA', pageWidth/4 -44, yPos+180, {align: 'left'});
        doc.text('- ELECTROMECÁNICA', pageWidth/4 -44, yPos+185, {align: 'left'});
        doc.text('- TELECOMUNICACIONES', pageWidth/4 -44, yPos+190, {align: 'left'});
        doc.text('- AERONÁUTICA', pageWidth/4 -44, yPos+195, {align: 'left'});
        doc.text('- MECÁNICA AUTOMOTRIZ', pageWidth/4 -44, yPos+200, {align: 'left'});
        doc.text('- MECÁNICA INDUSTRIAL', pageWidth/4 -44, yPos+205, {align: 'left'});

        doc.text('- INGENIERÍA CIVIL', pageWidth/2 -29, yPos+170, {align: 'left'});
        doc.text('- INGENIERÍA ELÉCTRICA', pageWidth/2 -29, yPos+175, {align: 'left'});
        doc.text('- INGENIERÍA ELECTRÓNICA', pageWidth/2 -29, yPos+180, {align: 'left'});
        doc.text('- INGENIERÍA QUÍMICA', pageWidth/2 -29, yPos+185, {align: 'left'});
        doc.text('- INGENIERÍA MECÁNICA Y', pageWidth/2 -29, yPos+190, {align: 'left'});
        doc.text('  ELECTROMECÁNICA', pageWidth/2 -29, yPos+195, {align: 'left'});
        doc.text('- INGENIERÍA INDUSTRIAL', pageWidth/2 -29, yPos+200, {align: 'left'});
        doc.text('- INGENIERÍA PETROLERA', pageWidth/2 -29, yPos+205, {align: 'left'});
        doc.text('- INGENIERÍA METALÚRGICA', pageWidth/2 -29, yPos+210, {align: 'left'});

        doc.text('- INGENIERÍA GEOLÓGICA', pageWidth* 3/4 -14, yPos+170, {align: 'left'});
        doc.text('- INGENIERÍA GEOGRÁFICA', pageWidth* 3/4 -14, yPos+175, {align: 'left'});
      }

      if(this.chaside == 'D'){
        try {
          const logoANAPOL = await this.cargarImagen('assets/logos-facultades/ANAPOL.jpeg');
          const logoCOLMIL = await this.cargarImagen('assets/logos-facultades/COLMIL.jpeg');
          if (logoANAPOL) {
            doc.addImage(logoANAPOL, 'PNG', pageWidth/3 -20, yPos+105, 40, 40);
          }
          if (logoCOLMIL) {
            doc.addImage(logoCOLMIL, 'PNG', pageWidth* 2/3 -20, yPos+105, 40, 40);
          }

        } catch (error) {
          console.warn('No se pudieron cargar las imágenes para el PDF', error);
        }
        doc.setTextColor(...colorAzulUMSA)
        doc.setFont('helvetica', 'bold')
        doc.text('Academía Nacional de', pageWidth/3, yPos+150, {align: 'center'});
        doc.text('Policias', pageWidth/3, yPos+155, {align: 'center'});
        //doc.text('Facultad de Ingeniería', pageWidth* 2/3, yPos+150, {align: 'center'});
        doc.text('Colegio Militar', pageWidth* 2/3, yPos+155, {align: 'center'});

        doc.setTextColor(...colorVinoUMSA)
        doc.setFont('helvetica', 'normal')
        doc.text('Carreras Disponibles:', pageWidth/3 , yPos+165, {align: 'center'});
        doc.text('Carreras Disponibles:', pageWidth* 2/3 , yPos+165, {align: 'center'});

        doc.setTextColor(...dark)
        doc.text('- INGENIERÍA DE TRÁNSITO Y', pageWidth/3 -30, yPos+170, {align: 'left'});
        doc.text('  VIABILIDAD', pageWidth/3 -30, yPos+175, {align: 'left'});
        doc.text('- INVESTIGACIÓN CRIMINAL', pageWidth/3 -30, yPos+180, {align: 'left'});
        doc.text('- ORDEN Y SEGURIDAD', pageWidth/3 -30, yPos+185, {align: 'left'});
        doc.text('- ADMINISTRACIÓN POLICIAL', pageWidth/3 -30, yPos+190, {align: 'left'});

        doc.text('- INFANTERÍA', pageWidth* 2/3 -20, yPos+170, {align: 'left'});
        doc.text('- ARTILLERÍA', pageWidth* 2/3 -20, yPos+175, {align: 'left'});
        doc.text('- CABALLERÍA', pageWidth* 2/3 -20, yPos+180, {align: 'left'});
        doc.text('- INGENIERÍA', pageWidth* 2/3 -20, yPos+185, {align: 'left'});
        doc.text('- COMUNICACIONES', pageWidth* 2/3 -20, yPos+190, {align: 'left'});
        doc.text('- LOGÍSTICA', pageWidth* 2/3 -20, yPos+195, {align: 'left'});
      }

      if(this.chaside == 'E'){
        try {
          const logoFCPN = await this.cargarImagen('assets/logos-facultades/FCPN.png');
          const logoFA = await this.cargarImagen('assets/logos-facultades/FA.png');
          if (logoFCPN) {
            doc.addImage(logoFCPN, 'PNG', pageWidth/3 -20, yPos+105, 40, 40);
          }
          if (logoFA) {
            doc.addImage(logoFA, 'PNG', pageWidth* 2/3 -20, yPos+105, 40, 40);
          }

        } catch (error) {
          console.warn('No se pudieron cargar las imágenes para el PDF', error);
        }
        doc.setTextColor(...colorAzulUMSA)
        doc.setFont('helvetica', 'bold')
        doc.text('Facultad de Ciencias Puras', pageWidth/3, yPos+150, {align: 'center'});
        doc.text('y Naturales', pageWidth/3, yPos+155, {align: 'center'});
        //doc.text('Facultad de Ingeniería', pageWidth* 2/3, yPos+150, {align: 'center'});
        doc.text('Facultad de Agronomía', pageWidth* 2/3, yPos+155, {align: 'center'});

        doc.setTextColor(...colorVinoUMSA)
        doc.setFont('helvetica', 'normal')
        doc.text('Carreras Disponibles:', pageWidth/3 , yPos+165, {align: 'center'});
        doc.text('Carreras Disponibles:', pageWidth* 2/3 , yPos+165, {align: 'center'});

        doc.setTextColor(...dark)
        doc.text('- BIOLOGÍA', pageWidth/3 -20, yPos+170, {align: 'left'});
        doc.text('- ESTADÍSTICA', pageWidth/3 -20, yPos+175, {align: 'left'});
        doc.text('- FÍSICA', pageWidth/3 -20, yPos+180, {align: 'left'});
        doc.text('- INFORMÁTICA', pageWidth/3 -20, yPos+185, {align: 'left'});
        doc.text('- MATEMÁTICAS', pageWidth/3 -20, yPos+190, {align: 'left'});
        doc.text('- CIENCIAS QUÍMICAS', pageWidth/3 -20, yPos+195, {align: 'left'});
 
        doc.text('- INGENIERÍA AGRONÓMICA', pageWidth* 2/3 -25, yPos+170, {align: 'left'});
        doc.text('- INGENIERÍA DE PRODUCCIÓN', pageWidth* 2/3 -25, yPos+175, {align: 'left'});
        doc.text('  Y COMERCIALIZACIÓN', pageWidth* 2/3 -25, yPos+180, {align: 'left'});
        doc.text('- AGROPECUARIA', pageWidth* 2/3 -25, yPos+185, {align: 'left'});
        doc.text('- MEDICINA VETERINARIA', pageWidth* 2/3 -25, yPos+190, {align: 'left'});
        doc.text('  Y ZOOTECNIA', pageWidth* 2/3 -25, yPos+195, {align: 'left'});

      }
      doc.setTextColor(...colorAzulUMSA)
      doc.text(`${this.personalidadP} :`, 10, yPos+225, {align: 'left'})
      doc.text(`${this.personalidadS} :`, 10, yPos+235, {align: 'left'})
      doc.text(`${this.personalidadT} :`, 10, yPos+245, {align: 'left'})
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(...dark)
      doc.text(`${this.descripcionP}`, pageWidth/2, yPos+230, {align: 'center'})
      doc.text(`${this.descripcionS}`, pageWidth/2, yPos+240, {align: 'center'})
      doc.text(`${this.descripcionT}`, pageWidth/2, yPos+250, {align: 'center'})
      doc.line(10, yPos+263, pageWidth-10, yPos+263)
      // doc.setFontSize(8)
      // doc.setFont('helvetica', 'italic')
      // doc.text('Instituto de Desarrollo Regional y Desconcentración Universitaria', pageWidth/2, yPos+258, {align: 'center'})
      // doc.text('Universidad Mayor de San Andrés', pageWidth/2, yPos+261, {align: 'center'})
      // doc.text(`Test de Orientación Vocacional ${this.fecha.getFullYear()}`, pageWidth/2, yPos+264, {align: 'center'})
      doc.save('resultado.pdf')
    }
    
  }

  private cargarImagen(url: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        } else {
          console.error('Failed to get 2D context for canvas');
        }
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };

      img.onerror = () => {
        console.warn(`No se pudo cargar la imagen: ${url}`);
        resolve(null);
      };
      img.src = url;
    });
  }
}
