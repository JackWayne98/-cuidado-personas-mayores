import { Component, inject, signal } from "@angular/core";
import { EventActivityService } from "../../services/event-activity.service";
import { IeventResponse } from "../../interfaces/ievent-response";
import { ActivitiesService } from "../../services/activities.service";
import { ElderRegisterService } from "../../services/elder-register.service";
import { DatePipe } from "@angular/common";

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

      // preload activity and elder names concurrently
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
          console.error(
            "Error fetching details for event/activity ID",
            event.id,
            error
          );
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
}
