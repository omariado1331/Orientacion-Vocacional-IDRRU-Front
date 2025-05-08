import { Routes } from '@angular/router';
import { OrientacionVocacionalComponent } from './pages/orientacion-vocacional/orientacion-vocacional.component';
import { InfoOrientacionComponent } from './pages/info-orientacion/info-orientacion.component';
import { ReportOrientacionComponent } from './pages/report-orientacion/report-orientacion.component';
import { FormEstudianteComponent } from './pages/forms/form-estudiante/form-estudiante.component';
import { ResultFormComponent } from './pages/forms/result-form/result-form.component';

export const routes: Routes = [
    {path: '', redirectTo: 'orientacion-vocacional', pathMatch: 'full'},
    {path:'orientacion-vocacional', component: OrientacionVocacionalComponent},
    {path:'info-orientacion', component: InfoOrientacionComponent },
    {path:'report-orientacion', component: ReportOrientacionComponent},
    {path: 'formulario', children:[
        {path: 'estudiante', component: FormEstudianteComponent},
        {path: 'resultado', component: ResultFormComponent}
    ]}
];
 