// auth.interface.ts
/**
 * Representa los datos de un usuario.
 */
export interface Usuario {
  username: string;
  nombre?: string;
}

/**
 * Representa la estructura de datos para una solicitud de inicio de sesión.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Representa la estructura de datos de la respuesta de inicio de sesión exitoso.
 */
export interface LoginResponse {
  token: string;
  username: string;
  nombre: string;
  rol: string;
}

/**
 * Representa la estructura de datos de la respuesta de obtener todos los usuarios y modificar un usuario.
 */
export interface UsuarioRegistrado {
  idUsuario: number;
  username: string;
  password?: string;
  nombre: string;
  rol: string;
}

