export function get<T>(input: object, path: string, defaultValue?: T): T {
  const obj = input as Record<string, any>;
  return obj[path] ?? defaultValue;
}

export function set<T>(input: object, path: string, value: T): void {
  const obj = input as Record<string, any>;
  obj[path] = value;
}
