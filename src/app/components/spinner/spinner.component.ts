import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"

@Component({
  selector: 'app-spinner',
  imports: [
    MatProgressSpinnerModule,
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
 
  private loadingService = inject(LoadingService);
  spinner = this.loadingService.spineer;

  
}
