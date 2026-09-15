export const MAX_LIMIT = 100;
export const DEFAULT_LIMIT = 50;

export function getRandomCode(): string {
  let code: string = '';

  while (code.length !== 6) {
    code += Math.round(Math.random() * 9).toString();
  }

  return code;
}

/**
 * Проверяет определённые поля у объекта
 * @param obj Объект, в котором будет производится проверка
 * @param fields Поля, которые должны быть в объекте
 * @returns Возвращает null, если все поля есть в объекте, либо строку с первым отсутствующим полем
 */
export function checkFields<T>(obj: T, fields: (keyof T)[]): string | null {
  if (!obj) {
    return 'Данные отсутсвуют.';
  }
  if (typeof obj !== 'object') {
    return 'Данные не являются обьектом.';
  }
  fields.forEach((key) => {
    if (!(key in obj) || !obj[key]) {
      return `Поле ${String(key)} нет в обьекте или оно пустое.`;
    }
  });
  return null;
}

export const customParse = (v: unknown) =>
  typeof v === 'string' ? JSON.parse(v) : v;

export function sanitizeLimit(value: number | undefined): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

export function sanitizeOffset(value: number | undefined): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) return 0;
  return n;
}
