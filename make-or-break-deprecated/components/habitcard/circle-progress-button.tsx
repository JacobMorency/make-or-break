import { View, Text, Pressable } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type CircleProgressButtonProps = {
  currentAmount: number;
  targetAmount: number;
  setCurrentAmount: (amount: number) => void;
};

export default function CircleProgressButton({
  currentAmount,
  targetAmount,
  setCurrentAmount,
}: CircleProgressButtonProps) {
  const isExactlyComplete = currentAmount === targetAmount;
  const isComplete = currentAmount >= targetAmount;

  // To keep ring filled use the targetAmount for the value prop
  const progressValue = isComplete ? targetAmount : currentAmount;

  return (
    <View>
      <Pressable
        className="items-center justify-center"
        onPress={() => {
          setCurrentAmount(currentAmount + 1);
        }}
      >
        <CircularProgressBase
          value={progressValue}
          radius={24}
          maxValue={targetAmount}
          activeStrokeColor={"#3b82f6"}
        >
          {isExactlyComplete ? (
            <FontAwesome5 name={"check"} size={20} color="#3b82f6" />
          ) : (
            <Text className="text-primary font-bold">{currentAmount}</Text>
          )}
        </CircularProgressBase>
      </Pressable>
    </View>
  );
}
