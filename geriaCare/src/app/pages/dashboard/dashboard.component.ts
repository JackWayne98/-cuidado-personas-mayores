import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElderRegisterService } from '../../services/elder-register.service';
import { Ielder } from '../../interfaces/ielder';
import { Iuser } from '../../interfaces/iuser';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private elderService = inject(ElderRegisterService);
  private authService = inject(AuthService);

  elders = signal<Ielder[]>([]);
  user = signal<Iuser | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  private loadDashboardEffect = effect(async () => {
    this.isLoading.set(true);
    try {
      // Load elders
      const eldersResponse = await this.elderService.getAllElders();
      this.elders.set(eldersResponse.personasMayores);

      // Load user info
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        this.error.set('No se encontró el ID del usuario.');
        return;
      }
      const userResponse = await this.authService.getUserById(+userId);
      this.user.set(userResponse.user);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      this.error.set('No se pudieron cargar los datos del dashboard.');
    } finally {
      this.isLoading.set(false);
    }
  });
}
