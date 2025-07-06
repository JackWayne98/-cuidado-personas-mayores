import { Component, effect, inject, signal } from "@angular/core";
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ElderRegisterService } from "../../services/elder-register.service";
import Swal from "sweetalert2";
import { Ielder } from "../../interfaces/ielder";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
@Component({
  selector: "app-register-elderly-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./register-elderly-form.component.html",
  styleUrl: "./register-elderly-form.component.css",
})
export class RegisterElderlyFormComponent {
  private elderService = inject(ElderRegisterService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  elderId = signal<number | null>(null);

  elderForm = new FormGroup({
    nombre: new FormControl("", Validators.required),
    apellido: new FormControl("", Validators.required),
    fecha_nacimiento: new FormControl("", Validators.required),
    genero: new FormControl("", Validators.required),
    movilidad: new FormControl(""),
    condiciones_medicas: new FormControl(""),
    notas_generales: new FormControl(""),
    relacion: new FormControl("", Validators.required),
  });
  private loadElderEffect = effect(async () => {
    const idParam = this.route.snapshot.paramMap.get("_id");
    if (idParam) {
      this.isEditMode.set(true);
      this.elderId.set(+idParam);
      try {
        const response = await this.elderService.getElderById(+idParam);

        const elder = response.personaMayor;

        this.elderForm.patchValue({
          nombre: elder.nombre,
          apellido: elder.apellido,
          fecha_nacimiento: elder.fecha_nacimiento
            ? elder.fecha_nacimiento.slice(0, 10)
            : "", // format YYYY-MM-DD
          genero: elder.genero,
          movilidad: elder.movilidad || "",
          condiciones_medicas: elder.condiciones_medicas || "",
          notas_generales: elder.notas_generales || "",
          relacion: elder.relacion,
        });
      } catch (error) {
        console.error("Failed to load elder:", error);
        Swal.fire("Error", "Could not load elder data.", "error");
        this.router.navigate(["/dashboard/elderlist"]);
      }
    }
  });
  async onSubmit() {
    if (this.elderForm.invalid) {
      this.elderForm.markAllAsTouched();
      Swal.fire(
        "Campos incompletos",
        "Por favor completa todos los campos requeridos antes de continuar.",
        "error"
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire(
        "Error",
        "You must be logged in to register or update an elder.",
        "error"
      );
      return;
    }

    try {
      const formData: Ielder = this.elderForm.value as unknown as Ielder;
      let response;

      if (this.isEditMode()) {
        response = await this.elderService.editElder(this.elderId()!, formData);
        Swal.fire("Success", "Elder updated successfully.", "success");
      } else {
        response = await this.elderService.registerElder(formData);
        Swal.fire("Success", "Elder registered successfully.", "success");
      }

      this.elderForm.reset();
      this.router.navigate(["/dashboard/elderlist"]);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to save elder data.", "error");
    }
  }
}
