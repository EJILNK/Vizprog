// 1. Тип Transform<T>
export type Transform<T> = (data: T[]) => T[];

// 2. Тип Where<T>
export type Where<T extends object> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

// 3. Тип Sort<T>
export type Sort<T extends object> = <K extends keyof T>(key: K) => Transform<T>;

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
  (data) =>
    data.filter((item) => item[key] === value);

export const sort: Sort<User> = (key) => (data) =>
  [...data].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av < bv) return -1;
    if (av > bv) return 1;
    return 0;
  });

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

// 8. query\
export function query<T extends object>(
  ...steps: (
    | Transform<T>
    | ((data: T[]) => Group<T, keyof T>[])
    | GroupTransform<T, keyof T>
  )[]
): (data: T[]) => T[] | Group<T, keyof T>[] {
  return (data: T[]) => {
    let current: T[] | Group<T, keyof T>[] = data;
    for (const step of steps) {
      current = (step as (x: T[] | Group<T, keyof T>[]) => T[] | Group<T, keyof T>[])(
        current
      );
    }
    return current;
  };
}
