import { Component, inject, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Ielder } from '../../interfaces/ielder';
import { ElderRegisterService } from '../../services/elder-register.service';

@Component({
  selector: 'app-elders-list',
  imports: [DatePipe],
  templateUrl: './elders-list.component.html',
  styleUrl: './elders-list.component.css',
})
export class EldersListComponent {
  private elderService = inject(ElderRegisterService);

  elders = signal<Ielder[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  private loadEldersEffect = effect(async () => {
    this.isLoading.set(true);
    try {
      const response = await this.elderService.getAllElders();
      this.elders.set(response.personasMayores);
      this.isLoading.set(false);
    } catch (err) {
      console.error('Error loading elders:', err);
      this.error.set('No se pudieron cargar los registros.');
      this.isLoading.set(false);
    }
  });
}
