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
