<div class="container vh-100 d-flex align-items-center justify-content-center">
  <div class="w-100" style="max-width: 480px">
    <h2 class="text-center fw-bold">Registrar Receta Médica</h2>
    <p class="text-center text-muted mb-4">
      Completa el formulario para registrar una receta para un anciano.
    </p>

    <form [formGroup]="prescriptionForm" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label">Persona mayor</label>
        <select class="form-select" formControlName="persona_mayor_id">
          <option value="" disabled selected>Selecciona un anciano</option>
          @for (elder of elders(); track elder.id) {
          <option [value]="elder.id">
            {{ elder.nombre }} {{ elder.apellido }}
          </option>
          }
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Medicamento</label>
        <input
          type="text"
          class="form-control"
          formControlName="medicamento"
          placeholder="Nombre del medicamento"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Dosis</label>
        <input
          type="text"
          class="form-control"
          formControlName="dosis"
          placeholder="Ej: 10 mg"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Frecuencia</label>
        <input
          type="text"
          class="form-control"
          formControlName="frecuencia"
          placeholder="Ej: 1 vez al día"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Fecha de inicio</label>
        <input
          type="date"
          class="form-control"
          formControlName="fecha_inicio"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Fecha de fin</label>
        <input type="date" class="form-control" formControlName="fecha_fin" />
      </div>

      <div class="mb-3">
        <label class="form-label">Prescrita por</label>
        <input
          type="text"
          class="form-control"
          formControlName="prescrita_por"
          placeholder="Nombre del doctor"
        />
      </div>

      <div class="mb-4">
        <label class="form-label">Archivo PDF (opcional)</label>
        <input
          type="text"
          class="form-control"
          formControlName="archivo_pdf"
          placeholder="Nombre del archivo PDF"
        />
      </div>

      <div class="d-grid">
        <button type="submit" class="btn btn-dark">Registrar Receta</button>
      </div>
    </form>

  </div>
</div>
