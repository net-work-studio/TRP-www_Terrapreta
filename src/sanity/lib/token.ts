import "server-only";

function getRequiredToken(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export const serverToken = getRequiredToken("SANITY_API_READ_TOKEN");
export const browserToken = process.env.SANITY_API_BROWSER_TOKEN;
