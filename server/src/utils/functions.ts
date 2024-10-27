import { Primitive } from "../../../@types";
import PluginError from "./error";

export const getPluginService = <T>(name: string): T =>
  strapi.plugin("reactions").service(name);

export const parseParams = <T = Record<string, unknown>>(
  params: Record<string, unknown>
): T =>
  Object.keys(params).reduce((prev: T, curr: string) => {
    const value = params[curr];
    const parsedValue = Number(value);
    return {
      ...prev,
      [curr]: isNaN(parsedValue) ? value : parsedValue,
    };
  }, {} as unknown as T);

export const assertParamsPresent: <T>(
  params: unknown,
  keys: string[]
) => asserts params is T = (params, keys) => {
  const missingParams =
    params instanceof Object
      ? keys.filter((key) => !params.hasOwnProperty(key))
      : keys;

  if (missingParams.length === 0) {
    return;
  }

  throw new PluginError(
    400,
    `Expected params missing: ${missingParams.join(", ")}`
  );
};

export const assertNotEmpty: <T>(
  value: T | null | undefined,
  customError?: Error
) => asserts value is T = (value, customError) => {
  if (value) {
    return;
  }

  throw (
    customError ?? new PluginError(400, "Non-empty value expected, empty given")
  );
};

export const parseQuery = <T = Record<string, Primitive>>(query: T & {locale?: string}): T & {locale?: string} => {
  const { locale, ...rest } = query;

  return {
    ...rest,
    locale: locale as string,
  } as (T & {locale: string});
}