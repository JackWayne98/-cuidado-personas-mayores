import { Component, inject, signal } from "@angular/core";
import { ElderRegisterService } from "../../services/elder-register.service";
import { ActivitiesService } from "../../services/activities.service";
import { Ielder } from "../../interfaces/ielder";
import Swal from "sweetalert2";
import { EventActivityService } from "../../services/event-activity.service";
import { FormsModule } from "@angular/forms";
@Component({
  selector: "app-event-activity-form",
  imports: [FormsModule],
  templateUrl: "./event-activity-form.component.html",
  styleUrl: "./event-activity-form.component.css",
})
export class EventActivityFormComponent {
  private elderService = inject(ElderRegisterService);
  private activitiesService = inject(ActivitiesService);
  private eventService = inject(EventActivityService);

  elders: Ielder[] = [];
  activities: any[] = [];

  selectedElderId: number | null = null;
  selectedActivityId: number | null = null;

  fechaInicio: string = "";
  fechaFin: string = "";
  recordatorio: boolean = false;

  eventType: "individual" | "recurrente" = "individual";
  intervaloHoras: number | null = null;
  repeticiones: number | null = null;

  eldersLoaded = (async () => {
    try {
      const response = await this.elderService.getAllElders();
      this.elders = response.personasMayores;
    } catch (error) {
      console.error("Error loading elders:", error);
      Swal.fire("Error", "No se pudieron cargar los residentes.", "error");
    }
  })();

  async onElderSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedElderId = +target.value;
    try {
      const response = await this.activitiesService.getActivitiesByElderId(
        this.selectedElderId
      );
      this.activities = response.actividades || [];
    } catch (error) {
      console.error("Error loading activities:", error);
      Swal.fire("Error", "No se pudieron cargar las actividades.", "error");
    }
  }

  onActivitySelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedActivityId = +target.value;
  }

  async submitEvent() {
    if (
      !this.selectedElderId ||
      !this.selectedActivityId ||
      !this.fechaInicio ||
      !this.fechaFin
    ) {
      Swal.fire("Error", "Completa todos los campos requeridos.", "error");
      return;
    }

    if (
      this.eventType === "recurrente" &&
      (!this.intervaloHoras || !this.repeticiones)
    ) {
      Swal.fire(
        "Error",
        "Completa todos los campos de evento recurrente.",
        "error"
      );
      return;
    }

    try {
      if (this.eventType === "individual") {
        await this.eventService.createIndividualEvent({
          actividad_id: this.selectedActivityId,
          fecha_inicio: this.fechaInicio,
          fecha_fin: this.fechaFin,
          recordatorio: this.recordatorio,
        });
        Swal.fire("Éxito", "Evento individual registrado.", "success");
      } else {
        await this.eventService.createRecurrentEvent({
          actividad_id: this.selectedActivityId,
          fecha_inicio: this.fechaInicio,
          fecha_fin: this.fechaFin,
          recordatorio: this.recordatorio,
          intervalo_horas: this.intervaloHoras!,
          repeticiones: this.repeticiones!,
        });
        Swal.fire("Éxito", "Evento recurrente registrado.", "success");
      }
    } catch (error) {
      console.error("Error al registrar evento:", error);
      Swal.fire("Error", "No se pudo registrar el evento.", "error");
    }
  }
}
