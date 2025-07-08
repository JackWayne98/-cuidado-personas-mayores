import { Component, effect, inject, signal, computed } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ElderRegisterService } from "../../services/elder-register.service";
import { Ielder } from "../../interfaces/ielder";
import { Iuser } from "../../interfaces/iuser";
import { AuthService } from "../../services/auth.service";
import { DietService } from "../../services/diet.service";
import { IelderWithDiets } from "../../interfaces/ielder-with-diets";
import { PrescriptionsService } from "../../services/prescriptions.service";
import { IelderWithPrescriptions } from "../../interfaces/ielder-with-prescriptions";
import { EventActivityService } from "../../services/event-activity.service";
import { IeventResponse } from "../../interfaces/ievent-response";
import { ActivitiesService } from "../../services/activities.service";
import { Iactivity } from "../../interfaces/iactivity";
import { RouterOutlet } from "@angular/router";
import Swal from "sweetalert2";
import { FormsModule, NgModel } from "@angular/forms";
import { EmergencyContactService } from "../../services/emergency-contact.service";
import { IemergencyContact } from "../../interfaces/iemergency-contact";
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  private elderService = inject(ElderRegisterService);
  private dietService = inject(DietService);
  private prescriptionsService = inject(PrescriptionsService);
  private authService = inject(AuthService);
  private eventService = inject(EventActivityService);
  private activitiesService = inject(ActivitiesService);
  private emergencyService = inject(EmergencyContactService);

  elders = signal<Ielder[]>([]);
  eldersWithDiets = signal<IelderWithDiets[]>([]);
  eldersWithPrescriptions = signal<IelderWithPrescriptions[]>([]);
  todayEvents = signal<IeventResponse[]>([]);
  user = signal<Iuser | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  selectedElderId = signal<number | null>(null);
  selectedElderContacts = signal<IemergencyContact[]>([]);
  activitiesMap = new Map<number, Iactivity>();

  get weekDays(): string[] {
    return [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
  }

  get weekDayKeys(): string[] {
    return this.weekDays;
  }

  filteredEvents = computed(() => {
    const elderId = this.selectedElderId();
    if (!elderId) return this.todayEvents();
    return this.todayEvents().filter(
      (e) => Number(e.persona_mayor_id) === elderId
    );
  });

  weeklyEventsByDay = computed(() => {
    const grouped: { [day: string]: IeventResponse[] } = {
      domingo: [],
      lunes: [],
      martes: [],
      miércoles: [],
      jueves: [],
      viernes: [],
      sábado: [],
    };

    for (const event of this.filteredEvents()) {
      const date = new Date(event.fecha_inicio);
      const dayName = this.weekDays[date.getDay()];
      grouped[dayName].push(event);
    }

    for (const day of this.weekDays) {
      grouped[day].sort(
        (a, b) =>
          new Date(a.fecha_inicio).getTime() -
          new Date(b.fecha_inicio).getTime()
      );
    }

    return grouped;
  });

  private watchSelectedElderEffect = effect(async () => {
    const elderId = this.selectedElderId();
    if (elderId) {
      try {
        const res = await this.emergencyService.getEmergencyContactsByElderId(
          elderId
        );
        this.selectedElderContacts.set(res.contactos || []);
      } catch (err) {
        console.error("Error loading emergency contacts:", err);
        this.selectedElderContacts.set([]);
      }
    } else {
      this.selectedElderContacts.set([]);
    }
  });

  private loadDashboardEffect = effect(async () => {
    this.isLoading.set(true);
    try {
      const eldersResponse = await this.elderService.getAllElders();
      const elders = eldersResponse.personasMayores;
      this.elders.set(elders);

      const eldersWithDietsData: IelderWithDiets[] = [];
      const eldersWithPrescriptionsData: IelderWithPrescriptions[] = [];

      for (const elder of elders) {
        try {
          const dietsResponse = await this.dietService.getDietsByElderId(
            elder.id!
          );
          eldersWithDietsData.push({
            elder,
            diets: dietsResponse.dietas || [],
          });
        } catch (dietErr) {
          console.error(`Error loading diets for elder ${elder.id}:`, dietErr);
          eldersWithDietsData.push({ elder, diets: [] });
        }

        try {
          const prescriptionsResponse =
            await this.prescriptionsService.getPrescriptionsByElderId(
              elder.id!
            );
          eldersWithPrescriptionsData.push({
            elder,
            prescriptions: prescriptionsResponse.recetas || [],
          });
        } catch (prescErr) {
          console.error(
            `Error loading prescriptions for elder ${elder.id}:`,
            prescErr
          );
          eldersWithPrescriptionsData.push({ elder, prescriptions: [] });
        }
      }

      this.eldersWithDiets.set(eldersWithDietsData);
      this.eldersWithPrescriptions.set(eldersWithPrescriptionsData);

      const userId = localStorage.getItem("user_id");
      if (!userId) {
        this.error.set("No se encontró el ID del usuario.");
        return;
      }

      const userResponse = await this.authService.getUserById(+userId);
      this.user.set(userResponse.user);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      this.error.set("No se pudieron cargar los datos del dashboard.");
    } finally {
      this.isLoading.set(false);
    }
  });

  private loadWeeklyEventsEffect = effect(async () => {
    try {
      const elders = this.elders();
      if (elders.length === 0) return;

      const eventsResponse = await this.eventService.getAllEvents();
      const allEvents = eventsResponse.events || [];

      this.activitiesMap.clear();

      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const eventsThisWeek: IeventResponse[] = [];

      for (const elder of elders) {
        const elderEvents = allEvents.filter(
          (event) => Number(event.persona_mayor_id) === elder.id
        );

        for (const event of elderEvents) {
          const eventStart = new Date(event.fecha_inicio);
          if (eventStart >= startOfWeek && eventStart <= endOfWeek) {
            eventsThisWeek.push(event);

            if (!this.activitiesMap.has(event.actividad_id)) {
              try {
                const activityResponse =
                  await this.activitiesService.getActivityById(
                    event.actividad_id
                  );
                this.activitiesMap.set(
                  event.actividad_id,
                  activityResponse.actividad
                );
              } catch (err) {
                console.error(
                  `Error loading activity ${event.actividad_id}:`,
                  err
                );
              }
            }
          }
        }
      }

      eventsThisWeek.sort(
        (a, b) =>
          new Date(a.fecha_inicio).getTime() -
          new Date(b.fecha_inicio).getTime()
      );

      this.todayEvents.set(eventsThisWeek);
    } catch (err) {
      console.error("Error loading weekly events:", err);
      this.todayEvents.set([]);
    }
  });

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
      this.todayEvents.update((events) =>
        events.map((e) => (e.id === eventId ? { ...e, estado: newEstado! } : e))
      );
      await Swal.fire(
        "Actualizado",
        `El estado ha sido cambiado a '${newEstado}'.`,
        "success"
      );
    } catch (error) {
      console.error("Error updating event status:", error);
      await Swal.fire(
        "Error",
        "No se pudo actualizar el estado. Intente nuevamente.",
        "error"
      );
    }
  }
  getElderFullNameById(id: number): string {
    const elder = this.elders().find((e) => e.id === id);
    return elder
      ? `${elder.nombre} ${elder.apellido}`
      : "Residente desconocido";
  }
}
