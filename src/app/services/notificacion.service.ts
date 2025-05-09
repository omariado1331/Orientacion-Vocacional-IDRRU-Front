import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private toastr: ToastrService) { }

  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning'): void {
    switch (tipo) {
      case 'success':
        this.toastr.success(mensaje, 'Éxito');
        break;
      case 'error':
        this.toastr.error(mensaje, 'Error');
        break;
      case 'info':
        this.toastr.info(mensaje, 'Información');
        break;
      case 'warning':
        this.toastr.warning(mensaje, 'Advertencia');
        break;
    }
  }
}