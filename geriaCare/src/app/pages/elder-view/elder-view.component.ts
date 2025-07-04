import { Component, inject, signal } from "@angular/core";
import { Ielder } from "../../interfaces/ielder";
import { ElderRegisterService } from "../../services/elder-register.service";
import { ActivatedRoute, RouterModule } from "@angular/router";
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

@Component({
  selector: "app-elder-view",
  imports: [DatePipe, CommonModule, RouterModule],
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

  async deleteActivity(activityId: number) {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la actividad permanentemente.",
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
          `${environment.apiUrl}/actividades/${activityId}`,
          {
            method: "DELETE",
            headers: { Authorization: token },
          }
        );

        if (!response.ok) throw new Error("Error al eliminar la actividad.");

        this.activities.update((list) =>
          list.filter((activity) => activity.id !== activityId)
        );

        await Swal.fire(
          "Eliminada",
          "La actividad ha sido eliminada correctamente.",
          "success"
        );
      } catch (error) {
        console.error("Error al eliminar la actividad:", error);
        await Swal.fire(
          "Error",
          "No se pudo eliminar la actividad. Intente nuevamente.",
          "error"
        );
      }
    }
  }

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
}
