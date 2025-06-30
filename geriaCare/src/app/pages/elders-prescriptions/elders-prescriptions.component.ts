import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ElderRegisterService } from '../../services/elder-register.service';
import { Ielder } from '../../interfaces/ielder';
import Swal from 'sweetalert2';
import { IPrescription } from '../../interfaces/iprescriptions';
import { PrescriptionsService } from '../../services/prescriptions.service';

@Component({
  selector: 'app-elders-prescriptions',
  imports: [ReactiveFormsModule],
  templateUrl: './elders-prescriptions.component.html',
  styleUrl: './elders-prescriptions.component.css',
})
export class EldersPrescriptionsComponent {
  private elderService = inject(ElderRegisterService);
  private prescriptionService = inject(PrescriptionsService);

  elders = signal<Ielder[]>([]);
  isLoading = signal(true);

  prescriptionForm = new FormGroup({
    persona_mayor_id: new FormControl('', [Validators.required]),
    medicamento: new FormControl('', [Validators.required]),
    dosis: new FormControl('', [Validators.required]),
    frecuencia: new FormControl('', [Validators.required]),
    fecha_inicio: new FormControl('', [Validators.required]),
    fecha_fin: new FormControl('', [Validators.required]),
    prescrita_por: new FormControl('', [Validators.required]),
    archivo_pdf: new FormControl(''),
  });

  constructor() {
    this.loadElders();
  }

  private async loadElders() {
    this.isLoading.set(true);
    try {
      const response = await this.elderService.getAllElders();
      this.elders.set(response.personasMayores);
    } catch (error) {
      console.error('Failed to load elders:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit() {
    if (this.prescriptionForm.invalid) {
      this.prescriptionForm.markAllAsTouched();
      console.warn('Form invalid:', this.prescriptionForm.value);
      return;
    }

    const formValue = this.prescriptionForm.value;

    const prescriptionData: IPrescription = {
      persona_mayor_id: +formValue.persona_mayor_id!,
      medicamento: formValue.medicamento!,
      dosis: formValue.dosis!,
      frecuencia: formValue.frecuencia!,
      fecha_inicio: formValue.fecha_inicio!,
      fecha_fin: formValue.fecha_fin!,
      prescrita_por: formValue.prescrita_por!,
      archivo_pdf: formValue.archivo_pdf || undefined,
    };

    try {
      await this.prescriptionService.createPrescription(prescriptionData);
      await Swal.fire({
        icon: 'success',
        title: 'Receta registrada!',
        text: 'La receta ha sido registrada correctamente.',
        confirmButtonColor: '#3085d6',
      });
      this.prescriptionForm.reset();
    } catch (error) {
      console.error('Prescription creation error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo registrar la receta. Intenta de nuevo más tarde.',
        confirmButtonColor: '#d33',
      });
    }
  }
}
