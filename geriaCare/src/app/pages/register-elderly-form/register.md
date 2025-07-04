<div class="container vh-100 d-flex align-items-center justify-content-center">
  <div class="w-100" style="max-width: 420px">
    <h2 class="text-center fw-bold">
      {{ isEditMode() ? "Elder Update" : "Elder Registration" }}
    </h2>
    <p class="text-center text-muted mb-4">
      {{
        isEditMode()
          ? "Fill the form to update an elder person"
          : "Fill the form to register an elder person"
      }}
    </p>

    <form [formGroup]="elderForm" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label">First Name</label>
        <input
          type="text"
          class="form-control"
          formControlName="nombre"
          placeholder="First Name"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Last Name</label>
        <input
          type="text"
          class="form-control"
          formControlName="apellido"
          placeholder="Last Name"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Birthdate</label>
        <input
          type="date"
          class="form-control"
          formControlName="fecha_nacimiento"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Gender</label>
        <select class="form-select" formControlName="genero">
          <option value="" disabled>Select</option>
          <option value="Masculino">Male</option>
          <option value="Femenino">Female</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Mobility</label>
        <input
          type="text"
          class="form-control"
          formControlName="movilidad"
          placeholder="Mobility status"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Relation</label>
        <select class="form-select" formControlName="relacion">
          <option value="" disabled>Select relation</option>
          <option value="familiar">Familiar</option>
          <option value="cuidador">Cuidador</option>
          <option value="profesional_salud">Profesional de Salud</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Medical Conditions</label>
        <textarea
          class="form-control"
          rows="3"
          formControlName="condiciones_medicas"
          placeholder="Medical conditions"
        ></textarea>
      </div>

      <div class="mb-4">
        <label class="form-label">Notes</label>
        <textarea
          class="form-control"
          rows="3"
          formControlName="notas_generales"
          placeholder="Additional notes"
        ></textarea>
      </div>

      <div class="d-grid">
        <button type="submit" class="btn btn-dark">
          {{ isEditMode() ? "Update Elder" : "Register Elder" }}
        </button>
      </div>
    </form>

  </div>
</div>
