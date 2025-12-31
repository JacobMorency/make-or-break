// GlassModalExample.tsx

import React, { useState, useMemo } from "react";
import { StyleSheet } from "react-native";
import {
  Host,
  VStack,
  HStack,
  Text,
  Button,
  TextField,
  Spacer,
} from "@expo/ui/swift-ui";
import {
  background,
  clipShape,
  padding,
  glassEffect,
} from "@expo/ui/swift-ui/modifiers";

type GlassModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (value: string) => void;
  initialText?: string;
};

export default function GlassModal({
  isOpen,
  onClose,
  onSave,
  initialText = "",
}: GlassModalProps) {
  if (!isOpen) return null;

  return (
    <Host matchContents style={StyleSheet.absoluteFill}>
      <ModalOverlay
        initialText={initialText}
        onCancel={onClose}
        onSave={(value) => {
          onSave?.(value);
          onClose();
        }}
      />
    </Host>
  );
}

type ModalOverlayProps = {
  initialText: string;
  onCancel: () => void;
  onSave: (value: string) => void;
};

function ModalOverlay({ initialText, onCancel, onSave }: ModalOverlayProps) {
  const [text, setText] = useState(initialText ?? "");

  const trimmed = useMemo(() => text.trim(), [text]);
  const isDisabled = trimmed.length === 0;

  return (
    <VStack
      spacing={0}
      modifiers={[
        // Full-screen overlay
        background("rgba(0,0,0,0.35)"), // dim background
      ]}
    >
      <Spacer />
      <GlassCard>
        <VStack spacing={12}>
          <Text color="secondary">Enter text</Text>

          <TextField
            defaultValue={text}
            onChangeText={setText}
            placeholder="Your note…"
            modifiers={[padding({ vertical: 4 })]}
          />

          <HStack spacing={8}>
            <Button
              onPress={onCancel}
              modifiers={[
                padding({ vertical: 8, horizontal: 12 }),
                glassEffect({
                  glass: { variant: "clear" },
                }),
              ]}
            >
              <Text>Cancel</Text>
            </Button>

            <Spacer />

            <Button
              onPress={() => onSave(trimmed)}
              disabled={isDisabled}
              modifiers={[
                padding({ vertical: 8, horizontal: 12 }),
                glassEffect({
                  glass: { variant: "clear" },
                }),
              ]}
            >
              <Text color={isDisabled ? "secondary" : "primary"}>Save</Text>
            </Button>
          </HStack>
        </VStack>
      </GlassCard>
      <Spacer />
    </VStack>
  );
}

/**
 * A reusable glass card using Liquid Glass.
 * You can tweak the variant: 'clear' | 'frosted' | etc (based on Expo UI mapping to iOS 26).
 */
function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      spacing={0}
      modifiers={[
        padding({ all: 16 }),
        background("#ffffff20"), // subtle backdrop
        clipShape("roundedRectangle"), // matches ContainerRelativeShape idea
        glassEffect({
          glass: {
            variant: "clear",
          },
        }),
      ]}
    >
      {children}
    </VStack>
  );
}
