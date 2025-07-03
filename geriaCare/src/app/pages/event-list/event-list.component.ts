import { Component, inject, signal } from "@angular/core";
import { EventActivityService } from "../../services/event-activity.service";
import { IeventResponse } from "../../interfaces/ievent-response";
import { ActivitiesService } from "../../services/activities.service";
import { ElderRegisterService } from "../../services/elder-register.service";

@Component({
  selector: "app-event-list",
  imports: [],
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

      // preload activity and elder names
      const activityIds = new Set(response.events.map((e) => e.actividad_id));
      for (const activityId of activityIds) {
        try {
          const actResp = await this.activityService.getActivityById(
            activityId
          );
          const actName = actResp.actividad.nombre;
          const elderId = actResp.actividad.persona_mayor_id;

          const elderResp = await this.elderService.getElderById(elderId);
          const elderName = `${elderResp.personaMayor.nombre} ${elderResp.personaMayor.apellido}`;

          this.activityElderNames.set(
            activityId,
            `${actName} (Persona: ${elderName})`
          );
        } catch (error) {
          console.error(
            "Error fetching details for activity ID",
            activityId,
            error
          );
          this.activityElderNames.set(activityId, "Desconocida");
        }
      }
    } catch (error) {
      console.error("Error loading events:", error);
      this.error.set("No se pudieron cargar los eventos.");
    } finally {
      this.isLoading.set(false);
    }
  })();
}
