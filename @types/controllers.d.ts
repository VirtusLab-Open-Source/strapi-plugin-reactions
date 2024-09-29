import PluginError from "../src/utils/error";

export type ThrowableResponse<T> = T | PluginError | never;
export type ThrowablePromisedResponse<T> = Promise<ThrowableResponse<T>>;
