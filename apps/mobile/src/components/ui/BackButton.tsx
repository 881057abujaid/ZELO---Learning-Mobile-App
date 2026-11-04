import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "./BackButton.styles";

type BackButtonProps = {
    onPress: () => void;
    disabled?: boolean;
    accessibilityLabel?: string;
};

export function BackButton({
    onPress,
    disabled = false,
    accessibilityLabel = "Go back",
}: BackButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                pressed && !disabled && styles.pressed,
                disabled && styles.disabled,
            ]}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ disabled }}
            hitSlop={4}
        >
            <Ionicons
                name="chevron-back"
                size={24}
                color={styles.icon.color}
            />
        </Pressable>
    );
}
