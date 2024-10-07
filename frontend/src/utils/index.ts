import { BN } from "bn.js";

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

const BASE = 10;

type ValueType = string | number;

export const removeTrailingZeros = (amount: string) => {
  if (amount.includes(".") || amount.includes(",")) {
    return amount.replace(/\.?0*$/, "");
  }
  return amount;
};

export const parseTokenAmount = (value: ValueType, decimals: number) => {
  const [integerPart, fractionalPart = ""] = value.toString().split(".");
  const fractionalPartPadded = fractionalPart
    .padEnd(decimals, "0")
    .slice(0, decimals);

  const fullValue = integerPart + fractionalPartPadded;

  return new BN(fullValue, 10);
};

export const formatTokenAmount = (value: ValueType, decimals = 18) => {
  const bnValue = new BN(value);
  const divisor = new BN(BASE).pow(new BN(decimals));

  const integerPart = bnValue.div(divisor);
  const fractionalPart = bnValue
    .mod(divisor)
    .toString()
    .padStart(decimals, "0");

  const formattedAmount = `${integerPart}.${fractionalPart}`;

  return removeTrailingZeros(formattedAmount);
};

export const secondsToDays = (seconds: string) => {
  const secondsInADay = 24 * 60 * 60;
  return (Number(seconds) / secondsInADay).toFixed(0);
};

export const getHostNameFromRegex = (url: string): string | null => {
  const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};
