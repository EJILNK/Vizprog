import { describe, it, expectTypeOf } from 'vitest';
import { DeepReadonly, PickedByType, EventHandlers } from './lab6';

describe('DeepReadonly', () => {
  it('делает все вложенные свойства readonly', () => {
    type Input = {
      a: { b: number };
      arr: { x: string }[];
      fn: () => void;
    };

    type Result = DeepReadonly<Input>;
    const result = {} as Result;

    expectTypeOf(result.a).toEqualTypeOf<{ readonly b: number }>();
    expectTypeOf(result.arr).toEqualTypeOf<
      ReadonlyArray<{ readonly x: string }>
    >();
    expectTypeOf(result.fn).toEqualTypeOf<() => void>();
  });
});

describe('PickedByType', () => {
  it('выбирает свойства по типу', () => {
    type Source = {
      a: string;
      b: number;
      c: string | number;
      d: boolean;
    };

    type OnlyString = PickedByType<Source, string>;

    expectTypeOf<OnlyString>().toEqualTypeOf<{
      a: string;
    }>();
    type OnlyNumber = PickedByType<Source, number>;
    expectTypeOf<OnlyNumber>().toEqualTypeOf<{
      b: number;
    }>();
    type OnlyBoolean = PickedByType<Source, boolean>;
    expectTypeOf<OnlyBoolean>().toEqualTypeOf<{
      d: boolean;
    }>();
  });
});

describe('EventHandlers', () => {
  it('генерирует обработчики событий по объекту событий', () => {
    type Events = {
      click: { x: number; y: number };
      change: string;
    };

    type Handlers = EventHandlers<Events>;

    expectTypeOf<Handlers>().toEqualTypeOf<{
      onClick: (event: { x: number; y: number }) => void;
      onChange: (event: string) => void;
    }>();
  });
});

