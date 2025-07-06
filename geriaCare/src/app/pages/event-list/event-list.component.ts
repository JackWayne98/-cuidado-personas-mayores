import { Component, inject, signal } from "@angular/core";
import { EventActivityService } from "../../services/event-activity.service";
import { IeventResponse } from "../../interfaces/ievent-response";
import { ActivitiesService } from "../../services/activities.service";
import { ElderRegisterService } from "../../services/elder-register.service";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
@Component({
  selector: "app-event-list",
  imports: [DatePipe],
  templateUrl: "./event-list.component.html",
  styleUrl: "./event-list.component.css",
})
export class EventListComponent {
  private eventService = inject(EventActivityService);
  private activityService = inject(ActivitiesService);
  private elderService = inject(ElderRegisterService);
  private router = inject(Router);

  allEvents = signal<IeventResponse[]>([]);
  individualEvents = signal<IeventResponse[]>([]);
  groupedRecurrentEvents = signal<
    { grupoId: string; events: IeventResponse[] }[]
  >([]);
  activityElderNames = new Map<number, string>();

  isLoading = signal(true);
  error = signal<string | null>(null);

  eventsLoaded = (async () => {
    this.isLoading.set(true);
    try {
      const response = await this.eventService.getAllEvents();
      this.allEvents.set(response.events);

      const individuals = response.events.filter(
        (e) => !e.grupo_recurrencia_id
      );
      this.individualEvents.set(individuals);

      const grouped: Record<string, IeventResponse[]> = {};
      for (const event of response.events) {
        if (event.grupo_recurrencia_id) {
          if (!grouped[event.grupo_recurrencia_id])
            grouped[event.grupo_recurrencia_id] = [];
          grouped[event.grupo_recurrencia_id].push(event);
        }
      }
      this.groupedRecurrentEvents.set(
        Object.entries(grouped).map(([grupoId, events]) => ({
          grupoId,
          events,
        }))
      );

      const detailPromises = response.events.map(async (event) => {
        try {
          const actResp = await this.activityService.getActivityById(
            event.actividad_id
          );
          const actName = actResp.actividad.nombre;
          const actDescription = actResp.actividad.descripcion;
          const elderId = event.persona_mayor_id;

          if (elderId !== null && elderId !== undefined) {
            const elderResp = await this.elderService.getElderById(
              Number(elderId)
            );
            const elderName = `${elderResp.personaMayor.nombre} ${elderResp.personaMayor.apellido}`;
            this.activityElderNames.set(
              event.id,
              `${actName} - ${actDescription} (Persona: ${elderName})`
            );
          } else {
            console.warn(`Event ID ${event.id} has no persona_mayor_id.`);
            this.activityElderNames.set(
              event.id,
              `${actName} - ${actDescription} (Sin residente asociado)`
            );
          }
        } catch (error) {
          console.error("Error fetching details for event ID", event.id, error);
          this.activityElderNames.set(event.id, "Actividad desconocida");
        }
      });

      await Promise.all(detailPromises);
    } catch (error) {
      console.error("Error loading events:", error);
      this.error.set("No se pudieron cargar los eventos.");
    } finally {
      this.isLoading.set(false);
    }
  })();

  reuseIndividualEvent(event: IeventResponse) {
    const payload = {
      persona_mayor_id: event.persona_mayor_id,
      actividad_id: event.actividad_id,
      recordatorio: event.recordatorio,
    };
    localStorage.setItem("reuseEventData", JSON.stringify(payload));
    this.router.navigate(["dashboard/reusedeventupdate"]);
  }

  async deleteIndividualEvent(eventId: number) {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará el evento individual.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await this.eventService.deleteIndividualEvent(eventId);

        await this.router.navigateByUrl("/", { skipLocationChange: true });
        await this.router.navigate(["/dashboard/eventlist"]);

        await Swal.fire("Éxito", "Evento eliminado.", "success");
      } catch (e) {
        console.error("Error deleting event:", e);
        await Swal.fire("Error", "No se pudo eliminar el evento.", "error");
      }
    }
  }
  reuseRecurrentEvent(group: { grupoId: string; events: IeventResponse[] }) {
    const firstEvent = group.events[0];
    const payload = {
      persona_mayor_id: firstEvent.persona_mayor_id,
      actividad_id: firstEvent.actividad_id,
      recordatorio: firstEvent.recordatorio,
      eventType: "recurrente",
    };
    localStorage.setItem("reuseEventData", JSON.stringify(payload));
    this.router.navigate(["dashboard/reusedrecurrenteventupdate"]);
  }

  async deleteRecurrentGroup(groupId: string) {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará todo el grupo de eventos recurrentes.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await this.eventService.deleteRecurrentGroup(groupId);

        await this.router.navigateByUrl("/", { skipLocationChange: true });
        await this.router.navigate(["/dashboard/eventlist"]);

        await Swal.fire("Éxito", "Grupo recurrente eliminado.", "success");
      } catch (e) {
        console.error("Error deleting recurrent group:", e);
        await Swal.fire(
          "Error",
          "No se pudo eliminar el grupo recurrente.",
          "error"
        );
      }
    }
  }
}
