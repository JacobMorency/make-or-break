import { View, Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import type { Habit } from "@/types/habit";

type HistoryDayCardProps = {
  date: string;
  habits: Habit[];
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

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = dateString === today.toISOString().split("T")[0];
  const isYesterday = dateString === yesterday.toISOString().split("T")[0];

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;
}

export default function HistoryDayCard({ date, habits }: HistoryDayCardProps) {
  const progress = calculateTotalProgress(habits);
  const completedHabits = habits.filter(
    (h) => h.currentAmount >= h.goalAmount && h.goalAmount > 0
  ).length;
  const totalHabits = habits.filter((h) => h.goalAmount > 0).length;

  return (
    <View className="bg-card rounded-xl p-4 mb-3">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-text font-bold text-lg">{formatDate(date)}</Text>
        <Text className="text-primary font-bold text-lg">{progress}%</Text>
      </View>
      <Text className="text-text/70 text-sm mb-3">
        {completedHabits} of {totalHabits} habits completed
      </Text>
      <View className="gap-2">
        {habits.map((habit) => {
          const isComplete = habit.currentAmount >= habit.goalAmount;
          const percentage =
            habit.goalAmount > 0
              ? Math.min((habit.currentAmount / habit.goalAmount) * 100, 100)
              : 0;

          return (
            <View
              key={habit.id}
              className="flex-row items-center gap-3 bg-bg/50 rounded-lg p-2"
            >
              <FontAwesome5
                name={habit.icon}
                size={20}
                color={isComplete ? "#3b82f6" : "#9CA3AF"}
              />
              <View className="flex-1">
                <Text
                  className={`text-sm ${
                    isComplete ? "text-text font-semibold" : "text-text/70"
                  }`}
                >
                  {habit.name}
                </Text>
                <Text className="text-text/50 text-xs">
                  {habit.currentAmount} / {habit.goalAmount}
                </Text>
              </View>
              <View className="w-16 h-2 bg-bg rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

