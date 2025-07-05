<div class="container py-4">
  <h2 class="mb-4 text-center">Información del Residente</h2>

  <!-- General Info -->
  <div class="card mb-4">
    <div class="card-header bg-primary text-white">
      Información general
    </div>
    <div class="card-body">
      <p><strong>Nombre:</strong> {{ elder.nombre }} {{ elder.apellido }}</p>
      <p><strong>Fecha de nacimiento:</strong> {{ elder.fecha_nacimiento }}</p>
      <p><strong>Género:</strong> {{ elder.genero }}</p>
      <p><strong>Movilidad:</strong> {{ elder.movilidad }}</p>
      <p><strong>Relación:</strong> {{ elder.relacion }}</p>
      <p><strong>Condiciones médicas:</strong> {{ elder.condiciones_medicas }}</p>
      <p><strong>Notas generales:</strong> {{ elder.notas_generales }}</p>
    </div>
  </div>

  <!-- Activities -->
  <div class="card mb-4">
    <div class="card-header bg-secondary text-white">
      Actividades registradas
    </div>
    <ul class="list-group list-group-flush">
      @for (activity of activities; track activity.id) {
      <li class="list-group-item">
        <strong>{{ activity.nombre }}</strong> - {{ activity.categoria }}
        <div class="text-muted">{{ activity.descripcion }}</div>
      </li>
      }
    </ul>
  </div>

  <!-- Prescriptions -->
  <div class="card mb-4">
    <div class="card-header bg-success text-white">
      Recetas médicas
    </div>
    <ul class="list-group list-group-flush">
      @for (prescription of prescriptions; track prescription.id) {
      <li class="list-group-item">
        <strong>{{ prescription.medicamento }}</strong> -
        {{ prescription.dosis }}, {{ prescription.frecuencia }}<br />
        <span class="text-muted">Inicio: {{ prescription.fecha_inicio }} | Fin: {{ prescription.fecha_fin }}</span>
      </li>
      }
    </ul>
  </div>

  <!-- Diets -->
  <div class="card mb-4">
    <div class="card-header bg-warning text-dark">
      Dietas alimenticias
    </div>
    <ul class="list-group list-group-flush">
      @for (diet of diets; track diet.id) {
      <li class="list-group-item">
        <strong>Descripción:</strong> {{ diet.descripcion }}<br />
        <strong>Restricciones:</strong> {{ diet.restricciones }}<br />
        <strong>Recomendaciones:</strong> {{ diet.recomendaciones }}
      </li>
      }
    </ul>
  </div>

  <!-- Emergency Contact -->
  <div class="card mb-4">
    <div class="card-header bg-danger text-white">
      Contacto de emergencia
    </div>
    <div class="card-body">
      <p><strong>Nombre:</strong> {{ elder.contacto_emergencia_nombre }}</p>
      <p><strong>Teléfono:</strong> {{ elder.contacto_emergencia_telefono }}</p>
      <p><strong>Relación:</strong> {{ elder.contacto_emergencia_relacion }}</p>
    </div>
  </div>
</div>
