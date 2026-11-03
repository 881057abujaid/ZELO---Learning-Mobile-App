import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { Link, Redirect } from "expo-router";

import { useAuth } from "../../../lib/auth/auth-context";
import { colors } from "../../../theme/colors";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
    const { state, retryRestore, login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = useCallback(async () => {
        setValidationError("");
        setLoginError("");

        const normalizedEmail = email.trim();

        if (!normalizedEmail || !password) {
            setValidationError(
                "Please enter both your email and password.",
            );
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            setValidationError(
                "Please enter a valid email address.",
            );
            return;
        }

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await login({
                email: normalizedEmail,
                password,
            });
        } catch (error: unknown) {
            setLoginError(
                error instanceof Error
                    ? error.message
                    : "Unable to sign in. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [email, password, isSubmitting, login]);

    const showUnavailableFeature = (feature: string) => {
        Alert.alert(
            "Coming Soon",
            `${feature} is not available in this version of ZELO.`,
        );
    };

    if (state.status === "authenticated") {
        return <Redirect href="/home" />;
    }

    if (state.status === "loading" && !isSubmitting) {
        return (
            <View style={styles.centeredState}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.stateMessage}>
                    Checking your session...
                </Text>
            </View>
        );
    }

    if (state.status === "error" && !isSubmitting) {
        return (
            <View style={styles.centeredState}>
                <Text style={styles.stateTitle}>
                    Unable to restore session
                </Text>

                <Text style={styles.stateMessage}>
                    {state.message}
                </Text>

                <Pressable
                    style={styles.primaryButton}
                    onPress={() => void retryRestore()}
                    accessibilityRole="button"
                >
                    <Text style={styles.primaryButtonText}>
                        Try Again
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Link href="/" asChild>
                        <Pressable
                            style={styles.backButton}
                            accessibilityRole="button"
                            accessibilityLabel="Back to home"
                        >
                            <Text style={styles.backArrow}>‹</Text>
                        </Pressable>
                    </Link>

                    <View style={styles.brand}>
                        <Text style={styles.brandName}>ZELO</Text>
                        <Text style={styles.tagline}>
                            Learn. Practice. Build.
                        </Text>
                    </View>

                    <View style={styles.heading}>
                        <Text style={styles.title}>
                            Welcome Back!
                        </Text>

                        <Text style={styles.subtitle}>
                            Log in to continue your learning journey.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>
                            Email Address
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>
                                ✉
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={(value) => {
                                    setEmail(value);
                                    setValidationError("");
                                    setLoginError("");
                                }}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.inputPlaceholder}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                textContentType="emailAddress"
                                editable={!isSubmitting}
                                accessibilityLabel="Email address"
                                returnKeyType="next"
                            />
                        </View>

                        <Text style={[styles.label, styles.passwordLabel]}>
                            Password
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>
                                ♙
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    setValidationError("");
                                    setLoginError("");
                                }}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.inputPlaceholder}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="current-password"
                                textContentType="password"
                                editable={!isSubmitting}
                                accessibilityLabel="Password"
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                    void handleLogin();
                                }}
                            />

                            <Pressable
                                style={styles.visibilityButton}
                                onPress={() => {
                                    setShowPassword((visible) => !visible);
                                }}
                                disabled={isSubmitting}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                <Text style={styles.visibilityText}>
                                    {showPassword ? "Hide" : "Show"}
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.optionsRow}>
                            <Pressable
                                style={styles.rememberOption}
                                onPress={() => {
                                    setRememberMe((checked) => !checked);
                                }}
                                accessibilityRole="checkbox"
                                accessibilityState={{
                                    checked: rememberMe,
                                }}
                            >
                                <View
                                    style={[
                                        styles.checkbox,
                                        rememberMe && styles.checkboxChecked,
                                    ]}
                                >
                                    {rememberMe ? (
                                        <Text style={styles.checkmark}>
                                            ✓
                                        </Text>
                                    ) : null}
                                </View>

                                <Text style={styles.rememberText}>
                                    Remember me
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => {
                                    showUnavailableFeature("Password recovery");
                                }}
                                accessibilityRole="button"
                            >
                                <Text style={styles.linkText}>
                                    Forgot Password?
                                </Text>
                            </Pressable>
                        </View>

                        {validationError ? (
                            <Text
                                style={styles.errorText}
                                accessibilityRole="alert"
                            >
                                {validationError}
                            </Text>
                        ) : null}

                        {loginError ? (
                            <Text
                                style={styles.errorText}
                                accessibilityRole="alert"
                            >
                                {loginError}
                            </Text>
                        ) : null}

                        <Pressable
                            style={[
                                styles.primaryButton,
                                isSubmitting && styles.disabledButton,
                            ]}
                            onPress={() => void handleLogin()}
                            disabled={isSubmitting}
                            accessibilityRole="button"
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color={colors.white} />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    Log In →
                                </Text>
                            )}
                        </Pressable>
                    </View>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />

                        <Text style={styles.dividerText}>
                            OR CONTINUE WITH
                        </Text>

                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialRow}>
                        <Pressable
                            style={styles.socialButton}
                            onPress={() => {
                                showUnavailableFeature("Google sign-in");
                            }}
                            accessibilityRole="button"
                        >
                            <Text style={styles.socialIcon}>G</Text>
                            <Text style={styles.socialText}>Google</Text>
                        </Pressable>

                        <Pressable
                            style={styles.socialButton}
                            onPress={() => {
                                showUnavailableFeature("Apple sign-in");
                            }}
                            accessibilityRole="button"
                        >
                            <Text style={styles.socialIcon}>●</Text>
                            <Text style={styles.socialText}>Apple</Text>
                        </Pressable>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don&apos;t have an account?
                        </Text>

                        <Pressable
                            onPress={() => {
                                showUnavailableFeature("Registration");
                            }}
                            accessibilityRole="button"
                        >
                            <Text style={styles.linkText}>
                                Sign Up
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
