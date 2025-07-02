import { Component, inject } from "@angular/core";
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
import { EventsService } from "../../services/events.service";

@Component({
  selector: "app-activities-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./activities-form.component.html",
  styleUrl: "./activities-form.component.css",
})
export class ActivitiesFormComponent {
  private elderService = inject(ElderRegisterService);
  private activitiesService = inject(ActivitiesService);
  private eventsService = inject(EventsService);
  elders: Ielder[] = [];

  activitiesForm = new FormGroup({
    persona_mayor_id: new FormControl("", [Validators.required]),
    nombre: new FormControl("", [Validators.required, Validators.minLength(2)]),
    categoria: new FormControl("", [Validators.required]),
    descripcion: new FormControl(""),
    es_recurrente: new FormControl("", [Validators.required]),

    fecha_inicio: new FormControl(""),
    fecha_fin: new FormControl(""),
    recordatorio: new FormControl(false),
    intervalo_horas: new FormControl(""),
    repeticiones: new FormControl(""),
  });
  loadElders = (async () => {
    try {
      const response = await this.elderService.getAllElders();
      this.elders = response.personasMayores;
    } catch (error) {
      console.error("Failed to load elders:", error);
    }
  })();
  async onSubmit() {
    if (this.activitiesForm.invalid) {
      this.activitiesForm.markAllAsTouched();
      console.warn("Form invalid:", this.activitiesForm.value);
      return;
    }

    const formValue = this.activitiesForm.value;
    const isRecurrent = formValue.es_recurrente === "1";

    const activityData = {
      persona_mayor_id: +formValue.persona_mayor_id!,
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
      es_recurrente: isRecurrent,
    };

    try {
      const response = await this.activitiesService.createActivity(activityData);
      const actividadId = response.actividad.id;

      if (activityData.es_recurrente) {
        await this.eventsService.createRecurrentEvent({
          actividad_id: actividadId,
          fecha_inicio: formValue.fecha_inicio,
          fecha_fin: formValue.fecha_fin!,
          recordatorio: formValue.recordatorio!,
          intervalo_horas: +formValue.intervalo_horas!,
          repeticiones: +formValue.repeticiones!,
        });
      } else {
        await this.eventsService.createEvent({
          actividad_id: Number(actividadId),
          fecha_inicio: formValue.fecha_inicio!,
          fecha_fin: formValue.fecha_fin!,
          recordatorio: formValue.recordatorio!,
        });
      }
      console.log("Activity creation response:", response);
      console.log("Activity created:", response);
      await Swal.fire({
        icon: "success",
        title: "Activity Created!",
        text: "The activity has been successfully registered.",
        confirmButtonColor: "#3085d6",
      });

      this.activitiesForm.reset();
    } catch (error) {
      console.error("Activity creation error:", error);

      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create the activity. Please try again later.",
        confirmButtonColor: "#d33",
      });
    }
  }
}
