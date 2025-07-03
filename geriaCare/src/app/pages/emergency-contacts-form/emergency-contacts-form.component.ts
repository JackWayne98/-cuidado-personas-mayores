import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ElderRegisterService } from "../../services/elder-register.service";
import { EmergencyContactService } from "../../services/emergency-contact.service";
import { Ielder } from "../../interfaces/ielder";
import Swal from "sweetalert2";

@Component({
  selector: "app-emergency-contacts-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./emergency-contacts-form.component.html",
  styleUrl: "./emergency-contacts-form.component.css",
})
export class EmergencyContactsFormComponent {
  private elderService = inject(ElderRegisterService);
  private emergencyService = inject(EmergencyContactService);

  elders: Ielder[] = [];

  emergencyContactForm = new FormGroup({
    persona_mayor_id: new FormControl("", [Validators.required]),
    nombre: new FormControl("", [Validators.required, Validators.minLength(2)]),
    telefono: new FormControl("", [
      Validators.required,
      Validators.pattern("^[0-9]{7,15}$"),
    ]),
    relacion: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
    ]),
    es_medico: new FormControl("", [Validators.required]),
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
    if (this.emergencyContactForm.invalid) {
      this.emergencyContactForm.markAllAsTouched();
      console.warn("Form invalid:", this.emergencyContactForm.value);
      return;
    }

    const formValue = this.emergencyContactForm.value;

    const contactData = {
      persona_mayor_id: +formValue.persona_mayor_id!,
      nombre: formValue.nombre!,
      telefono: formValue.telefono!,
      relacion: formValue.relacion!,
      es_medico: formValue.es_medico === "1",
    };

    try {
      const response = await this.emergencyService.createEmergencyContact(
        contactData
      );

      await Swal.fire({
        icon: "success",
        title: "Contact Created!",
        text: "The emergency contact has been successfully registered.",
        confirmButtonColor: "#3085d6",
      });

      this.emergencyContactForm.reset();
    } catch (error) {
      console.error("Emergency contact creation error:", error);

      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create the emergency contact. Please try again later.",
        confirmButtonColor: "#d33",
      });
    }
  }
}
