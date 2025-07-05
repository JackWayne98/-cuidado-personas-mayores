import { Component, effect, inject, signal } from "@angular/core";
import { ElderRegisterService } from "../../services/elder-register.service";
import { ActivitiesService } from "../../services/activities.service";
import { Ielder } from "../../interfaces/ielder";
import { Iactivity } from "../../interfaces/iactivity";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-activities-list",
  imports: [CommonModule],
  templateUrl: "./activities-list.component.html",
  styleUrl: "./activities-list.component.css",
})
export class ActivitiesListComponent {
  private activitiesService = inject(ActivitiesService);

  activities = signal<Iactivity[]>([]);
  filteredActivities = signal<Iactivity[]>([]);
  selectedCategory = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Available activity categories (hardcoded here, or you can centralize it)
  categories: string[] = [
    "medicación",
    "terapia",
    "ejercicio",
    "alimentación",
    "descanso",
    "visita",
    "ocio",
  ];

  // Load all activities on component load
  private loadActivitiesEffect = effect(async () => {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const response = await this.activitiesService.getAllActivities();
      this.activities.set(response.actividades);
    } catch (err) {
      console.error("Failed to load activities:", err);
      this.error.set("No se pudieron cargar las actividades.");
    } finally {
      this.isLoading.set(false);
    }
  });

  onCategorySelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    const category = target.value || null;
    this.selectedCategory.set(category);

    if (category) {
      const filtered = this.activities().filter(
        (activity) => activity.categoria === category
      );
      this.filteredActivities.set(filtered);
    } else {
      this.filteredActivities.set([]);
    }
  }

  hasSelected() {
    return !!this.selectedCategory();
  }
}
