import {
    ActivityIndicator,
    Pressable,
    Text,
    type GestureResponderEvent,
} from "react-native";

import { styles } from "./Button.styles";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost";

export type ButtonProps = {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    accessibilityLabel?: string;
};

export function Button({
    title,
    onPress,
    variant = "primary",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    accessibilityLabel,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel ?? title}
            accessibilityState={{
                disabled: isDisabled,
                busy: loading,
            }}
            disabled={isDisabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                pressed && !isDisabled && styles.pressed,
                isDisabled && styles.disabled,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={
                        variant === "primary"
                            ? "#FFFFFF"
                            : "#7357E8"
                    }
                />
            ) : (
                <>
                    {leftIcon}

                    <Text
                        style={[
                            styles.label,
                            styles[`${variant}Label`],
                        ]}
                    >
                        {title}
                    </Text>

                    {rightIcon}
                </>
            )}
        </Pressable>
    );
}