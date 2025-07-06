import { Component, effect, inject, signal } from "@angular/core";
import { ElderRegisterService } from "../../services/elder-register.service";
import { ActivitiesService } from "../../services/activities.service";
import { Ielder } from "../../interfaces/ielder";
import { Iactivity } from "../../interfaces/iactivity";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-activities-list",
  imports: [CommonModule],
  templateUrl: "./activities-list.component.html",
  styleUrl: "./activities-list.component.css",
})
export class ActivitiesListComponent {
  private activitiesService = inject(ActivitiesService);
  private router = inject(Router);

  activities = signal<Iactivity[]>([]);
  filteredActivities = signal<Iactivity[]>([]);
  selectedCategory = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  categories: string[] = [
    "medicación",
    "terapia",
    "ejercicio",
    "alimentación",
    "descanso",
    "visita",
    "ocio",
  ];

  private loadActivitiesEffect = effect(async () => {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const response = await this.activitiesService.getAllActivities();
      this.activities.set(response.actividades);
    } catch (err) {
      Swal.fire("Error", "No se pudieron cargar las actividades.", "error");
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

  onEdit(activityId: number) {
    this.router.navigate([`/dashboard/elderupdateactivity/${activityId}`]);
  }

  async onDelete(activityId: number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la actividad permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await this.activitiesService.deleteActivity(activityId);
      const updatedActivities = this.activities().filter(
        (a) => a.id !== activityId
      );
      this.activities.set(updatedActivities);

      const updatedFiltered = this.filteredActivities().filter(
        (a) => a.id !== activityId
      );
      this.filteredActivities.set(updatedFiltered);

      Swal.fire(
        "Eliminada",
        "La actividad se eliminó correctamente.",
        "success"
      );
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar la actividad.", "error");
    }
  }
}
