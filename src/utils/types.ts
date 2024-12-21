import { Properties } from 'csstype'

export type OneOrMore<T> = T | T[]

export type PartialRecord<S extends string, T> = Partial<Record<S, T>>

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

export type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T

export type ObjectKeyPicker<T> = T extends undefined
  ? Record<string, unknown>
  : {
      [K in keyof T]?: StringToBoolean<keyof T[K]> | undefined
    }

export type ObjectKeyArrayPicker<T> = T extends undefined
  ? Record<string, unknown>
  : {
      [K in keyof T]?: OneOrMore<StringToBoolean<keyof T[K]>> | undefined
    }

export type CssProperties = Properties<string | number>
