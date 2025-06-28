export interface Iactivity {
  id?: number;
  persona_mayor_id: number;
  nombre: string;
  categoria:
    | 'medicación'
    | 'terapia'
    | 'ejercicio'
    | 'alimentación'
    | 'descanso'
    | 'visita'
    | 'ocio';
  descripcion?: string;
  es_recurrente: boolean;
  creado_por?: number;
  modificado_por?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}
