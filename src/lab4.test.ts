import { describe, it, expect } from "vitest";
import {
  where,
  sort,
  groupBy,
  having,
  query,
  type User,
  type Group,
} from "./lab4";

const users: User[] = [
  { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
  { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
  { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
  { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];

describe("where", () => {
  it("фильтрует по полю и значению", () => {
    const byName = where("name", "John");
    expect(byName(users)).toHaveLength(3);
    expect(byName(users).every((u) => u.name === "John")).toBe(true);
  });

  it("возвращает пустой массив, если совпадений нет", () => {
    const byCity = where("city", "Moscow");
    expect(byCity(users)).toEqual([]);
  });
});

describe("sort", () => {
  it("сортирует по полю по возрастанию", () => {
    const byAge = sort("age");
    const result = byAge(users);
    expect(result.map((u) => u.age)).toEqual([33, 34, 35, 35]);
  });

  it("не мутирует исходный массив", () => {
    const copy = [...users];
    sort("id")(users);
    expect(users).toEqual(copy);
  });
});

describe("query — фильтрация и сортировка", () => {
  it("цепочка where + where + sort даёт ожидаемый result", () => {
    const search = query<User>(
      where("name", "John"),
      where("surname", "Doe"),
      sort("age")
    );
    const result = search(users);
    expect(result).toEqual([
      { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
      { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
      { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
    ]);
  });
});

describe("groupBy", () => {
  it("группирует по ключу", () => {
    const byCity = groupBy("city");
    const result = byCity(users);
    expect(result).toHaveLength(2);
    const ny = result.find((g) => g.key === "NY");
    const la = result.find((g) => g.key === "LA");
    expect(ny?.items).toHaveLength(2);
    expect(la?.items).toHaveLength(2);
  });
});

describe("having", () => {
  it("оставляет только группы с длиной > 1", () => {
    const groupAndFilter = query<User>(
      groupBy("city"),
      having((group) => group.items.length > 1)
    );
    const grouped = groupAndFilter(users) as Group<User, keyof User>[];
    expect(grouped).toHaveLength(2);
    expect(grouped.every((g) => g.items.length > 1)).toBe(true);
  });
});

describe("query — комбинированный конвейер", () => {
  it("where + groupBy + having", () => {
    const pipeline = query<User>(
      where("surname", "Doe"),
      groupBy("city"),
      having((group) => group.items.some((u) => u.age > 34))
    );
    const res = pipeline(users) as Group<User, keyof User>[];
    expect(res).toHaveLength(1);
    expect(res[0]?.key).toBe("LA");
    expect(res[0]?.items).toHaveLength(2);
  });
});
