import { Component, effect, inject, signal } from "@angular/core";
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
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-emergency-contacts-form",
  imports: [ReactiveFormsModule],
  templateUrl: "./emergency-contacts-form.component.html",
  styleUrl: "./emergency-contacts-form.component.css",
})
export class EmergencyContactsFormComponent {
  private elderService = inject(ElderRegisterService);
  private emergencyService = inject(EmergencyContactService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  elders = signal<Ielder[]>([]);
  isEditMode = signal(false);
  contactId = signal<number | null>(null);

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

  // Load elders on component load
  loadElders = (async () => {
    try {
      const response = await this.elderService.getAllElders();
      this.elders.set(response.personasMayores);
    } catch (error) {
      console.error("Failed to load elders:", error);
    }
  })();

  // Load emergency contact if edit mode is detected via route param
  private loadContactEffect = effect(async () => {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.isEditMode.set(true);
      this.contactId.set(+idParam);
      try {
        const response = await this.emergencyService.getEmergencyContactById(
          +idParam
        );
        const contact = response.contacto;

        this.emergencyContactForm.patchValue({
          persona_mayor_id: contact.persona_mayor_id.toString(),
          nombre: contact.nombre,
          telefono: contact.telefono,
          relacion: contact.relacion,
          es_medico: contact.es_medico ? "1" : "0",
        });

        this.emergencyContactForm.get("persona_mayor_id")?.disable();
      } catch (error) {
        console.error("Failed to load emergency contact:", error);
        await Swal.fire("Error", "No se pudo cargar el contacto.", "error");
        this.router.navigate(["/dashboard"]);
      }
    }
  });

  async onSubmit() {
    if (this.emergencyContactForm.invalid) {
      this.emergencyContactForm.markAllAsTouched();
      console.warn("Form invalid:", this.emergencyContactForm.value);
      return;
    }

    const formValue = this.emergencyContactForm.getRawValue();

    const contactData = {
      persona_mayor_id: +formValue.persona_mayor_id!,
      nombre: formValue.nombre!,
      telefono: formValue.telefono!,
      relacion: formValue.relacion!,
      es_medico: formValue.es_medico === "1",
    };

    try {
      let response;
      if (this.isEditMode()) {
        response = await this.emergencyService.updateEmergencyContact(
          this.contactId()!,
          contactData
        );
        console.log("Update API Response:", response);
        await Swal.fire(
          "Éxito",
          "Contacto de emergencia actualizado correctamente.",
          "success"
        );
      } else {
        response = await this.emergencyService.createEmergencyContact(
          contactData
        );
        console.log("Create API Response:", response);
        await Swal.fire(
          "Éxito",
          "Contacto de emergencia registrado correctamente.",
          "success"
        );
      }

      this.emergencyContactForm.reset();
      this.router.navigate(["/dashboard"]);
    } catch (error) {
      console.error("Emergency contact submit error:", error);
      await Swal.fire("Error", "No se pudo guardar el contacto.", "error");
    }
  }
}
