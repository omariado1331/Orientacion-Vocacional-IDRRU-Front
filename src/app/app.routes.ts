import { Routes } from '@angular/router';
import { OrientacionVocacionalComponent } from './orientacion-vocacional/orientacion-vocacional.component';
import { InfoOrientacionComponent } from './info-orientacion/info-orientacion.component';
import { ReportOrientacionComponent } from './report-orientacion/report-orientacion.component';

export const routes: Routes = [
    {path: '', redirectTo: 'orientacion-vocacional', pathMatch: 'full'},
    {path:'orientacion-vocacional', component: OrientacionVocacionalComponent},
    {path:'info-orientacion', component: InfoOrientacionComponent },
    {path:'report-orientacion', component: ReportOrientacionComponent}
];
 