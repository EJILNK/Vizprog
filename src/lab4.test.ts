import { describe, it, expect, expectTypeOf } from "vitest";
import {
  where,
  sort,
  groupBy,
  having,
  query,
  type User,
  type Group,
  type WhereTransform,
  type SortTransform,
  type GroupTransform,
  type StepPhase,
  type CheckSteps,
  type ValidSteps,
} from "./lab4";

const users: User[] = [
  { id: 1, name: "Pavel", surname: "Ryazantsev", age: 34, city: "MSK" },
  { id: 2, name: "Pavel", surname: "Ryazantsev", age: 33, city: "MSK" },
  { id: 3, name: "Pavel", surname: "Ryazantsev", age: 35, city: "NSK" },
  { id: 4, name: "Mikhail", surname: "Ryazantsev", age: 35, city: "NSK" },
];

describe("where", () => {
  it("фильтрует по полю и значению", () => {
    const byName = where("name", "Pavel");
    expect(byName(users)).toHaveLength(3);
    expect(byName(users).every((u) => u.name === "Pavel")).toBe(true);
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
    const search = query(
      where("name", "Pavel"),
      where("surname", "Ryazantsev"),
      sort("age")
    );
    const result = search(users);
    expect(result).toEqual([
      { id: 2, name: "Pavel", surname: "Ryazantsev", age: 33, city: "MSK" },
      { id: 1, name: "Pavel", surname: "Ryazantsev", age: 34, city: "MSK" },
      { id: 3, name: "Pavel", surname: "Ryazantsev", age: 35, city: "NSK" },
    ]);
  });
});

describe("groupBy", () => {
  it("группирует по ключу", () => {
    const byCity = groupBy("city");
    const result = byCity(users);
    expect(result).toHaveLength(2);
    const MSK = result.find((g) => g.key === "MSK");
    const NSK = result.find((g) => g.key === "NSK");
    expect(MSK?.items).toHaveLength(2);
    expect(NSK?.items).toHaveLength(2);
  });

  it("возвращает группы с ожидаемыми ключами", () => {
    const bySurname = groupBy("surname");
    const result = bySurname(users);
    const keys = result.map((g) => g.key).sort();
    expect(keys).toEqual(["Ryazantsev"]);
    expect(result[0]?.items).toHaveLength(4);
  });
});

describe("having", () => {
  it("оставляет только группы с длиной > 1", () => {
    const groupAndFilter = (query as any)(
      groupBy("city"),
      having((group) => group.items.length > 1)
    ) as (data: User[]) => Group<User, keyof User>[];
    const grouped = groupAndFilter(users);
    expect(grouped).toHaveLength(2);
    expect(grouped.every((g) => g.items.length > 1)).toBe(true);
  });

  it("фильтрует группы по предикату", () => {
    const byCity = groupBy("city");
    const groups = byCity(users);
    const onlyNSK = having((group) => group.key === "NSK")(groups);
    expect(onlyNSK).toHaveLength(1);
    expect(onlyNSK[0]?.key).toBe("NSK");
    expect(onlyNSK[0]?.items).toHaveLength(2);
  });
});

describe("query — комбинированный конвейер", () => {
  it("where + groupBy + having", () => {
    const pipeline = (query as any)(
      where("surname", "Ryazantsev"),
      groupBy("city"),
      having((group) => group.items.some((u) => u.age > 34))
    ) as (data: User[]) => Group<User, keyof User>[];
    const res = pipeline(users) as Group<User, keyof User>[];
    expect(res).toHaveLength(1);
    expect(res[0]?.key).toBe("NSK");
    expect(res[0]?.items).toHaveLength(2);
  });

  it("полный корректный порядок where -> groupBy -> having", () => {
    const pipeline = (query as any)(
      where("surname", "Ryazantsev"),
      where("name", "Pavel"),
      groupBy("city"),
      having((group) => group.items.some((u) => u.age >= 34))
    ) as (data: User[]) => Group<User, keyof User>[];
    const res = pipeline(users);
    expect(res.length).toBeGreaterThan(0);
  });

});

describe("типовая логика CheckSteps / ValidSteps", () => {
  type W = WhereTransform<User>;
  type S = SortTransform<User>;
  type GByCity = (data: User[]) => Group<User, "city">[];
  type GHCity = GroupTransform<User, "city">;

  it("StepPhase корректно определяет фазу шага", () => {
    type P1 = StepPhase<User, W>;
    type P2 = StepPhase<User, GByCity>;
    type P3 = StepPhase<User, GHCity>;
    type P4 = StepPhase<User, S>;

    expectTypeOf<P1>().toEqualTypeOf<"where">();
    expectTypeOf<P2>().toEqualTypeOf<"groupBy">();
    expectTypeOf<P3>().toEqualTypeOf<"having">();
    expectTypeOf<P4>().toEqualTypeOf<"sort">();
  });

  it("CheckSteps/ValidSteps пропускают корректный порядок", () => {
    type Steps = [W, W, GByCity, GHCity, S];
    type Checked = CheckSteps<User, Steps>;
    type Valid = ValidSteps<User, Steps>;

    expectTypeOf<Checked>().not.toEqualTypeOf<never>();
    expectTypeOf<Valid>().not.toEqualTypeOf<never>();
  });

  it("CheckSteps/ValidSteps отбрасывают некорректный порядок", () => {
    type BadSteps = [S, W];
    type CheckedBad = CheckSteps<User, BadSteps>;
    type ValidBad = ValidSteps<User, BadSteps>;

    expectTypeOf<CheckedBad>().toEqualTypeOf<never>();
    expectTypeOf<ValidBad>().toEqualTypeOf<never>();
  });
});
