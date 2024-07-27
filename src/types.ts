import { Properties } from 'csstype'

// Utils
export type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T

export type OneOrMore<T> = T | T[]

export type PartialRecord<S extends string, T> = Partial<Record<S, T>>

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

export type CssProperties = Properties<string | number>

// Variant / standard

export type VariantStyle = { className: string; style: CssProperties }

export type VariantRecord = Record<string, Record<string, string | RequireAtLeastOne<VariantStyle>>>

export type VariantSelection<T> = T extends undefined
  ? Record<string, unknown>
  : {
      [K in keyof T]?: StringToBoolean<keyof T[K]> | undefined
    }

export type VariantCompoundSelection<T> = T extends undefined
  ? Record<string, unknown>
  : {
      [K in keyof T]?: OneOrMore<StringToBoolean<keyof T[K]>> | undefined
    }

export interface VariantDefinition<T extends VariantRecord | undefined> {
  base?: string | RequireAtLeastOne<VariantStyle>
  variants?: T
  compoundVariants?: (VariantCompoundSelection<T> & RequireAtLeastOne<VariantStyle>)[]
  defaultVariants?: VariantSelection<T>
  onDone?: (css: VariantStyle) => VariantStyle
}

export type VariantFn<T extends VariantRecord | undefined> = (
  props?: VariantSelection<T> & Partial<VariantStyle>
) => VariantStyle

export type VariantCreatorFn = <T extends VariantRecord | undefined>(config: VariantDefinition<T>) => VariantFn<T>

// Variant / slots

export type SlotVariantStyle<S extends string> = {
  classNames: PartialRecord<S, string>
  styles: PartialRecord<S, CssProperties>
}

export type SlotVariantRecord<S extends string> = Record<
  string,
  Record<string, PartialRecord<S, string | RequireAtLeastOne<VariantStyle>>>
>

export interface SlotVariantDefinition<S extends string, T extends SlotVariantRecord<S> | undefined> {
  slots: S[] | Readonly<S[]>
  base?: PartialRecord<S, string | RequireAtLeastOne<VariantStyle>>
  variants?: T
  compoundVariants?: (VariantCompoundSelection<T> & RequireAtLeastOne<SlotVariantStyle<S>>)[]
  defaultVariants?: VariantSelection<T>
  onDone?: (css: Record<S, VariantStyle>) => Record<S, VariantStyle>
}

export type SlotVariantFn<S extends string, T extends SlotVariantRecord<S> | undefined> = (
  props?: VariantSelection<T> & Partial<SlotVariantStyle<S>>
) => Record<S, VariantStyle>

export type SlotVariantCreatorFn = <S extends string, T extends SlotVariantRecord<S> | undefined>(
  config: SlotVariantDefinition<S, T>
) => SlotVariantFn<S, T>

export type VariantProps<T extends VariantFn<VariantRecord> | SlotVariantFn<string, SlotVariantRecord<string>>> =
  Parameters<T>[0]
