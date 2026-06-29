/**
 * Простой модуль для тестирования CI pipeline.
 */
export function greet(name) {
  if (!name || typeof name !== "string") {
    throw new Error("name must be a non-empty string");
  }
  return `Hello, ${name}!`;
}

export function add(a, b) {
  return a + b;
}
