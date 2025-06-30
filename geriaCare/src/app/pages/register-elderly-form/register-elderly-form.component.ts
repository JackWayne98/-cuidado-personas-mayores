import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ElderRegisterService } from '../../services/elder-register.service';
import Swal from 'sweetalert2';
import { Ielder } from '../../interfaces/ielder';
@Component({
  selector: 'app-register-elderly-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-elderly-form.component.html',
  styleUrl: './register-elderly-form.component.css',
})
export class RegisterElderlyFormComponent {
  private elderService = inject(ElderRegisterService);

  elderForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    fecha_nacimiento: new FormControl('', Validators.required),
    genero: new FormControl('', Validators.required),
    movilidad: new FormControl(''),
    condiciones_medicas: new FormControl(''),
    notas_generales: new FormControl(''),
    relacion: new FormControl('', Validators.required),
  });
  async onSubmit() {
    if (this.elderForm.invalid) {
      this.elderForm.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire(
        'Error',
        'You must be logged in to register an elder.',
        'error'
      );
      return;
    }

    try {
      const formData: Ielder = this.elderForm.value as unknown as Ielder;
      const response = await this.elderService.registerElder(formData);
      console.log('API Response:', response);
      Swal.fire('Success', 'Elder registered successfully.', 'success');
      this.elderForm.reset();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to register elder.', 'error');
    }
  }
}
