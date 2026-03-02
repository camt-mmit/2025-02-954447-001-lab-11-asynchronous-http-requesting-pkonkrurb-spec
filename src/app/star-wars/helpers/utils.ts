export function asReadonly<T>(data: T[]): readonly T[] {
  return data;
}

export function extractId(url: string) {
  return (
    new URL(url).pathname
      .split('/')
      .reverse()
      .find((path) => path !== '') ?? null
  );
}

export function purnEmptyProperties<T extends Record<string, unknown>>(
  data: T,
): Partial<{
  [K in keyof T]: NonNullable<T[K]>;
}> {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => !!value)) as Partial<{
    [K in keyof T]: NonNullable<T[K]>;
  }>;
}
