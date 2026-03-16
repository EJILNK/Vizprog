// 1. Тип Transform<T>
export type Transform<T> = (data: T[]) => T[];

export type WhereTransform<T> = Transform<T> & { readonly __phase?: "where" };
export type SortTransform<T> = Transform<T> & { readonly __phase?: "sort" };

// 2. Тип Where<T>
export type Where<T extends object> = <K extends keyof T>(
  key: K,
  value: T[K]
) => WhereTransform<T>;

// 3. Тип Sort<T>
export type Sort<T extends object> = <K extends keyof T>(key: K) => SortTransform<T>;

// 4. Тип Group<T, K>
export type Group<T, K extends keyof T> = {key: T[K]; items: T[];};

// 5. Тип GroupBy<T>
export type GroupBy<T extends object> = <K extends keyof T>(key: K) => (data: T[]) => Group<T, K>[];

// 6. Тип GroupTransform<T, K>
export type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

// 7. Тип Having<T>
export type Having<T extends object> = (predicate: (group: Group<T, keyof T>) => boolean) => (groups: Group<T, keyof T>[]) => Group<T, keyof T>[];

export interface User {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
}

export const where: Where<User> =
  (key, value) =>
  ((data) =>
    data.filter((item) => item[key] === value)) as WhereTransform<User>;

export const sort: Sort<User> = (key) =>
  ((data) =>
    [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    })) as SortTransform<User>;

export const groupBy: GroupBy<User> = <K extends keyof User>(key: K) =>
  (data: User[]) => {
    const acc = data.reduce(
      (acc, item) => {
        const k = String(item[key]);
        if (!acc[k]) {
          acc[k] = { key: item[key], items: [] };
        }
        acc[k].items.push(item);
        return acc;
      },
      {} as Record<string, Group<User, K>>
    );
    return Object.values(acc);
  };

export const having: Having<User> = (predicate) => (groups) =>
  groups.filter(predicate);

// Проверка порядка шагов
export type Phase = "where" | "groupBy" | "having" | "sort";

export type StepPhase<T extends object, F> =
  F extends WhereTransform<T> ? "where"
    : F extends (data: T[]) => Group<T, any>[]
      ? "groupBy"
      : F extends GroupTransform<T, any>
        ? "having"
        : F extends SortTransform<T>
          ? "sort"
          : never;

export type CheckSteps<
  T extends object,
  Steps extends readonly unknown[],
  State extends Phase = "where"
> = Steps extends readonly [infer F, ...infer Rest]
? StepPhase<T, F> extends infer P
? P extends never
  ? never
  : State extends "where"
    ? P extends "where" | "groupBy"
      ? CheckSteps<T, Rest, P extends "groupBy" ? "groupBy" : "where">
      : never
    : State extends "groupBy"
      ? P extends "groupBy" | "having"
        ? CheckSteps<T, Rest, P extends "having" ? "having" : "groupBy">
        : never
      : State extends "having"
        ? P extends "having" | "sort"
          ? CheckSteps<T, Rest, P extends "sort" ? "sort" : "having">
          : never
        : State extends "sort"
          ? P extends "sort"
            ? CheckSteps<T, Rest, "sort">
            : never
          : never
          :never
  : Steps;

export type ValidSteps<T extends object, Steps extends readonly unknown[]> =
  CheckSteps<T, Steps> extends never ? never : Steps;

// 8. query: принимает только последовательности шагов в порядке where* -> groupBy* -> having* -> sort*
export function query<T extends object, S extends readonly unknown[]>(
  ...steps: ValidSteps<
    T,
    S & readonly (
      | WhereTransform<T>
      | ((data: T[]) => Group<T, keyof T>[])
      | GroupTransform<T, keyof T>
      | SortTransform<T>
    )[]
  >
): (data: T[]) => T[] | Group<T, keyof T>[] {
  return (data: T[]) => {
    let current: T[] | Group<T, keyof T>[] = data;
    for (const step of steps as readonly ((
      x: T[] | Group<T, keyof T>[]
    ) => T[] | Group<T, keyof T>[] )[]) {
      current = step(current);
    }
    return current;
  };

}
