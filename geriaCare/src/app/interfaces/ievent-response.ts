export interface IeventResponse {
  id: number;
  actividad_id: number;
  persona_mayor_id: string;
  perfil_usuario_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  recordatorio: number;
  estado: string;
  creado_por: number;
  modificado_por: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  grupo_recurrencia_id: string | null;
  intervalo_horas: number | null;
  repeticiones: number | null;
}
