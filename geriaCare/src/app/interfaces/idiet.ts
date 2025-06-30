export interface Idiet {
  id?: number;
  persona_mayor_id: number;
  descripcion?: string;
  restricciones?: string;
  recomendaciones?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  es_activa?: boolean;
  creado_por?: number;
  modificado_por?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}
