// auth.interface.ts
/**
 * Representa los datos de un usuario.
 */
export interface Usuario {
  username: string;
  nombre?: string;
  rol?: string;
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