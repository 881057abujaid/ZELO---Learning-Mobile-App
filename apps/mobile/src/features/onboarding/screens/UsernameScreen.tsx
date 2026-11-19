import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { BrandLogo } from "../../../components/branding/BrandLogo";
import { colors } from "../../../theme/colors";
import { ApiError } from "../../../lib/api/api-error";
import { useAuth } from "../../../lib/auth/auth-context";

import { styles } from "./UsernameScreen.styles";

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export default function UsernameScreen() {
    const { updateProfile } = useAuth();

    const [username, setUsername] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [apiError, setApiError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateUsername = (
        value: string,
    ): string => {
        const normalizedUsername = value.trim();

        if (!normalizedUsername) {
            return "Please enter a username.";
        }

        if (
            normalizedUsername.length <
            MIN_USERNAME_LENGTH
        ) {
            return "Username must contain at least 3 characters.";
        }

        if (
            normalizedUsername.length >
            MAX_USERNAME_LENGTH
        ) {
            return "Username cannot exceed 20 characters.";
        }

        if (!USERNAME_PATTERN.test(normalizedUsername)) {
            return "Only letters, numbers and underscores are allowed.";
        }

        return "";
    };

    const handleContinue = async () => {
        if (isSubmitting) {
            return;
        }

        const error = validateUsername(username);

        setValidationError(error);

        if (error) {
            return;
        }

        setApiError("");
        setIsSubmitting(true);

        try {
            await updateProfile({
                username: username.trim(),
            });

            console.log("Username saved successfully.");
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.code === "USERNAME_TAKEN"
            ) {
                setApiError(
                    "This username is already in use. Please choose another one.",
                );
            } else if (
                error instanceof ApiError &&
                error.status === 400
            ) {
                setApiError(
                    "Please check your username and try again.",
                );
            } else {
                setApiError(
                    "Unable to save your username. Please check your connection and try again.",
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUsernameChange = (value: string) => {
        setUsername(value);

        if (validationError) {
            setValidationError("");
        }

        if (apiError) {
            setApiError("");
        }
    };

    const hasError = Boolean(
        validationError || apiError,
    );

    return (
        <SafeAreaView
            style={styles.screen}
            edges={["top", "bottom"]}
        >
            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        {/* Brand */}
                        <View style={styles.brand}>
                            <BrandLogo
                                variant="tagline"
                                width={190}
                            />
                        </View>

                        {/* Heading */}
                        <View style={styles.heading}>
                            <Text style={styles.title}>
                                Choose your username
                            </Text>

                            <Text style={styles.subtitle}>
                                This is how other learners
                                {" "}
                                will recognize you.
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <Text style={styles.label}>
                                Username
                            </Text>

                            <View
                                style={[
                                    styles.inputContainer,
                                    isFocused &&
                                    styles.inputContainerFocused,
                                    hasError &&
                                    styles.inputContainerError,
                                ]}
                            >
                                <Text style={styles.usernamePrefix}>
                                    @
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    value={username}
                                    onChangeText={
                                        handleUsernameChange
                                    }
                                    placeholder="your_username"
                                    placeholderTextColor={
                                        colors.inputPlaceholder
                                    }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    maxLength={MAX_USERNAME_LENGTH}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    editable={!isSubmitting}
                                    onSubmitEditing={
                                        handleContinue
                                    }
                                    onFocus={() => {
                                        setIsFocused(true);
                                    }}
                                    onBlur={() => {
                                        setIsFocused(false);
                                    }}
                                    accessibilityLabel="Username"
                                />
                            </View>

                            {/* Character Counter */}
                            <Text
                                style={[
                                    styles.characterCount,
                                    username.length >
                                    MAX_USERNAME_LENGTH &&
                                    styles.characterCountError,
                                ]}
                            >
                                {username.length}/
                                {MAX_USERNAME_LENGTH}
                            </Text>

                            {/* Helper */}
                            <Text style={styles.helperText}>
                                3–20 characters. Use letters,
                                numbers or underscores.
                            </Text>

                            {/* Validation Error */}
                            {validationError ? (
                                <Text
                                    style={styles.errorText}
                                    accessibilityRole="alert"
                                >
                                    {validationError}
                                </Text>
                            ) : null}

                            {/* API Error */}
                            {apiError ? (
                                <Text
                                    style={styles.errorText}
                                    accessibilityRole="alert"
                                >
                                    {apiError}
                                </Text>
                            ) : null}

                            {/* Continue Button */}
                            <Pressable
                                onPress={handleContinue}
                                disabled={isSubmitting}
                                accessibilityRole="button"
                                accessibilityLabel="Continue"
                                style={({ pressed }) => [
                                    styles.primaryButton,
                                    pressed &&
                                    !isSubmitting &&
                                    styles.buttonPressed,
                                ]}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator
                                        color="#FFFFFF"
                                    />
                                ) : (
                                    <>
                                        <Text
                                            style={styles.primaryButtonText}
                                        >
                                            Continue
                                        </Text>

                                        <Text
                                            style={styles.buttonArrow}
                                        >
                                            →
                                        </Text>
                                    </>
                                )}
                            </Pressable>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                You can change your username
                                later in your profile.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}