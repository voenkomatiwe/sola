type KeyType = string | number | symbol;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toMap = <T extends Record<KeyType, any>, K extends keyof T>(
  array: Array<T>,
  keyName: K,
): Record<T[K], T> =>
  array.reduce(
    (acc, item) => ({
      ...acc,
      [item[keyName]]: item,
    }),
    {} as Record<T[K], T>,
  );

export const calculatePeriodInMonths = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  return yearDiff * 12 + monthDiff;
};
