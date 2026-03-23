/** Rutas donde solo se muestra el header, sin sidebar ni padding del layout principal. */
export function usesMinimalLayout(url: string): boolean {
  return (
    url.includes('/login') ||
    url.includes('/register') ||
    url.includes('/home')
  );
}
