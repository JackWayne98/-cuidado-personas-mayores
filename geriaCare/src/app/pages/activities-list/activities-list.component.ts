import { Component, effect, inject, signal } from '@angular/core';
import { ElderRegisterService } from '../../services/elder-register.service';
import { ActivitiesService } from '../../services/activities.service';
import { Ielder } from '../../interfaces/ielder';

@Component({
  selector: 'app-activities-list',
  imports: [],
  templateUrl: './activities-list.component.html',
  styleUrl: './activities-list.component.css',
})
export class ActivitiesListComponent {
  private elderService = inject(ElderRegisterService);
  private activitiesService = inject(ActivitiesService);

  elders = signal<Ielder[]>([]);
  activities = signal<any[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // ✅ Added signal to track if user has picked a resident
  hasSelected = signal(false);

  // Load elders on component init
  private loadEldersEffect = effect(async () => {
    try {
      const response = await this.elderService.getAllElders();
      this.elders.set(response.personasMayores);
    } catch (error) {
      console.error('Error loading elders:', error);
      this.error.set('No se pudieron cargar los residentes.');
    }
  });

  async onElderSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement | null;
    if (!selectElement) return;

    const selectedValue = selectElement.value;
    if (!selectedValue) return;

    // ✅ Mark that a resident has been selected
    this.hasSelected.set(true);

    this.isLoading.set(true);
    try {
      const response = await this.activitiesService.getActivitiesByElderId(
        +selectedValue
      );
      this.activities.set(response.actividades);
      this.error.set(null);
    } catch (err) {
      console.error('Error loading activities:', err);
      this.activities.set([]);
      this.error.set('No se pudieron cargar las actividades.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
