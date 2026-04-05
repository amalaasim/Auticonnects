import {
  buildWonderworldResultMetrics,
  calculateFocusRatio,
  normalizeFocusMetrics,
  resolveWonderworldModuleFromRoute,
} from "./mappers";

describe("analytics mappers", () => {
  it("builds wonderworld result metrics from tries and stars", () => {
    expect(buildWonderworldResultMetrics(2, 1, 3)).toEqual({
      voice_tries: 2,
      select_tries: 1,
      total_tries: 3,
      star_count: 3,
      completion_percent: 100,
    });
  });

  it("resolves route sources to module keys", () => {
    expect(resolveWonderworldModuleFromRoute("find")).toBe("cookie");
    expect(resolveWonderworldModuleFromRoute("findcar")).toBe("car");
    expect(resolveWonderworldModuleFromRoute("findball")).toBe("ball");
    expect(resolveWonderworldModuleFromRoute("findshoe")).toBe("shoe");
  });

  it("normalizes focus metrics and ratio", () => {
    expect(calculateFocusRatio(3000, 1000)).toBe(0.75);
    expect(normalizeFocusMetrics(3000, 1000, 2)).toEqual({
      focus_time_ms: 3000,
      distracted_time_ms: 1000,
      distraction_count: 2,
      focus_ratio: 0.75,
    });
  });
});
