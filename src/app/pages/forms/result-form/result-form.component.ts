import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-result-form',
  imports: [],
  templateUrl: './result-form.component.html',
  styleUrl: './result-form.component.css'
})
export class ResultFormComponent {
  nombre: string = '';
  colegio: string = '';
  carnet: string = '';
  interes: number = 0;
  aptitud: number = 0;
  holland: string = '';
  chaside: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ){
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      nombre: string,
      colegio: string,
      carnet: string,
      interes: number,
      aptitud: number,
      holland: string,
      chaside: string
    };
    this.nombre = state.nombre;
    this.colegio = state.colegio;
    this.carnet = state.carnet;
    this.interes = state.interes;
    this.aptitud = state.aptitud;
    this.holland = state.holland;
    this.chaside = state.chaside;
  }
  


}
