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
  private eventId: number | null = null;
  private groupId: string | null = null; // 🔹 NEW: store recurrent group ID

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
    } catch (error) {
      console.error("Error loading activities:", error);
      Swal.fire("Error", "No se pudieron cargar las actividades.", "error");
    }
  })();

  private loadEffect = effect(() => {
    const idParam = this.route.snapshot.paramMap.get("id");
    const groupParamId = this.route.snapshot.paramMap.get("groupId");

    if (groupParamId) {
      this.editMode.set(true);
      this.groupId = groupParamId;
      this.loadRecurrentGroupData(groupParamId);
    } else if (idParam !== null) {
      // ✅ only if param exists
      const eventParamId = Number(idParam);
      if (!isNaN(eventParamId)) {
        this.editMode.set(true);
        this.eventId = eventParamId;
        this.loadEventData(eventParamId);
      }
    }
  });
  async loadEventData(eventId: number) {
    try {
      const response: IeventSingle = await this.eventService.getEventById(
        eventId
      );
      const event = response.eventoActividad;
      console.log("Loaded event for edit:", event);

      if (!event) throw new Error("No se encontró el evento en la respuesta.");

      this.selectedElderId = Number(event.persona_mayor_id);
      this.selectedActivityId = event.actividad_id;

      const startDate = new Date(event.fecha_inicio);
      const endDate = new Date(event.fecha_fin);

      this.fechaInicio = this.toLocalIsoStringForDatetimeInput(startDate);
      this.fechaFin = this.toLocalIsoStringForDatetimeInput(endDate);
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

      const firstEvent = groupEvents[0]; // take first event as representative

      console.log("Loaded recurrent group for edit:", groupEvents);

      this.eventType = "recurrente";
      this.selectedElderId = Number(firstEvent.persona_mayor_id);
      this.selectedActivityId = firstEvent.actividad_id;

      const startDate = new Date(firstEvent.fecha_inicio);
      const endDate = new Date(firstEvent.fecha_fin);

      this.fechaInicio = this.toLocalIsoStringForDatetimeInput(startDate);
      this.fechaFin = this.toLocalIsoStringForDatetimeInput(endDate);
      this.recordatorio = !!firstEvent.recordatorio;
      // this.intervaloHoras = firstEvent.intervalo_horas ?? null;
      // this.repeticiones = firstEvent.repeticiones ?? null;

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
      persona_mayor_id: this.selectedElderId.toString(),
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
        Swal.fire("Éxito", "Evento actualizado correctamente.", "success");
      } else if (this.editMode() && this.groupId !== null) {
        response = await this.eventService.updateRecurrentGroup(
          this.groupId,
          payload
        );
        Swal.fire(
          "Éxito",
          "Grupo recurrente actualizado correctamente.",
          "success"
        );
      } else if (this.eventType === "individual") {
        response = await this.eventService.createIndividualEvent(payload);
        Swal.fire("Éxito", "Evento individual registrado.", "success");
      } else {
        response = await this.eventService.createRecurrentEvent(payload);
        Swal.fire("Éxito", "Evento recurrente registrado.", "success");
      }
    } catch (error) {
      console.error("Error al registrar/actualizar evento:", error);
      Swal.fire("Error", "No se pudo completar la operación.", "error");
    }
  }

  private toLocalIsoStringForDatetimeInput(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  }
}
