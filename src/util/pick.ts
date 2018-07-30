export function pick<T>(target: any, value: string, fallback: T) {
  const result = target[value];
  return (typeof result === undefined) ? fallback : result;
}
