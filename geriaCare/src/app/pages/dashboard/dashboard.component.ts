import { Component, effect, inject, signal } from "@angular/core";
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

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, DatePipe],
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

  elders = signal<Ielder[]>([]);
  eldersWithDiets = signal<IelderWithDiets[]>([]);
  eldersWithPrescriptions = signal<IelderWithPrescriptions[]>([]);
  todayEvents = signal<IeventResponse[]>([]);
  user = signal<Iuser | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  activitiesMap = new Map<number, Iactivity>(); // ✅ Expose activities map for template

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

  private loadEventsEffect = effect(async () => {
    try {
      const elders = this.elders();
      if (elders.length === 0) return;

      const eventsResponse = await this.eventService.getAllEvents();
      this.activitiesMap.clear(); // ✅ clear previous activities
      const today = new Date().toISOString().split("T")[0];
      const eventsToday: IeventResponse[] = [];

      for (const elder of elders) {
        const activitiesResponse =
          await this.activitiesService.getActivitiesByElderId(elder.id!);
        for (const activity of activitiesResponse.actividades || []) {
          this.activitiesMap.set(activity.id!, activity);
        }
      }

      for (const event of eventsResponse.events || []) {
        const activity = this.activitiesMap.get(event.actividad_id);
        if (!activity) continue;

        if (activity.es_recurrente) {
          const startDate = new Date(event.fecha_inicio)
            .toISOString()
            .split("T")[0];
          const endDate = new Date(event.fecha_fin).toISOString().split("T")[0];
          if (today >= startDate && today <= endDate) {
            eventsToday.push(event);
          }
        } else {
          const eventDate = new Date(event.fecha_inicio)
            .toISOString()
            .split("T")[0];
          if (eventDate === today) {
            eventsToday.push(event);
          }
        }
      }

      eventsToday.sort(
        (a, b) =>
          new Date(a.fecha_inicio).getTime() -
          new Date(b.fecha_inicio).getTime()
      );
      this.todayEvents.set(eventsToday);
    } catch (err) {
      console.error("Error loading today's events:", err);
    }
  });
}
