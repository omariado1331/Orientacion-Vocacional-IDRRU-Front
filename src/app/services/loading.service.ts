import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading = signal(false);
  spineer = this.loading.asReadonly();
  loadingOn(){
    this.loading.set(true);
  }
  loadingfOff(){
    this.loading.set(false);
  }
}
