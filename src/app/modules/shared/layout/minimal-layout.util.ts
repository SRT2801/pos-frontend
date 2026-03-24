
export function usesMinimalLayout(url: string): boolean {
  return (
    url.includes('/login') ||
    url.includes('/register') ||
    url.includes('/home')
  );
}
