const {
  formatDateResult,
  normalizeAndFormat,
  handleSetDate,
  dateTimeFormat,
  formatOnPretty
} = require("./helpers");

jest.useFakeTimers();
jest.setSystemTime(new Date("2022-06-03T10:34:20.897Z"));

const testFormatter = date =>
  `${date.getFullYear()} -- ${date.getMonth()} -- ${date.getDate()}`;
describe("helpers", () => {
  const dates = ["2022-06-02T10:34:20.897Z", "2022-06-02T20:34:20.897Z"];

  describe("formatOnPretty", () => {
    describe("with prettyPrint", () => {
      it("returns a formatted date", () => {
        expect(
          formatOnPretty(new Date(), {
            prettyPrint: true,
            dateTimeFormat: testFormatter
          })
        ).toBe("2022 -- 5 -- 3");
      });
    });
    describe("without prettyPrint", () => {
      it("returns an unchanged date", () => {
        const someDate = new Date();
        expect(
          formatOnPretty(someDate, {
            prettyPrint: false,
            dateTimeFormat: testFormatter
          })
        ).toEqual(someDate);
      });
    });
  });

  describe("dateTimeFormat", () => {
    describe("with no date", () => {
      it("returns an empty string", () => {
        expect(dateTimeFormat()).toBe("");
      });
    });

    describe("with no mode", () => {
      it("returns a date in the default format", () => {
        expect(dateTimeFormat(new Date())).toBe("03/06/2022");
      });
    });
    describe("with datetime mode", () => {
      it("returns a date in the datetime format", () => {
        expect(dateTimeFormat(new Date(), "datetime")).toBe(
          "03/06/2022 11:34:20"
        );
      });
    });
    describe("with date mode", () => {
      it("returns a date in the date format", () => {
        expect(dateTimeFormat(new Date(), "date")).toBe("03/06/2022");
      });
    });
    describe("with time mode", () => {
      it("returns a date in the date format", () => {
        expect(dateTimeFormat(new Date(), "time")).toBe("11:34:20");
      });
    });
    describe("with countdown mode", () => {
      it("returns a date in the countdown format", () => {
        expect(dateTimeFormat(new Date(), "countdown")).toBe("11:34");
      });
    });
  });

  describe("handleSetDate", () => {
    describe("onChange", () => {
      describe("without prettyprint", () => {
        it("invokes onChange with an unformatted date", () => {
          const props = {
            onChange: jest.fn(),
            prettyPrint: false
          };

          handleSetDate(new Date("2022-06-13T10:34:20.897Z"), props);

          expect(props.onChange).toHaveBeenCalledWith(
            new Date("2022-06-13T10:34:20.897Z")
          );
        });
      });
      describe("with prettyprint", () => {
        it("invokes onChange with a formatted date", () => {
          const props = {
            onChange: jest.fn(),
            prettyPrint: true,
            dateTimeFormat: testFormatter
          };

          handleSetDate(new Date("2022-06-13T10:34:20.897Z"), props);

          expect(props.onChange).toHaveBeenCalledWith("2022 -- 5 -- 13");
        });
      });
    });
    describe("onValueChange", () => {
      it("invokes onValueChange with an unformatted date", () => {
        const props = {
          onValueChange: jest.fn(),
          prettyPrint: false
        };

        handleSetDate(new Date("2022-06-13T10:34:20.897Z"), props);

        expect(props.onValueChange).toHaveBeenCalledWith(
          new Date("2022-06-13T10:34:20.897Z")
        );
      });
    });
  });

  describe("normalizeAndFormat", () => {
    describe("with a date in date mode", () => {
      it("returns a truncated date", () => {
        expect(
          normalizeAndFormat({ date: new Date(dates[0]), mode: "date" })
        ).toEqual(new Date("2022-06-01T23:00:00.000Z"));
      });
    });

    describe("with no date in date mode", () => {
      it("returns a truncated, current date", () => {
        expect(normalizeAndFormat({ mode: "date" })).toEqual(
          new Date("2022-06-02T23:00:00.000Z")
        );
      });
    });

    describe("with a date and no mode", () => {
      it("returns an unchanged date", () => {
        expect(normalizeAndFormat({ date: new Date(dates[0]) })).toEqual(
          new Date(dates[0])
        );
      });
    });

    describe("with no date and no mode", () => {
      it("returns the current date", () => {
        expect(normalizeAndFormat({})).toEqual(
          new Date("2022-06-03T10:34:20.897Z")
        );
      });
    });
  });

  describe("formatDateResult", () => {
    describe("with date mode", () => {
      it("truncates a date", () => {
        expect.assertions(dates.length);

        dates.forEach(date => {
          expect(formatDateResult(new Date(date), "date")).toEqual(
            new Date("2022-06-01T23:00:00.000Z")
          );
        });
      });
    });

    describe("without a mode", () => {
      it("returns an unchanged date", () => {
        const [date] = dates;

        expect(formatDateResult(new Date(date))).toEqual(new Date(date));
      });
    });
  });
});
