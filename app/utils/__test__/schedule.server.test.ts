import { addWeeks, setDay } from "date-fns";
import {
  Activity,
  getStartingDateFromWeek,
  RunningActivityTypes,
  Schedule,
} from "../schedule.server";

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
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
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
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
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
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
          },
        },
      ]);
    });

    it("should return multiple training days schedule over a 1 week period", () => {
      const schedule = Schedule.generate({
        trainingCadence: {
          0: {
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
          },
          3: {
            activity: Activity.Running,
            activityType: RunningActivityTypes.TempoRun,
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
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
          },
        },
        {
          date: setDay(date, 3),
          trainingActivity: {
            activity: Activity.Running,
            activityType: RunningActivityTypes.TempoRun,
          },
        },
      ]);
    });

    it("should return a single training day schedule over a 4 week period", () => {
      const schedule = Schedule.generate({
        trainingCadence: {
          1: {
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
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
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
          },
        },
        {
          date: addWeeks(date, 1),
          trainingActivity: {
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
          },
        },
        {
          date: addWeeks(date, 2),
          trainingActivity: {
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
          },
        },
        {
          date: addWeeks(date, 3),
          trainingActivity: {
            activity: Activity.Running,
            activityType: RunningActivityTypes.LongRun,
          },
        },
      ]);
    });
  });
});
