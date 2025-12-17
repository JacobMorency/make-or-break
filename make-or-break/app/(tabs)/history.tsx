import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { storage } from "@/utils/asyncStorage";
import type { Habit } from "@/types/habit";
import HistoryDayCard from "@/components/history-day-card";

const DAILY_PROGRESS_KEY = "dailyProgress";

export default function HistoryScreen() {
  const [dailyProgress, setDailyProgress] = useState<{
    [date: string]: { habits: Habit[] };
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const storedDailyProgress = await storage.getItem<{
        [date: string]: { habits: Habit[] };
      }>(DAILY_PROGRESS_KEY);

      if (storedDailyProgress) {
        setDailyProgress(storedDailyProgress);
      }
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(dailyProgress).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <SafeAreaView className="flex-1 bg-bg p-4">
      <View className="mb-4">
        <Text className="text-text font-bold text-3xl">History</Text>
        <Text className="text-text/70 text-sm mt-1">
          View your past progress
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text/70">Loading...</Text>
        </View>
      ) : sortedDates.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text/70 text-center">
            No history yet.{"\n"}Complete some habits to see your progress here!
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {sortedDates.map((date) => (
            <HistoryDayCard
              key={date}
              date={date}
              habits={dailyProgress[date].habits}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
