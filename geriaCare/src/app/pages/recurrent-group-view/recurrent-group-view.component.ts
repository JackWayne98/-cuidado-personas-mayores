import { Component, computed, effect, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink, RouterOutlet } from "@angular/router";
import { EventActivityService } from "../../services/event-activity.service";
import { ActivitiesService } from "../../services/activities.service";
import { IeventResponse } from "../../interfaces/ievent-response";
import Swal from "sweetalert2";
import { CommonModule, DatePipe } from "@angular/common";
import { IeventGroupResponse } from "../../interfaces/ievent-group";

@Component({
  selector: "app-recurrent-group-view",
  imports: [DatePipe, CommonModule],
  templateUrl: "./recurrent-group-view.component.html",
  styleUrl: "./recurrent-group-view.component.css",
})
export class RecurrentGroupViewComponent {
  private eventService = inject(EventActivityService);
  private activityService = inject(ActivitiesService);
  private route = inject(ActivatedRoute);

  events = signal<IeventResponse[]>([]);
  activityNames = new Map<number, string>();
  error = signal<string | null>(null);

  groupId = computed(() => this.route.snapshot.paramMap.get("groupid"));

  private loadEffect = effect(() => {
    const groupId = this.groupId();
    if (groupId) {
      this.loadEvents(groupId);
    } else {
      this.error.set("ID de grupo inválido");
    }
  });

  async loadEvents(groupId: string) {
    try {
      const response: IeventGroupResponse =
        await this.eventService.getRecurrentGroupEvents(groupId);

      const fetchedEvents = response.eventoActividades;
      if (!Array.isArray(fetchedEvents)) {
        throw new Error(
          "La respuesta del servidor no contiene eventos válidos."
        );
      }

      for (const event of fetchedEvents) {
        try {
          const activityResp = await this.activityService.getActivityById(
            event.actividad_id
          );
          this.activityNames.set(event.id, activityResp.actividad.nombre);
        } catch (e) {
          console.error(`Error fetching activity ${event.actividad_id}:`, e);
          this.activityNames.set(event.id, "Actividad desconocida");
        }
      }

      this.events.set(fetchedEvents);
    } catch (e) {
      console.error("Error loading recurrent group events:", e);
      this.error.set("No se pudieron cargar los eventos del grupo recurrente.");
    }
  }

  async changeEventStatus(eventId: number) {
    const result = await Swal.fire({
      title: "Cambiar estado del evento",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Completado",
      denyButtonText: "Cancelado",
      cancelButtonText: "Salir",
    });

    let newEstado: string | null = null;
    if (result.isConfirmed) newEstado = "completado";
    else if (result.isDenied) newEstado = "cancelado";

    if (newEstado) {
      try {
        await this.eventService.updateEventStatus(eventId, newEstado);
        this.events.update((events) =>
          events.map((ev) =>
            ev.id === eventId ? { ...ev, estado: newEstado! } : ev
          )
        );
        await Swal.fire(
          "Éxito",
          `El estado se actualizó a "${newEstado}".`,
          "success"
        );
      } catch (error) {
        console.error("Error updating event status:", error);
        await Swal.fire("Error", "No se pudo actualizar el estado.", "error");
      }
    }
  }
}
