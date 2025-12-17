import { View, Text, Pressable } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import type { Habit } from "@/types/habit";

type WeeklyDaysProgressProps = {
  dailyProgress: { [date: string]: { habits: Habit[] } };
  onDayPress?: (date: string) => void;
};

// Calculate total progress percentage across all habits
function calculateTotalProgress(habits: Habit[]): number {
  if (habits.length === 0) return 0;

  const validHabits = habits.filter((h) => h.goalAmount > 0);
  if (validHabits.length === 0) return 0;

  const totalPercentage = validHabits.reduce((sum, habit) => {
    const percentage = Math.min(
      (habit.currentAmount / habit.goalAmount) * 100,
      100
    );
    return sum + percentage;
  }, 0);

  return Math.round(totalPercentage / validHabits.length);
}

// Get dates for the current week (Sunday to Saturday)
function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 6 = Saturday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - day); // Go back to Sunday

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD
  }

  return dates;
}

// Get day letter (S, M, T, W, T, F, S)
function getDayLetter(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  return dayNames[date.getDay()];
}

export default function WeeklyDaysProgress({
  dailyProgress,
  onDayPress,
}: WeeklyDaysProgressProps) {
  const weekDates = getWeekDates();
  const today = new Date().toISOString().split("T")[0];

  return (
    <View className="flex-row justify-between items-center">
      {weekDates.map((date, index) => {
        const dayData = dailyProgress[date];
        const progress = dayData ? calculateTotalProgress(dayData.habits) : 0;
        const isToday = date === today;
        const dayLetter = getDayLetter(date);

        return (
          <Pressable
            key={date}
            onPress={() => onDayPress?.(date)}
            className={`items-center justify-center ${
              isToday ? "bg-primary/20 rounded-full p-1" : ""
            }`}
          >
            <CircularProgressBase
              value={progress}
              maxValue={100}
              radius={20}
              activeStrokeColor={"#3b82f6"}
            >
              <Text
                className={`font-bold text-xs ${
                  isToday ? "text-primary" : "text-text"
                }`}
              >
                {dayLetter}
              </Text>
            </CircularProgressBase>
          </Pressable>
        );
      })}
    </View>
  );
}

