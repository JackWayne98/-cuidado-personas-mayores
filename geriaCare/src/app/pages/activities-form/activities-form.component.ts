import { Component, effect, inject, signal } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivitiesService } from "../../services/activities.service";
import { ElderRegisterService } from "../../services/elder-register.service";
import { Ielder } from "../../interfaces/ielder";
import Swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-activities-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./activities-form.component.html",
  styleUrl: "./activities-form.component.css",
})
export class ActivitiesFormComponent {
  private activitiesService = inject(ActivitiesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  activityId = signal<number | null>(null);

  activitiesForm = new FormGroup({
    nombre: new FormControl("", [Validators.required, Validators.minLength(2)]),
    categoria: new FormControl("", Validators.required),
    descripcion: new FormControl("", Validators.required),
  });

  private loadActivityEffect = effect(async () => {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.isEditMode.set(true);
      this.activityId.set(+idParam);
      try {
        const response = await this.activitiesService.getActivityById(+idParam);
        const activity = response.actividad;

        this.activitiesForm.patchValue({
          nombre: activity.nombre,
          categoria: activity.categoria,
          descripcion: activity.descripcion,
        });
      } catch (error) {
        console.error("Failed to load activity:", error);
        await Swal.fire("Error", "No se pudo cargar la actividad.", "error");
        this.router.navigate(["/dashboard"]);
      }
    }
  });

  async onSubmit() {
    if (this.activitiesForm.invalid) {
      this.activitiesForm.markAllAsTouched();
      return;
    }

    const formValue = this.activitiesForm.getRawValue();

    const activityData = {
      nombre: formValue.nombre!,
      categoria: formValue.categoria! as
        | "medicación"
        | "terapia"
        | "ejercicio"
        | "alimentación"
        | "descanso"
        | "visita"
        | "ocio",
      descripcion: formValue.descripcion!,
    };

    try {
      let response;
      if (this.isEditMode()) {
        response = await this.activitiesService.updateActivity(
          this.activityId()!,
          activityData
        );
        console.log("Update API Response:", response);
        await Swal.fire(
          "Éxito",
          "Actividad actualizada correctamente.",
          "success"
        );
      } else {
        response = await this.activitiesService.createActivity(activityData);
        console.log("Create API Response:", response);
        await Swal.fire(
          "Éxito",
          "Actividad registrada correctamente.",
          "success"
        );
      }

      this.activitiesForm.reset();
      this.router.navigate(["/dashboard"]);
    } catch (error) {
      console.error("Activity submit error:", error);
      await Swal.fire("Error", "No se pudo guardar la actividad.", "error");
    }
  }
}
