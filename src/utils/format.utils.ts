export function format(template: string, values: Record<string, any>): string {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
    template
  );
}

export function formatSelector(selector: any): string {
  if (typeof selector === "string") {
    return `"${selector}"`;
  } else if (typeof selector === "object" && selector !== null) {
    return Object.entries(selector)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(", ");
  }
  return String(selector);
}
