import { Component, computed, effect, inject, signal } from "@angular/core";
import { ElderRegisterService } from "../../services/elder-register.service";
import { ActivitiesService } from "../../services/activities.service";
import { Ielder } from "../../interfaces/ielder";
import Swal from "sweetalert2";
import { EventActivityService } from "../../services/event-activity.service";
import { FormsModule } from "@angular/forms";
import { Iactivity } from "../../interfaces/iactivity";
import { ActivatedRoute, Router } from "@angular/router";
import { IeventGroupResponse } from "../../interfaces/ievent-group";
import { IeventSingle } from "../../interfaces/ievent-single";
import { CommonModule } from "@angular/common";

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  elders: Ielder[] = [];
  allActivities: Iactivity[] = [];
  filteredActivities: Iactivity[] = [];

  selectedElderId: number | null = null;
  selectedCategory: string = "";
  selectedActivityId: number | null = null;

  fechaInicio: string = "";
  fechaFin: string = "";
  recordatorio: boolean = false;

  eventType: "individual" | "recurrente" = "individual";
  intervaloHoras: number | null = null;
  repeticiones: number | null = null;

  editMode = signal(false);
  reuseMode = signal(false);

  private eventId: number | null = null;
  private groupId: string | null = null;

  eldersLoaded = (async () => {
    try {
      const response = await this.elderService.getAllElders();
      this.elders = response.personasMayores;
    } catch (error) {
      console.error("Error loading elders:", error);
      Swal.fire("Error", "No se pudieron cargar los residentes.", "error");
    }
  })();

  activitiesLoaded = (async () => {
    try {
      const response = await this.activitiesService.getAllActivities();
      this.allActivities = response.actividades || [];

      if (this.allActivities.length > 0) {
        this.loadEventFromRouteOrReuse();
      }
    } catch (error: any) {
      if (error?.status === 404) {
        return;
      }
      console.error("Error loading activities:", error);
      Swal.fire("Error", "No se pudieron cargar las actividades.", "error");
    }
  })();

  private loadEventFromRouteOrReuse() {
    const idParam = this.route.snapshot.paramMap.get("id");

    if (this.router.url.includes("/reusedrecurrenteventupdate")) {
      const reuseData = localStorage.getItem("reuseEventData");
      if (reuseData) {
        const parsed = JSON.parse(reuseData);
        this.selectedElderId = Number(parsed.persona_mayor_id);
        this.selectedActivityId = Number(parsed.actividad_id);
        this.recordatorio = !!parsed.recordatorio;
        this.eventType = "recurrente"; // Forzar tipo recurrente

        const activity = this.allActivities.find(
          (a) => a.id === this.selectedActivityId
        );
        if (activity) {
          this.selectedCategory = activity.categoria;
          this.filteredActivities = this.allActivities.filter(
            (act) => act.categoria === this.selectedCategory
          );
        }

        this.reuseMode.set(true);
      }
      return;
    }

    if (this.router.url.includes("/reusedeventupdate")) {
      const reuseData = localStorage.getItem("reuseEventData");
      if (reuseData) {
        const parsed = JSON.parse(reuseData);
        this.selectedElderId = Number(parsed.persona_mayor_id);
        this.selectedActivityId = Number(parsed.actividad_id);
        this.recordatorio = !!parsed.recordatorio;
        this.eventType = parsed.eventType ?? "individual";

        const activity = this.allActivities.find(
          (a) => a.id === this.selectedActivityId
        );
        if (activity) {
          this.selectedCategory = activity.categoria;
          this.filteredActivities = this.allActivities.filter(
            (act) => act.categoria === this.selectedCategory
          );
        }

        this.reuseMode.set(true);
      }
      return;
    }

    if (idParam && this.router.url.includes("/recurringeventupdate/")) {
      this.editMode.set(true);
      this.groupId = idParam;
      this.loadRecurrentGroupData(this.groupId);
    } else if (idParam !== null) {
      const eventParamId = Number(idParam);
      if (!isNaN(eventParamId)) {
        this.editMode.set(true);
        this.eventId = eventParamId;
        this.loadEventData(eventParamId);
      }
    }
  }

  async loadEventData(eventId: number) {
    try {
      const response: IeventSingle = await this.eventService.getEventById(
        eventId
      );
      const event = response.eventoActividad;
      if (!event) throw new Error("No se encontró el evento en la respuesta.");

      this.selectedElderId = Number(event.persona_mayor_id);
      this.selectedActivityId = event.actividad_id;
      this.fechaInicio = this.toLocalIsoStringForDatetimeInput(
        new Date(event.fecha_inicio)
      );
      this.fechaFin = this.toLocalIsoStringForDatetimeInput(
        new Date(event.fecha_fin)
      );
      this.recordatorio = !!event.recordatorio;

      const foundActivity = this.allActivities.find(
        (a) => a.id === event.actividad_id
      );
      if (foundActivity) {
        this.selectedCategory = foundActivity.categoria;
        this.filteredActivities = this.allActivities.filter(
          (act) => act.categoria === this.selectedCategory
        );
      }
    } catch (error) {
      console.error("Error loading event data:", error);
      Swal.fire("Error", "No se pudo cargar el evento.", "error");
    }
  }

  async loadRecurrentGroupData(groupId: string) {
    try {
      const response: IeventGroupResponse =
        await this.eventService.getRecurrentGroupEvents(groupId);
      const groupEvents = response.eventoActividades;
      if (!groupEvents || groupEvents.length === 0) {
        throw new Error("No se encontraron eventos para este grupo.");
      }
      const firstEvent = groupEvents[0];

      this.eventType = "recurrente";
      this.selectedElderId = Number(firstEvent.persona_mayor_id);
      this.selectedActivityId = firstEvent.actividad_id;
      this.fechaInicio = this.toLocalIsoStringForDatetimeInput(
        new Date(firstEvent.fecha_inicio)
      );
      this.fechaFin = this.toLocalIsoStringForDatetimeInput(
        new Date(firstEvent.fecha_fin)
      );
      this.recordatorio = !!firstEvent.recordatorio;
      this.intervaloHoras = firstEvent.intervalo_horas ?? null;
      this.repeticiones = firstEvent.repeticiones ?? null;

      const foundActivity = this.allActivities.find(
        (a) => a.id === firstEvent.actividad_id
      );
      if (foundActivity) {
        this.selectedCategory = foundActivity.categoria;
        this.filteredActivities = this.allActivities.filter(
          (act) => act.categoria === this.selectedCategory
        );
      }
    } catch (error) {
      console.error("Error loading recurrent group data:", error);
      Swal.fire("Error", "No se pudo cargar el grupo recurrente.", "error");
    }
  }

  onCategorySelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
    this.filteredActivities = this.allActivities.filter(
      (activity) => activity.categoria === this.selectedCategory
    );
    this.selectedActivityId = null;
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

    const payload = {
      persona_mayor_id: String(this.selectedElderId),
      actividad_id: this.selectedActivityId,
      fecha_inicio: this.fechaInicio,
      fecha_fin: this.fechaFin,
      recordatorio: this.recordatorio,
      ...(this.eventType === "recurrente" && {
        intervalo_horas: this.intervaloHoras!,
        repeticiones: this.repeticiones!,
      }),
    };

    try {
      let response;
      if (this.editMode() && this.eventId !== null) {
        response = await this.eventService.updateIndividualEvent(
          this.eventId,
          payload
        );
        await Swal.fire(
          "Éxito",
          "Evento actualizado correctamente.",
          "success"
        );
      } else if (this.editMode() && this.groupId !== null) {
        response = await this.eventService.updateRecurrentGroup(
          this.groupId,
          payload
        );
        await Swal.fire(
          "Éxito",
          "Grupo recurrente actualizado correctamente.",
          "success"
        );
      } else if (this.eventType === "individual") {
        response = await this.eventService.createIndividualEvent(payload);
        await Swal.fire("Éxito", "Evento individual registrado.", "success");
      } else {
        response = await this.eventService.createRecurrentEvent(payload);
        await Swal.fire("Éxito", "Evento recurrente registrado.", "success");
      }

      localStorage.removeItem("reuseEventData");
      this.router.navigate(["dashboard/eventlist"]);
    } catch (error: any) {
      console.error("Error al registrar/actualizar evento:", error);
      const backendMessage =
        error?.error?.message ||
        error?.message ||
        "No se pudo completar la operación.";
      Swal.fire("Error", backendMessage, "error");
    }
  }

  private toLocalIsoStringForDatetimeInput(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }
}
