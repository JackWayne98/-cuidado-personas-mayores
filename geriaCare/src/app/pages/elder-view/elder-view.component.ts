import { Component, inject, signal } from "@angular/core";
import { Ielder } from "../../interfaces/ielder";
import { ElderRegisterService } from "../../services/elder-register.service";
import { ActivatedRoute } from "@angular/router";
import { ActivitiesService } from "../../services/activities.service";
import { Iactivity } from "../../interfaces/iactivity";
import { PrescriptionsService } from "../../services/prescriptions.service";
import { IPrescription } from "../../interfaces/iprescriptions";
import { DietService } from "../../services/diet.service";
import { Idiet } from "../../interfaces/idiet";
import { CommonModule, DatePipe } from "@angular/common";
import { EmergencyContactService } from "../../services/emergency-contact.service";
import { IemergencyContact } from "../../interfaces/iemergency-contact";

@Component({
  selector: "app-elder-view",
  imports: [DatePipe, CommonModule],
  templateUrl: "./elder-view.component.html",
  styleUrl: "./elder-view.component.css",
})
export class ElderViewComponent {
  private elderService = inject(ElderRegisterService);
  private activityService = inject(ActivitiesService);
  private prescriptionsService = inject(PrescriptionsService);
  private dietService = inject(DietService);
  private emergencyContactService = inject(EmergencyContactService);
  private route = inject(ActivatedRoute);

  elder = signal<Ielder | null>(null);
  activities = signal<Iactivity[]>([]);
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

      const activityResponse =
        await this.activityService.getActivitiesByElderId(id);
      this.activities.set(activityResponse.actividades || []);

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
}
