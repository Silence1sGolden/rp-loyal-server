export const getCookie = (key: string, data: string): string | undefined => {
  const value = data
    .split(';')
    .map((item) => item.split('='))
    .find((item) => item[0] === key);

  if (value) {
    return value[1];
  } else {
    return undefined;
  }
};
