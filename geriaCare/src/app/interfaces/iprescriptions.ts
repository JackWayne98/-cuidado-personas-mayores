export interface IPrescription {
  id?: number;
  persona_mayor_id: number;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  fecha_inicio: string;
  fecha_fin: string;
  prescrita_por: string;
  archivo_pdf?: string;
  creado_por?: number;
  modificado_por?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}
