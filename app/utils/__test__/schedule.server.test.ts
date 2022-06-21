import { addWeeks, setDay } from "date-fns";
import { getStartingDateFromWeek, Schedule } from "../schedule.server";

describe("Schedule", () => {
  describe("generate", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    it("should return an empty schedule for an empty set of days", () => {
      const schedule = Schedule.generate({
        trainingCadence: {},
        periodInWeeks: 1,
        startWeek: 0,
      });
      expect(schedule).toHaveLength(0);
    });

    it("should return an empty schedule for a period of 0", () => {
      const schedule = Schedule.generate({
        trainingCadence: {
          0: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
        periodInWeeks: 0,
        startWeek: 0,
      });
      expect(schedule).toHaveLength(0);
    });

    it("should return a single training day schedule over a 1 week period", () => {
      const schedule = Schedule.generate({
        trainingCadence: {
          0: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            }
          },
        },
        periodInWeeks: 1,
        startWeek: 15,
      });
      expect(schedule).toHaveLength(1);
      const date = getStartingDateFromWeek(15);
      expect(schedule).toStrictEqual([
        {
          date: setDay(date, 0),
          trainingActivity: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
      ]);
    });

    it("should return multiple training days schedule over a 1 week period", () => {
      const schedule = Schedule.generate({
        trainingCadence: {
          0: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
          3: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id-2",
              name: "Tempo Run",
              activityId: "test-activity-id",
            },
          },
        },
        periodInWeeks: 1,
        startWeek: 12,
      });
      expect(schedule).toHaveLength(2);
      const date = getStartingDateFromWeek(12);
      expect(schedule).toStrictEqual([
        {
          date: setDay(date, 0),
          trainingActivity: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
        {
          date: setDay(date, 3),
          trainingActivity: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
      ]);
    });

    it("should return a single training day schedule over a 4 week period", () => {
      const schedule = Schedule.generate({
        trainingCadence: {
          1: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
        periodInWeeks: 4,
        startWeek: 12,
      });
      expect(schedule).toHaveLength(4);
      const date = setDay(getStartingDateFromWeek(12), 1);
      expect(schedule).toStrictEqual([
        {
          date: addWeeks(date, 0),
          trainingActivity: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
        {
          date: addWeeks(date, 1),
          trainingActivity: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
        {
          date: addWeeks(date, 2),
          trainingActivity: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
        {
          date: addWeeks(date, 3),
          trainingActivity: {
            activity: {
              id: "test-activity-id",
              name: "Running",
            },
            activityType: {
              id: "test-activity-type-id",
              name: "Long Run",
              activityId: "test-activity-id",
            },
          },
        },
      ]);
    });
  });
});
