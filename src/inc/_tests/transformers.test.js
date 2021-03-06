import {
  appendUnit,
  bezier,
  clamp,
  clampMax,
  clampMin,
  conditional,
  flow,
  interpolate,
  add,
  subtract,
  px,
  degrees,
  percent,
  rgba,
  rgbUnit,
  hsla,
  alpha,
  color
} from '../transformers';

describe('appendUnit()', () => {
  it('should return a function that appends a unit to provided numbers', () => {
    expect(appendUnit('px')(5)).toBe('5px');
  });
});

describe('bezier()', () => {
  it('should return a function that resolves the provided bezier points with either 3 or 4 points', () => {
    const resolveBezier3 = bezier([0, 1, 2]);
    expect(resolveBezier3(0)).toBe(0);
    expect(resolveBezier3(0.5)).toBe(1);
    expect(resolveBezier3(1)).toBe(2);

    const resolveBezier4 = bezier([0, 1, 2, 3]);
    expect(resolveBezier4(0)).toBe(0);
    expect(resolveBezier4(0.5)).toBe(1.5);
    expect(resolveBezier4(1)).toBe(3);
  });
});

describe('clamp()', () => {
  it('should return a function that clamps numbers to within the provided range', () => {
    const clamper = clamp(0, 1);
    expect(clamper(-1)).toBe(0);
    expect(clamper(0.5)).toBe(0.5);
  });
});

describe('clampMax()', () => {
  it('should return a function that clamps numbers to under the provided value', () => {
    const clamper = clampMax(1);
    expect(clamper(0.5)).toBe(0.5);
    expect(clamper(2)).toBe(1);
  });
});

describe('clampMin()', () => {
  it('should return a function that clamps numbers to over the provided value', () => {
    const clamper = clampMin(0);
    expect(clamper(1)).toBe(1);
    expect(clamper(-1)).toBe(0);
  });
});

describe('conditional()', () => {
  it('should return a function that only fires `ifTrue` if `check` is `true`', () => {
    const testCondition = conditional(
      (v) => v < 0,
      () => 5
    );

    expect(testCondition(-20)).toBe(5);
    expect(testCondition(20)).toBe(20);
  });

  it('should fire `ifFalse` if set', () => {
    const testCondition = conditional(
      (v) => v === 0,
      () => true,
      () => false
    );

    expect(testCondition(0)).toBe(true);
    expect(testCondition(1)).toBe(false);
  });
});

describe('flow', () => {
  it(
    `should return a function that will pass all arguments to all functions in
    order, with the first argument being replaced with the returned value
    of the previous function`,
    () => {
      const func = flow(
        (v, a) => v * a,
        (v, a) => v + a
      );

      expect(func(5, 2)).toBe(12);
    }
  );
});

describe('interpolate()', () => {
  it(
    `should create a function that interpolates between one range
    of numbers to another`,
    () => {
      const simpleInterpolator = interpolate([0, 1000], [500, 600]);
      expect(simpleInterpolator(500)).toBe(550);

      const complexInterpolator = interpolate(
        [0, 100, 200],
        [1000, 500, 1000]
      );
      expect(complexInterpolator(100)).toBe(500);
    }
  );

  it('should optionally accept an easing function', () => {

  });
});

describe('subtract()', () => {
  it('should return a function that returns an offset from the provided origin', () => {
    const offsetFrom50 = subtract(50);
    expect(offsetFrom50(25)).toBe(-25);
    expect(offsetFrom50(75)).toBe(25);
  });
});

describe('add()', () => {
  it('should return a function that returns the value added to the origin', () => {
    const addTo50 = add(50);
    expect(addTo50(25)).toBe(75);
    expect(addTo50(-75)).toBe(-25);
  });
});

describe('unit transformers', () => {
  it('should append the correct units', () => {
    expect(px(10)).toBe('10px');
    expect(degrees(360)).toBe('360deg');
    expect(percent(100)).toBe('100%');
    expect(rgbUnit(256)).toBe(255);
    expect(rgbUnit(24.5)).toBe(25);
    expect(rgba({
      red: 256,
      green: 24.5,
      blue: 0
    })).toBe('rgba(255, 25, 0, 1)');
    expect(hsla({
      hue: 100,
      saturation: 50,
      lightness: 50,
      alpha: 1
    })).toBe('hsla(100, 50%, 50%, 1)');
    expect(alpha(2)).toBe(1);
    expect(color({
      red: 256,
      green: 24.5,
      blue: 0
    })).toBe('rgba(255, 25, 0, 1)');
    expect(color({
      hue: 100,
      saturation: 50,
      lightness: 50,
      alpha: 1
    })).toBe('hsla(100, 50%, 50%, 1)');
  });
});
