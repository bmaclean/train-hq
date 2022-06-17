import { addYears, getWeek, setDay, setWeek, startOfWeek, startOfWeekYear } from "date-fns";
import { addWeeks, isPast } from "date-fns";
import { times } from "lodash";

export enum Activity {
  Running,
  WeightTraining,
}

export enum RunningActivityTypes {
  LongRun,
  TempoRun,
  RecoveryRun,
}

type ActivityType<T extends Activity> = T extends Activity.Running
  ? RunningActivityTypes
  : never;

type DayOfTheWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type TrainingActivity<A extends Activity = Activity> = {
  activity: A;
  activityType: ActivityType<A>;
};

type ActivityDate = {
  date: Date;
  trainingActivity: TrainingActivity | TrainingActivity[];
};

interface GenerateArgs {
  trainingCadence: {
    [key in DayOfTheWeek]?: TrainingActivity | TrainingActivity[];
  };
  periodInWeeks: number;
  startWeek: number; // validate that the starting week is in the future
}

export function getStartingDateFromWeek(startWeek: number): Date {
  const currentWeek = getWeek(new Date());

  if (currentWeek >= startWeek) {
    // the starting week should be in the next year
    return setWeek(addYears(new Date(), 1), startWeek);
  } else {
    // the starting week is later in the current year
    return setWeek(new Date(), startWeek);
  }
}

export const Schedule = {
  generate({
    trainingCadence,
    periodInWeeks,
    startWeek,
  }: GenerateArgs): ActivityDate[] {
    const schedule: ActivityDate[] = [];

    const startDate = getStartingDateFromWeek(startWeek);
 
    times(periodInWeeks, (i: number) => {
      const currentWeekDate = addWeeks(startDate, i);

      Object.entries(trainingCadence).forEach(
        ([dayOfTheWeek, trainingActivity]) => {
          const trainingDate = setDay(currentWeekDate, parseInt(dayOfTheWeek));

          schedule.push({
            date: trainingDate,
            trainingActivity: trainingActivity,
          });
        }
      );
    });

    return schedule;
  },
};
