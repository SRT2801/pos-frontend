/**
 * Plantilla para desarrollo local (`ng serve` usa fileReplacements hacia este archivo).
 * Copia a `environment.development.ts` y rellena los valores.
 *
 * PowerShell: Copy-Item src/environments/environment.development.example.ts src/environments/environment.development.ts
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  supabaseUrl: 'https://TU_REFERENCIA.supabase.co',
  supabaseAnonKey: 'TU_CLAVE_ANON_PUBLICA_SUPABASE',
};
