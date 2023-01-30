import numeral from "numeral";
import "numeral/locales/bg";
import "numeral/locales/cs";
import "numeral/locales/da-dk";
import "numeral/locales/de";
import "numeral/locales/en-au";
import "numeral/locales/en-gb";
import "numeral/locales/es";
import "numeral/locales/fr";
import "numeral/locales/hu";
import "numeral/locales/it";
import "numeral/locales/lv";
import "numeral/locales/no";
import "numeral/locales/pl";
import "numeral/locales/ru";
import { EventEmitter } from "../utils/EventEmitter";

import { Settings } from "../Settings/Settings";

/** List of all supported suffixes for each power of 1000. */
const log1000suffixes = ["", "k", "m", "b", "t", "q", "Q", "s", "S", "o", "n"];

// Number indexes are used for caching formatter for certain high-use digit counts.
let formatters: Record<"smallInt" | "engineering", Intl.NumberFormat> &
  Record<number, undefined | Intl.NumberFormat> & {
    dynamic: (digits: number, options?: Intl.NumberFormatOptions) => Intl.NumberFormat;
  };
export function initFormatters() {
  const { Locale, showTrailing0 } = Settings;
  formatters = {} as typeof formatters;
  /** Simple formatter for small integers */
  formatters.smallInt = new Intl.NumberFormat([Locale, "en"]);
  /** Engineering format for large numbers  */
  formatters.engineering = new Intl.NumberFormat([Locale, "en"], {
    notation: "engineering",
    minimumFractionDigits: showTrailing0 ? 3 : 0,
    maximumFractionDigits: 3,
    // @ts-ignore using an experimental setting roundingMode that has no type declaration
    roundingMode: "trunc",
  });
  /** Standard formatter for 3 digits */
  formatters[3] = new Intl.NumberFormat([Locale, "en"], {
    minimumFractionDigits: showTrailing0 ? 3 : 0,
    maximumFractionDigits: 3,
    // @ts-ignore using an experimental setting roundingMode that has no type declaration
    roundingMode: "trunc",
  });
  /** Standard formatter for 2 digits (multipliers)*/
  formatters[2] = new Intl.NumberFormat([Locale, "en"], {
    minimumFractionDigits: showTrailing0 ? 3 : 0,
    maximumFractionDigits: 3,
    // @ts-ignore using an experimental setting roundingMode that has no type declaration
    roundingMode: "trunc",
  });
  /** Formatter-creator when a preexisting formatter doesn't exist. */
  formatters.dynamic = (digits, options = {}) =>
    new Intl.NumberFormat([Locale, "en"], {
      minimumFractionDigits: showTrailing0 ? digits : 0,
      maximumFractionDigits: digits,
      // @ts-ignore using an experimental setting roundingMode that has no type declaration
      roundingMode: "trunc",
      ...options,
    });
}

export function nFormat(n: number, digits = 3, isInteger = false, isPercent = false): string {
  if (isNaN(n)) return "NaN" + isPercent ? "%" : "";
  if (isPercent) n *= 100; // Done before infinite check in case we are within 1/100 of infinity
  if (!Number.isFinite(n)) return (n < 0 ? "-∞" : "∞") + isPercent ? "%" : "";
  const nAbs = Math.abs(n);

  // Percent always just shows the whole thing in standard notation.
  if (isPercent) return (formatters[digits] || formatters.dynamic(digits)).format(n) + "%";

  // Small numbers have special handling to allow an early exit and less math for this more common number type.
  if (!n || nAbs < 1e3) {
    return (isInteger ? formatters.smallInt : formatters[digits] || formatters.dynamic(digits)).format(n);
  }

  // Engineering notation for very large numbers.
  if (nAbs >= 1e33) return formatters.engineering.format(n);

  // Determine the correct suffix and display the number
  const log1000 = Math.floor(Math.log(nAbs) / Math.log(1000));
  n = n / 1000 ** log1000;
  // A number with "error" as the suffix means there's an issue
  return (formatters[digits] || formatters.dynamic(digits)).format(n) + (log1000suffixes[log1000] || "error");
}

export function formatMoney(n: number) {
  return "$" + nFormat(n);
}

// Todo: Handle this differently to remove percentage handling in nFormat
export function formatPercent(n: number, digits = 2) {
  return nFormat(n, digits, false, true);
}

export function formatInt(n: number) {
  return nFormat(n, 3, true);
}

// Todo: Ram formatting. Still using numeral for that.

export const nFormatLoaded = new EventEmitter(); // For things that need to happen after initializing formatter

// TODO: custom implementations for ram formatting and parsing custom number inputs. Get rid of numeralWrapper altogether.
const extraFormats = [1e15, 1e18, 1e21, 1e24, 1e27, 1e30];
const extraNotations = ["q", "Q", "s", "S", "o", "n"];
const gigaMultiplier = { standard: 1e9, iec60027_2: 2 ** 30 };

class NumeralFormatter {
  format(n: number | string, format?: string): string {
    // numeral.js doesn't properly format numbers that are too big or too small
    if (Math.abs(n as number) < 1e-6) {
      n = 0;
    }
    const answer = numeral(n).format(format);
    if (answer === "NaN") {
      return `${n}`;
    }
    return answer;
  }

  // Don't have this implemented yet
  formatRAM(n: number): string {
    if (Settings.UseIEC60027_2) {
      return this.format(n * gigaMultiplier.iec60027_2, "0.00ib");
    }
    return this.format(n * gigaMultiplier.standard, "0.00b");
  }

  parseCustomLargeNumber(str: string): number {
    const numericRegExp = new RegExp("^(-?\\d+\\.?\\d*)([" + extraNotations.join("") + "]?)$");
    const match = str.match(numericRegExp);
    if (match == null) {
      return NaN;
    }
    const [, number, notation] = match;
    const notationIndex = extraNotations.indexOf(notation);
    if (notationIndex === -1) {
      return NaN;
    }
    return parseFloat(number) * extraFormats[notationIndex];
  }

  largestAbsoluteNumber(n1: number, n2 = 0, n3 = 0): number {
    if (isNaN(n1)) n1 = 0;
    if (isNaN(n2)) n2 = 0;
    if (isNaN(n3)) n3 = 0;
    const largestAbsolute = Math.max(Math.abs(n1), Math.abs(n2), Math.abs(n3));
    switch (largestAbsolute) {
      case Math.abs(n1):
        return n1;
      case Math.abs(n2):
        return n2;
      case Math.abs(n3):
        return n3;
    }
    return 0;
  }

  parseMoney(s: string): number {
    // numeral library does not handle formats like 1s (returns 1) and 1e10 (returns 110) well,
    // so if more then 1 return a valid number, return the one farthest from 0
    const numeralValue = numeral(s).value();
    const parsed = parseFloat(s);
    const selfParsed = this.parseCustomLargeNumber(s);
    // Check for one or more NaN values
    if (isNaN(parsed) && isNaN(selfParsed)) {
      if (numeralValue === null) {
        // 3x NaN
        return NaN;
      }
      // 2x NaN
      return numeralValue;
    } else if (numeralValue === null && isNaN(selfParsed)) {
      // 2x NaN
      return parsed;
    } else if (isNaN(parsed)) {
      if (numeralValue === null) {
        // 2x NaN
        return selfParsed;
      }
      // 1x NaN
      return this.largestAbsoluteNumber(numeralValue, selfParsed);
    } else if (numeralValue === null) {
      // 1x NaN
      return this.largestAbsoluteNumber(parsed, selfParsed);
    } else if (isNaN(selfParsed)) {
      // 1x NaN
      return this.largestAbsoluteNumber(numeralValue, parsed);
    } else {
      // no NaN
      return this.largestAbsoluteNumber(numeralValue, parsed, selfParsed);
    }
  }
}

export const numeralWrapper = new NumeralFormatter();
