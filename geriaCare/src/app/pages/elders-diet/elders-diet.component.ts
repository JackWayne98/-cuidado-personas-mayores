import { Component, effect, inject, signal } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ElderRegisterService } from "../../services/elder-register.service";
import { DietService } from "../../services/diet.service";
import { Ielder } from "../../interfaces/ielder";

import Swal from "sweetalert2";
import { Idiet } from "../../interfaces/idiet";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-elders-diet",
  imports: [ReactiveFormsModule],
  templateUrl: "./elders-diet.component.html",
  styleUrl: "./elders-diet.component.css",
})
export class EldersDietComponent {
  private elderService = inject(ElderRegisterService);
  private dietService = inject(DietService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  elders = signal<Ielder[]>([]);
  isEditMode = signal(false);
  dietId = signal<number | null>(null);

  dietForm = new FormGroup({
    persona_mayor_id: new FormControl("", Validators.required),
    descripcion: new FormControl("", Validators.required),
    restricciones: new FormControl("", Validators.required),
    recomendaciones: new FormControl("", Validators.required),
    fecha_inicio: new FormControl("", Validators.required),
    fecha_fin: new FormControl("", Validators.required),
    es_activa: new FormControl("", Validators.required),
  });

  loadElders = (async () => {
    try {
      const response = await this.elderService.getAllElders();
      this.elders.set(response.personasMayores);
    } catch (error) {
      console.error("Failed to load elders:", error);
    }
  })();

  private loadDietEffect = effect(async () => {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.isEditMode.set(true);
      this.dietId.set(+idParam);
      try {
        const response = await this.dietService.getDietById(+idParam);
        const diet = response.dieta;

        this.dietForm.patchValue({
          persona_mayor_id: diet.persona_mayor_id.toString(),
          descripcion: diet.descripcion,
          restricciones: diet.restricciones,
          recomendaciones: diet.recomendaciones,
          fecha_inicio: diet.fecha_inicio ? diet.fecha_inicio.slice(0, 10) : "",
          fecha_fin: diet.fecha_fin ? diet.fecha_fin.slice(0, 10) : "",
          es_activa: diet.es_activa ? "1" : "0",
        });

        // ✅ Disable elder selection in edit mode:
        this.dietForm.get("persona_mayor_id")?.disable();
      } catch (error) {
        console.error("Failed to load diet:", error);
        await Swal.fire("Error", "No se pudo cargar la dieta.", "error");
        this.router.navigate(["/dashboard"]);
      }
    }
  });

  async onSubmit() {
    if (this.dietForm.invalid) {
      this.dietForm.markAllAsTouched();
      return;
    }

    const formValue = this.dietForm.getRawValue(); // include disabled fields

    const dietData = {
      persona_mayor_id: +formValue.persona_mayor_id!,
      descripcion: formValue.descripcion!,
      restricciones: formValue.restricciones!,
      recomendaciones: formValue.recomendaciones!,
      fecha_inicio: formValue.fecha_inicio!,
      fecha_fin: formValue.fecha_fin!,
      es_activa: formValue.es_activa === "1",
    };

    try {
      let response;
      if (this.isEditMode()) {
        response = await this.dietService.updateDiet(this.dietId()!, dietData);
        console.log("Update API Response:", response);
        await Swal.fire("Éxito", "Dieta actualizada correctamente.", "success");
      } else {
        response = await this.dietService.createDiet(dietData);
        console.log("Create API Response:", response);
        await Swal.fire("Éxito", "Dieta registrada correctamente.", "success");
      }

      this.dietForm.reset();
      this.router.navigate(["/dashboard"]);
    } catch (error) {
      console.error("Diet submit error:", error);
      await Swal.fire("Error", "No se pudo guardar la dieta.", "error");
    }
  }
}
