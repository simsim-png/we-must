export type Lang = "fr" | "en";

/** A value in every site language. */
export type L<T = string> = Record<Lang, T>;
