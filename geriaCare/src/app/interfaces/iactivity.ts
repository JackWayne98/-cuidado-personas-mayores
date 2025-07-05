export interface Iactivity {
  id?: number;
  nombre: string;
  categoria:
    | "medicación"
    | "terapia"
    | "ejercicio"
    | "alimentación"
    | "descanso"
    | "visita"
    | "ocio";
  descripcion?: string;

  creado_por?: number;
  modificado_por?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}
