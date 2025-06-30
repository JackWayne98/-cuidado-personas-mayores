import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ElderRegisterService } from '../../services/elder-register.service';
import { DietService } from '../../services/diet.service';
import { Ielder } from '../../interfaces/ielder';

import Swal from 'sweetalert2';
import { Idiet } from '../../interfaces/idiet';

@Component({
  selector: 'app-elders-diet',
  imports: [ReactiveFormsModule],
  templateUrl: './elders-diet.component.html',
  styleUrl: './elders-diet.component.css',
})
export class EldersDietComponent {
  private elderService = inject(ElderRegisterService);
  private dietService = inject(DietService);

  elders = signal<Ielder[]>([]);
  isLoading = signal(true);

  dietForm = new FormGroup({
    persona_mayor_id: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    restricciones: new FormControl('', [Validators.required]),
    recomendaciones: new FormControl('', [Validators.required]),
    fecha_inicio: new FormControl('', [Validators.required]),
    fecha_fin: new FormControl('', [Validators.required]),
    es_activa: new FormControl('', [Validators.required]),
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
    if (this.dietForm.invalid) {
      this.dietForm.markAllAsTouched();
      console.warn('Form invalid:', this.dietForm.value);
      return;
    }

    const formValue = this.dietForm.value;
    const dietData: Idiet = {
      persona_mayor_id: +formValue.persona_mayor_id!,
      descripcion: formValue.descripcion!,
      restricciones: formValue.restricciones!,
      recomendaciones: formValue.recomendaciones!,
      fecha_inicio: formValue.fecha_inicio!,
      fecha_fin: formValue.fecha_fin!,
      es_activa: formValue.es_activa === '1',
    };

    try {
      await this.dietService.createDiet(dietData);
      await Swal.fire({
        icon: 'success',
        title: 'Dieta registrada!',
        text: 'La dieta ha sido registrada correctamente.',
        confirmButtonColor: '#3085d6',
      });
      this.dietForm.reset();
    } catch (error) {
      console.error('Diet creation error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se pudo registrar la dieta. Intenta de nuevo más tarde.',
        confirmButtonColor: '#d33',
      });
    }
  }
}
