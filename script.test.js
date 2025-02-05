import { calculateReviewDates, normalizeDate, addWeeks, addMonths, addYears } from "./script.js";
describe("Spaced Repetition Calculation", () => {
  test("calculateReviewDates should return correct intervals", () => {
    const startDate = new Date("2025-02-05");
    const reviewDates = calculateReviewDates(startDate);
    expect(reviewDates.length).toBe(5);
    expect(reviewDates[0]).toEqual(addWeeks(startDate, 1));
    expect(reviewDates[1]).toEqual(addMonths(startDate, 1));
    expect(reviewDates[2]).toEqual(addMonths(startDate, 3));
    expect(reviewDates[3]).toEqual(addMonths(startDate, 6));
    expect(reviewDates[4]).toEqual(addYears(startDate, 1));
  });
   test("calculateReviewDates should handle past dates correctly", () => {
    const pastDate = new Date("2024-01-01");
    const reviewDates = calculateReviewDates(pastDate);
    expect(reviewDates.length).toBe(5);
    expect(reviewDates[0]).toEqual(addWeeks(pastDate, 1));
    expect(reviewDates[1]).toEqual(addMonths(pastDate, 1));
    expect(reviewDates[2]).toEqual(addMonths(pastDate, 3));
    expect(reviewDates[3]).toEqual(addMonths(pastDate, 6));
    expect(reviewDates[4]).toEqual(addYears(pastDate, 1));
  });
});

describe("Date Utilities", () => {
  test("normalizeDate should remove time component", () => {
    const date = new Date("2025-02-05T15:30:00");
    const normalized = normalizeDate(date);
    expect(normalized.getHours()).toBe(0);
    expect(normalized.getMinutes()).toBe(0);
    expect(normalized.getSeconds()).toBe(0);
  });
});