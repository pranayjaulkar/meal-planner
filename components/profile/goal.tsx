import { HealthProfileResponseDto } from "@/lib/profile/dto";

type CalorieProgressCardProps = {
  caloriesEaten: number;
  calorieGoal: number;
  profile: HealthProfileResponseDto | null;
};

export function CalorieProgressCard({ caloriesEaten, calorieGoal, profile }: CalorieProgressCardProps) {
  const percentage = calorieGoal > 0 ? Math.min((caloriesEaten / calorieGoal) * 100, 100) : 0;

  const remaining = Math.max(calorieGoal - caloriesEaten, 0);

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-lg border bg-muted/40 p-6">
      <div className="flex gap-8 sm:flex-row sm:justify-between">
        <div className="flex w-8/12 flex-col items-center">
          <div className="relative">
            <svg width="180" height="180" className="-rotate-90">
              <circle cx="90" cy="90" r={radius} strokeWidth="12" className="fill-none stroke-muted" />

              <circle
                cx="90"
                cy="90"
                r={radius}
                strokeWidth="12"
                strokeLinecap="round"
                className="fill-none stroke-primary transition-all"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold">{Math.round(percentage)}%</p>
              <p className="text-sm text-muted-foreground">Consumed</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Calories Eaten</p>
            <p className="text-xl font-semibold">
              {caloriesEaten} / {calorieGoal}
            </p>
          </div>
        </div>

        <div className="flex-col w-4/12 flex justify-between text-center sm:text-right">
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">Maintainance Calories</p>
            <p className="text-4xl font-bold tracking-tight">{profile?.maintenanceCalories}</p>
            <p className="text-lg text-muted-foreground">kcal</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">Remaining Calories</p>
            <p className="text-4xl font-bold tracking-tight">{remaining}</p>
            <p className="text-lg text-muted-foreground">kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
