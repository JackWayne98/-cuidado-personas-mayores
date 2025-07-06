import { Component, inject, signal } from "@angular/core";
import { Ielder } from "../../interfaces/ielder";
import { ElderRegisterService } from "../../services/elder-register.service";
import { ActivatedRoute, RouterModule, RouterOutlet } from "@angular/router";
import { ActivitiesService } from "../../services/activities.service";
import { Iactivity } from "../../interfaces/iactivity";
import { PrescriptionsService } from "../../services/prescriptions.service";
import { IPrescription } from "../../interfaces/iprescriptions";
import { DietService } from "../../services/diet.service";
import { Idiet } from "../../interfaces/idiet";
import { CommonModule, DatePipe } from "@angular/common";
import { EmergencyContactService } from "../../services/emergency-contact.service";
import { IemergencyContact } from "../../interfaces/iemergency-contact";
import Swal from "sweetalert2";
import { environment } from "../../../environments/enviroment";
import { EventActivityService } from "../../services/event-activity.service";
import { IeventResponse } from "../../interfaces/ievent-response";

@Component({
  selector: "app-elder-view",
  imports: [DatePipe, CommonModule, RouterModule],
  templateUrl: "./elder-view.component.html",
  styleUrl: "./elder-view.component.css",
})
export class ElderViewComponent {
  private elderService = inject(ElderRegisterService);
  private eventService = inject(EventActivityService);
  private activityService = inject(ActivitiesService);
  private prescriptionsService = inject(PrescriptionsService);
  private dietService = inject(DietService);
  private emergencyContactService = inject(EmergencyContactService);
  private route = inject(ActivatedRoute);

  elder = signal<Ielder | null>(null);
  events = signal<IeventResponse[]>([]);
  singleEvents = signal<IeventResponse[]>([]);
  recurrentEvents = signal<IeventResponse[]>([]);
  activityNames = new Map<number, string>();
  prescriptions = signal<IPrescription[]>([]);
  diets = signal<Idiet[]>([]);
  emergencyContacts = signal<IemergencyContact[]>([]);
  error = signal<string | null>(null);

  _loadData = (async () => {
    try {
      const id = Number(this.route.snapshot.paramMap.get("id"));
      if (!id) {
        this.error.set("ID inválido");
        return;
      }

      const elderResponse = await this.elderService.getElderById(id);
      this.elder.set(elderResponse.personaMayor);

      const eventsResponse = await this.eventService.getAllEvents();
      const elderEvents = eventsResponse.events.filter(
        (event) => Number(event.persona_mayor_id) === id
      );

      const singleEvents: IeventResponse[] = [];
      const recurrentGroups: Record<string, IeventResponse[]> = {};

      for (const event of elderEvents) {
        try {
          const activityResp = await this.activityService.getActivityById(
            event.actividad_id
          );
          this.activityNames.set(event.id, activityResp.actividad.nombre);
        } catch (e) {
          console.error(`Error fetching activity ${event.actividad_id}:`, e);
          this.activityNames.set(event.id, "Actividad desconocida");
        }

        if (event.grupo_recurrencia_id) {
          const groupId = event.grupo_recurrencia_id;
          if (!recurrentGroups[groupId]) recurrentGroups[groupId] = [];
          recurrentGroups[groupId].push(event);
        } else {
          singleEvents.push(event);
        }
      }

      const mergedRecurrentEvents: IeventResponse[] = Object.entries(
        recurrentGroups
      ).map(([groupId, events]) => {
        const startDates = events.map((e) => new Date(e.fecha_inicio));
        const endDates = events.map((e) => new Date(e.fecha_fin));

        const earliestStart = new Date(
          Math.min(...startDates.map((d) => d.getTime()))
        );
        const latestEnd = new Date(
          Math.max(...endDates.map((d) => d.getTime()))
        );

        return {
          ...events[0],
          fecha_inicio: earliestStart.toISOString(),
          fecha_fin: latestEnd.toISOString(),
        };
      });

      this.singleEvents.set(singleEvents);
      this.recurrentEvents.set(mergedRecurrentEvents);
      this.events.set([...singleEvents, ...mergedRecurrentEvents]);

      const prescriptionsResponse =
        await this.prescriptionsService.getPrescriptionsByElderId(id);
      this.prescriptions.set(prescriptionsResponse.recetas || []);

      const dietsResponse = await this.dietService.getDietsByElderId(id);
      this.diets.set(dietsResponse.dietas || []);

      const contactsResponse =
        await this.emergencyContactService.getEmergencyContactsByElderId(id);
      this.emergencyContacts.set(contactsResponse.contactos || []);
    } catch (err) {
      console.error("Error loading data:", err);
      this.error.set(
        "No se pudo cargar la información del residente, actividades, recetas, dietas o contactos."
      );
    }
  })();

  async deletePrescription(prescriptionId: number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la receta permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await this.prescriptionsService.deletePrescription(prescriptionId);

        this.prescriptions.update((list) =>
          list.filter((presc) => presc.id !== prescriptionId)
        );

        await Swal.fire(
          "Eliminada",
          "La receta ha sido eliminada correctamente.",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar la receta:", error);
        await Swal.fire(
          "Error",
          "No se pudo eliminar la receta. Intente nuevamente.",
          "error"
        );
      }
    }
  }

  async deleteDiet(dietId: number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la dieta permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticación no encontrado.");

        const response = await fetch(
          `${environment.apiUrl}/dietas-alimenticias/${dietId}`,
          {
            method: "DELETE",
            headers: { Authorization: token },
          }
        );

        if (!response.ok) throw new Error("Error al eliminar la dieta.");

        this.diets.update((list) => list.filter((diet) => diet.id !== dietId));

        await Swal.fire(
          "Eliminada",
          "La dieta ha sido eliminada correctamente.",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar la dieta:", error);
        await Swal.fire(
          "Error",
          "No se pudo eliminar la dieta. Intente nuevamente.",
          "error"
        );
      }
    }
  }

  async deleteEmergencyContact(contactId: number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el contacto de emergencia permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticación no encontrado.");

        const response = await fetch(
          `${environment.apiUrl}/contactos-emergencia/${contactId}`,
          {
            method: "DELETE",
            headers: { Authorization: token },
          }
        );

        if (!response.ok) throw new Error("Error al eliminar el contacto.");

        this.emergencyContacts.update((list) =>
          list.filter((contact) => contact.id !== contactId)
        );

        await Swal.fire(
          "Eliminado",
          "El contacto de emergencia ha sido eliminado correctamente.",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar el contacto de emergencia:", error);
        await Swal.fire(
          "Error",
          "No se pudo eliminar el contacto de emergencia. Intente nuevamente.",
          "error"
        );
      }
    }
  }
  async deleteSingleEvent(eventId: number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el evento individual permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await this.eventService.deleteIndividualEvent(eventId);
        this.singleEvents.update((list) =>
          list.filter((ev) => ev.id !== eventId)
        );
        await Swal.fire(
          "Eliminado",
          "El evento individual ha sido eliminado correctamente.",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar el evento individual:", error);
        await Swal.fire(
          "Error",
          "No se pudo eliminar el evento individual. Intente nuevamente.",
          "error"
        );
      }
    }
  }

  async deleteRecurrentEvent(groupId: string) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el grupo de eventos recurrentes permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await this.eventService.deleteRecurrentGroup(groupId);
        this.recurrentEvents.update((list) =>
          list.filter((ev) => ev.grupo_recurrencia_id !== groupId)
        );
        await Swal.fire(
          "Eliminado",
          "El grupo de eventos recurrentes ha sido eliminado correctamente.",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar el grupo de eventos:", error);
        await Swal.fire(
          "Error",
          "No se pudo eliminar el grupo de eventos. Intente nuevamente.",
          "error"
        );
      }
    }
  }
  async changeEventStatus(eventId: number) {
    const result = await Swal.fire({
      title: "Cambiar estado",
      text: "Selecciona el nuevo estado para este evento:",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Completado",
      denyButtonText: "Cancelado",
      cancelButtonText: "Salir",
    });

    let newEstado: string | null = null;
    if (result.isConfirmed) {
      newEstado = "completado";
    } else if (result.isDenied) {
      newEstado = "cancelado";
    } else {
      return;
    }

    try {
      await this.eventService.updateEventStatus(eventId, newEstado);
      this.singleEvents.update((list) =>
        list.map((ev) =>
          ev.id === eventId ? { ...ev, estado: newEstado! } : ev
        )
      );
      await Swal.fire(
        "Actualizado",
        `El estado ha sido cambiado a '${newEstado}'.`,
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar el estado del evento:", error);
      await Swal.fire(
        "Error",
        "No se pudo actualizar el estado. Intente nuevamente.",
        "error"
      );
    }
  }
}
