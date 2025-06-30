export interface Ielder {
  id?: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string; // yyyy-mm-dd
  genero: 'masculino' | 'femenino';
  movilidad?: string;
  condiciones_medicas?: string;
  notas_generales?: string;
  relacion: 'familiar' | 'cuidador' | 'profesional_salud';
  creado_por?: number;
  modificado_por?: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}
