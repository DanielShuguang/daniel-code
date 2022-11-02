export type Nullable<T> = Nil | T

export type Nil = null | undefined

export interface Vector2D {
  x: number
  y: number
}

export type KeyTypes = string | number

export type Dict<K extends string | number | symbol, V = any> = Record<K, V | undefined>
