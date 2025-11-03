export function getEnv(key: string): string {
  // Evita l’analisi statica di TypeScript
  let viteEnv: any;

  try {
    // Questo evita che TS capisca che è "import.meta"
    viteEnv = (0, eval)("import.meta")?.env?.[key];
  } catch {
    // Ignoriamo se non esiste (nei test o in Node)
  }

  if (viteEnv) return viteEnv;
  if (process.env[key]) return process.env[key] as string;

  throw new Error(`Environment variable ${key} not found`);
}

