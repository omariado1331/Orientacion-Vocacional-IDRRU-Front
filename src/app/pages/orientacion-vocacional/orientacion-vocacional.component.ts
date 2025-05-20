import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-orientacion-vocacional',
  imports: [RouterModule],
  templateUrl: './orientacion-vocacional.component.html',
  styleUrl: './orientacion-vocacional.component.css'
})
export class OrientacionVocacionalComponent {

  constructor(private router: Router){}
}
