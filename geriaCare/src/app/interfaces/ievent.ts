export interface Ievent {
  actividad_id: number;
  fecha_inicio: string;
  fecha_fin: string;
  recordatorio: boolean;
  grupo_recurrencia_id?: string;
  intervalo_horas?: number;
  repeticiones?: number;
}
