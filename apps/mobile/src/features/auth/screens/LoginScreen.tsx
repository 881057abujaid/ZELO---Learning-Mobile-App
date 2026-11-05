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
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../../lib/auth/auth-context";
import { colors } from "../../../theme/colors";
import { BrandLogo } from "../../../components/branding/BrandLogo";
import { Button } from "../../../components/ui/Button";
import { BackButton } from "../../../components/ui/BackButton";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
    const router = useRouter();

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
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                />

                <Text style={styles.stateMessage}>
                    Checking your session...
                </Text>
            </View>
        );
    }

    if (state.status === "error" && !isSubmitting) {
        return (
            <View style={styles.centeredState}>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>!</Text>
                </View>

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
        <SafeAreaView
            style={styles.screen}
            edges={["top", "bottom"]}
        >
            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <BackButton
                            onPress={() => router.replace("/")}
                            disabled={isSubmitting}
                            accessibilityLabel="Back to welcome screen"
                        />

                        <View style={styles.brand}>
                            <BrandLogo
                                variant="tagline"
                                width={220}
                            />
                        </View>

                        <View style={styles.heading}>
                            <Text style={styles.title}>
                                Welcome back!
                            </Text>

                            <Text style={styles.subtitle}>
                                Your coding adventure is waiting.
                                {"\n"}
                                Let&apos;s pick up where you left off.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <Text style={styles.label}>
                                Email address
                            </Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={(value) => {
                                        setEmail(value);
                                        setValidationError("");
                                        setLoginError("");
                                    }}
                                    placeholder="you@example.com"
                                    placeholderTextColor={
                                        colors.inputPlaceholder
                                    }
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

                            <Text style={styles.label}>
                                Password
                            </Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={(value) => {
                                        setPassword(value);
                                        setValidationError("");
                                        setLoginError("");
                                    }}
                                    placeholder="Enter your password"
                                    placeholderTextColor={
                                        colors.inputPlaceholder
                                    }
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
                                    disabled={isSubmitting}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            rememberMe &&
                                            styles.checkboxChecked,
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
                                        showUnavailableFeature(
                                            "Password recovery",
                                        );
                                    }}
                                    accessibilityRole="button"
                                    disabled={isSubmitting}
                                >
                                    <Text style={styles.linkText}>
                                        Forgot password?
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

                            <View style={styles.errorButtonSpacing}>
                                {loginError ? (
                                    <Text
                                        style={styles.errorText}
                                        accessibilityRole="alert"
                                    >
                                        {loginError}
                                    </Text>
                                ) : null}

                                <Button
                                    title="Sign In"
                                    variant="primary"
                                    onPress={() => void handleLogin()}
                                    loading={isSubmitting}
                                    accessibilityLabel="Sign in to ZELO"
                                    rightIcon={
                                        <Text style={styles.buttonArrow}>
                                            →
                                        </Text>
                                    }
                                />
                            </View>

                            <Text style={styles.secureNote}>
                                Your learning journey, one step at a time.
                            </Text>
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
                                disabled={isSubmitting}
                                accessibilityRole="button"
                            >
                                <FontAwesome
                                    name="google"
                                    size={19}
                                    color="#4285F4"
                                />

                                <Text style={styles.socialText}>
                                    Google
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.socialButton}
                                onPress={() => {
                                    showUnavailableFeature("Apple sign-in");
                                }}
                                disabled={isSubmitting}
                                accessibilityRole="button"
                            >
                                <Ionicons
                                    name="logo-apple"
                                    size={22}
                                    color="#000000"
                                />

                                <Text style={styles.socialText}>
                                    Apple
                                </Text>
                            </Pressable>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                New to ZELO?
                            </Text>

                            <Pressable
                                onPress={() => {
                                    showUnavailableFeature("Registration");
                                }}
                                accessibilityRole="button"
                                disabled={isSubmitting}
                            >
                                <Text style={styles.linkText}>
                                    Create an account
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}