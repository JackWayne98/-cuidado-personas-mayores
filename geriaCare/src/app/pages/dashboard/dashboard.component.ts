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

  elders = signal<Ielder[]>([]);
  eldersWithDiets = signal<IelderWithDiets[]>([]);
  eldersWithPrescriptions = signal<IelderWithPrescriptions[]>([]);
  user = signal<Iuser | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  private loadDashboardEffect = effect(async () => {
    this.isLoading.set(true);
    try {
      // Load elders
      const eldersResponse = await this.elderService.getAllElders();
      const elders = eldersResponse.personasMayores;

      this.elders.set(elders);

      const eldersWithDietsData: IelderWithDiets[] = [];
      const eldersWithPrescriptionsData: IelderWithPrescriptions[] = [];

      for (const elder of elders) {
        // Diets
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

        // Prescriptions
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

      // Load user info
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
}
