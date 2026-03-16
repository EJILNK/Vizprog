//рекурсивный readonly
export type DeepReadonly<T> =
  T extends (...args: any[]) => any
    ? T
    : T extends readonly (infer U)[]
      ? ReadonlyArray<DeepReadonly<U>>
      : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
        : T;

//выбирает свойства по типу
export type PickedByType<T, U> = {[K in keyof T as T[K] extends U ? K : never]: T[K];
};

//генерирует обработчики событий по объекту событий
export type EventHandlers<T> = {[K in keyof T & string as `on${Capitalize<K>}`]: (event: T[K]) => void;
};
