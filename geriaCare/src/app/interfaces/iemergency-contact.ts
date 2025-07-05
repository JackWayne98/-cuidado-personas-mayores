export interface IemergencyContact {
   id?: number;
  persona_mayor_id: number;
  nombre: string;
  telefono: string;
  relacion: string;
  es_medico: boolean;
  correo: string;
  creado_por?: number;
  modificado_por?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}
