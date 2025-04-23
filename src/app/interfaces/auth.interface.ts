// auth.interface.ts - Define las estructuras de datos para autenticación
export interface Usuario {
    // id?: number;
    username: string;
    // password?: string;
    nombre?: string;
    // apellido?: string;
    rol?: string;
    // token?: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    username: string;
    nombre: string; 
    rol: string;
  }