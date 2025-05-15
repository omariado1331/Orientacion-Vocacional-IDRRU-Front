import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private config: Partial<IndividualConfig> = {
    timeOut: 3000,
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
  };

  constructor(private toastr: ToastrService) {}

  mostrar(mensaje: string, tipo: 'success' | 'error' | 'info' | 'warning'): void {
    const tituloMap = {
      success: 'Éxito',
      error: 'Error',
      info: 'Información',
      warning: 'Advertencia'
    };

    this.toastr[tipo](mensaje, tituloMap[tipo], this.config);
  }
}
