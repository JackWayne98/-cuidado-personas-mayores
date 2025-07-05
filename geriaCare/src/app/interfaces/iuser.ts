export interface Iuser {
  id?: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  password?: string; // optional when reading user data
  rol: 'familiar' | 'cuidador' | 'profesional_salud';
  es_admin?: boolean;
}
