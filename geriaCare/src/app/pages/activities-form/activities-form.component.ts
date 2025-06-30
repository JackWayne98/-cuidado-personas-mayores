import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivitiesService } from '../../services/activities.service';
import { ElderRegisterService } from '../../services/elder-register.service';
import { Ielder } from '../../interfaces/ielder';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activities-form',
  imports: [ReactiveFormsModule],
  templateUrl: './activities-form.component.html',
  styleUrl: './activities-form.component.css',
})
export class ActivitiesFormComponent {
  private elderService = inject(ElderRegisterService);
  private activitiesService = inject(ActivitiesService);
  elders: Ielder[] = [];

  activitiesForm = new FormGroup({
    persona_mayor_id: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    categoria: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    es_recurrente: new FormControl('', [Validators.required]),
  });
  loadElders = (async () => {
    try {
      const response = await this.elderService.getAllElders();
      this.elders = response.personasMayores;
    } catch (error) {
      console.error('Failed to load elders:', error);
    }
  })();
  async onSubmit() {
    if (this.activitiesForm.invalid) {
      this.activitiesForm.markAllAsTouched();
      console.warn('Form invalid:', this.activitiesForm.value);
      return;
    }

    const { persona_mayor_id, nombre, categoria, descripcion, es_recurrente } =
      this.activitiesForm.value;

    const activityData = {
      persona_mayor_id: +persona_mayor_id!,
      nombre: nombre!,
      categoria: categoria! as
        | 'medicación'
        | 'terapia'
        | 'ejercicio'
        | 'alimentación'
        | 'descanso'
        | 'visita'
        | 'ocio',
      descripcion: descripcion!,
      es_recurrente: es_recurrente === '1',
    };

    try {
      const response = await this.activitiesService.createActivity(
        activityData
      );
      console.log('Activity created:', response);
      await Swal.fire({
        icon: 'success',
        title: 'Activity Created!',
        text: 'The activity has been successfully registered.',
        confirmButtonColor: '#3085d6',
      });

      this.activitiesForm.reset();
    } catch (error) {
      console.error('Activity creation error:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to create the activity. Please try again later.',
        confirmButtonColor: '#d33',
      });
    }
  }
}
