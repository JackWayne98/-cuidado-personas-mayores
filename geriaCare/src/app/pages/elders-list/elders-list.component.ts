import { Component, inject, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Ielder } from '../../interfaces/ielder';
import { ElderRegisterService } from '../../services/elder-register.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-elders-list',
  imports: [DatePipe, RouterLink],
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
  async confirmDelete(elderId: number) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará al anciano y no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await this.elderService.deleteElderById(elderId);
        Swal.fire(
          'Eliminado',
          'El registro del anciano ha sido eliminado.',
          'success'
        );

        // Refresh list without reloading the page:
        const refreshed = await this.elderService.getAllElders();
        this.elders.set(refreshed.personasMayores);
      } catch (error) {
        console.error('Error deleting elder:', error);
        Swal.fire(
          'Error',
          'No se pudo eliminar al anciano. Intenta de nuevo más tarde.',
          'error'
        );
      }
    }
  }
}
