import { Component, effect, inject, signal } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { ElderRegisterService } from "../../services/elder-register.service";
import { Ielder } from "../../interfaces/ielder";
import Swal from "sweetalert2";
import { IPrescription } from "../../interfaces/iprescriptions";
import { PrescriptionsService } from "../../services/prescriptions.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-elders-prescriptions",
  imports: [ReactiveFormsModule],
  templateUrl: "./elders-prescriptions.component.html",
  styleUrl: "./elders-prescriptions.component.css",
})
export class EldersPrescriptionsComponent {
  private elderService = inject(ElderRegisterService);
  private prescriptionService = inject(PrescriptionsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  elders = signal<Ielder[]>([]);
  isLoading = signal(true);
  isEditMode = signal(false);
  prescriptionId = signal<number | null>(null);

  prescriptionForm = new FormGroup({
    persona_mayor_id: new FormControl("", Validators.required),
    medicamento: new FormControl("", Validators.required),
    dosis: new FormControl("", Validators.required),
    frecuencia: new FormControl("", Validators.required),
    fecha_inicio: new FormControl("", Validators.required),
    fecha_fin: new FormControl("", Validators.required),
    prescrita_por: new FormControl("", Validators.required),
    // archivo_pdf: new FormControl(""),
  });

  loadElders = (async () => {
    this.isLoading.set(true);
    try {
      const response = await this.elderService.getAllElders();
      this.elders.set(response.personasMayores);
    } catch (error) {
      console.error("Failed to load elders:", error);
    } finally {
      this.isLoading.set(false);
    }
  })();

  private loadPrescriptionEffect = effect(async () => {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.isEditMode.set(true);
      this.prescriptionId.set(+idParam);
      try {
        const response = await this.prescriptionService.getPrescriptionById(
          +idParam
        );
        const prescription = response.receta;

        this.prescriptionForm.patchValue({
          persona_mayor_id: prescription.persona_mayor_id.toString(),
          medicamento: prescription.medicamento,
          dosis: prescription.dosis,
          frecuencia: prescription.frecuencia,
          fecha_inicio: prescription.fecha_inicio
            ? prescription.fecha_inicio.slice(0, 16)
            : "",
          fecha_fin: prescription.fecha_fin
            ? prescription.fecha_fin.slice(0, 16)
            : "",
          prescrita_por: prescription.prescrita_por,
          // archivo_pdf: prescription.archivo_pdf || "",
        });

        this.prescriptionForm.get("persona_mayor_id")?.disable();
      } catch (error) {
        console.error("Failed to load prescription:", error);
        await Swal.fire(
          "Error",
          "No se pudo cargar la receta médica.",
          "error"
        );
        this.router.navigate(["/dashboard"]);
      }
    }
  });

  async onSubmit() {
    if (this.prescriptionForm.invalid) {
      this.prescriptionForm.markAllAsTouched();
      return;
    }

    const formValue = this.prescriptionForm.getRawValue();

    const prescriptionData: IPrescription = {
      persona_mayor_id: +formValue.persona_mayor_id!,
      medicamento: formValue.medicamento!,
      dosis: formValue.dosis!,
      frecuencia: formValue.frecuencia!,
      fecha_inicio: formValue.fecha_inicio!,
      fecha_fin: formValue.fecha_fin!,
      prescrita_por: formValue.prescrita_por!,
      // archivo_pdf: formValue.archivo_pdf || undefined,
    };

    try {
      let response;
      if (this.isEditMode()) {
        response = await this.prescriptionService.updatePrescription(
          this.prescriptionId()!,
          prescriptionData
        );
        console.log("Update API Response:", response);
        await Swal.fire(
          "Éxito",
          "Receta actualizada correctamente.",
          "success"
        );
      } else {
        response = await this.prescriptionService.createPrescription(
          prescriptionData
        );
        console.log("Create API Response:", response);
        await Swal.fire("Éxito", "Receta registrada correctamente.", "success");
      }

      this.prescriptionForm.reset();
      this.router.navigate(["/dashboard"]);
    } catch (error) {
      console.error("Prescription submit error:", error);
      await Swal.fire("Error", "No se pudo guardar la receta.", "error");
    }
  }
}
