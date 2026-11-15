import { useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../../theme/colors";
import { BrandLogo } from "../../../components/branding/BrandLogo";
import { BackButton } from "../../../components/ui/BackButton";
import { styles } from "./LoginScreen.styles";
import { registerWithEmail } from "../../../lib/auth/auth-api";

export default function RegisterScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationError, setRegistrationError] = useState("");

    const handleCreateAccount = async () => {
        setValidationError("");
        setRegistrationError("");

        const normalizedEmail = email.trim();

        // Check empty fields
        if (!normalizedEmail || !password || !confirmPassword) {
            setValidationError(
                "Please fill in all the required fields.",
            );
            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            setValidationError(
                "Please enter a valid email address.",
            );
            return;
        }

        // Backend password requirements
        if (password.length < 8 || password.length > 128) {
            setValidationError(
                "Password must contain between 8 and 128 characters.",
            );
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            setValidationError(
                "Passwords do not match. Please try again.",
            );
            return;
        }

        // Prevent duplicate submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await registerWithEmail({
                email: normalizedEmail,
                password,
            });

            Alert.alert(
                "Account Created!",
                "Your ZELO account has been created successfully. Please sign in to continue.",
                [
                    {
                        text: "Sign In",
                        onPress: () => router.replace("/login"),
                    },
                ],
                {
                    cancelable: false,
                },
            );
        } catch (error: unknown) {
            setRegistrationError(
                error instanceof Error
                    ? error.message
                    : "Unable to create your account. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const showComingSoon = () => {
        Alert.alert(
            "Coming Soon",
            "This feature will be implemented in the future.",
        );
    };

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
                            accessibilityLabel="Back to welcome screen"
                        />

                        <View style={styles.brand}>
                            <BrandLogo
                                variant="tagline"
                                width={190}
                            />
                        </View>

                        <View style={styles.heading}>
                            <Text style={styles.title}>
                                Create Your Account
                            </Text>

                            <Text style={styles.subtitle}>
                                Start your coding adventure today.
                                {"\n"}
                                Learn, practise and build with ZELO!
                            </Text>
                        </View>

                        <View style={styles.form}>
                            {/* Email */}
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
                                        setRegistrationError("");
                                    }}
                                    placeholder="you@example.com"
                                    placeholderTextColor={colors.inputPlaceholder}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                    accessibilityLabel="Email address"
                                    returnKeyType="next"
                                    editable={!isSubmitting}
                                />
                            </View>

                            {/* Password */}
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
                                        setRegistrationError("");
                                    }}
                                    placeholder="Create a password"
                                    placeholderTextColor={colors.inputPlaceholder}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="new-password"
                                    textContentType="newPassword"
                                    accessibilityLabel="Password"
                                    returnKeyType="next"
                                    editable={!isSubmitting}
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

                            {/* Confirm Password */}
                            <Text style={styles.label}>
                                Confirm password
                            </Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={confirmPassword}
                                    onChangeText={(value) => {
                                        setConfirmPassword(value);
                                        setValidationError("");
                                        setRegistrationError("");
                                    }}
                                    placeholder="Enter password again"
                                    placeholderTextColor={colors.inputPlaceholder}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="new-password"
                                    textContentType="newPassword"
                                    accessibilityLabel="Confirm password"
                                    returnKeyType="done"
                                    editable={!isSubmitting}
                                />

                                <Pressable
                                    style={styles.visibilityButton}
                                    onPress={() => {
                                        setShowConfirmPassword(
                                            (visible) => !visible,
                                        );
                                    }}
                                    disabled={isSubmitting}
                                    accessibilityRole="button"
                                    accessibilityLabel={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    <Text style={styles.visibilityText}>
                                        {showConfirmPassword ? "Hide" : "Show"}
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

                            {registrationError ? (
                                <Text
                                    style={styles.errorText}
                                    accessibilityRole="alert"
                                >
                                    {registrationError}
                                </Text>
                            ) : null}

                            {/* Create Account */}
                            <Pressable
                                onPress={() => void handleCreateAccount()}
                                disabled={isSubmitting}
                                accessibilityRole="button"
                                accessibilityLabel="Create ZELO account"
                                accessibilityState={{
                                    disabled: isSubmitting,
                                    busy: isSubmitting,
                                }}
                                style={({ pressed }) => [
                                    styles.primaryButton,
                                    pressed && !isSubmitting && styles.buttonPressed,
                                    isSubmitting && styles.disabledButton,
                                ]}
                            >
                                <LinearGradient
                                    colors={["#8B5CF6", "#6428D9"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradientPrimaryButton}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator
                                            size="small"
                                            color={colors.white}
                                        />
                                    ) : (
                                        <>
                                            <Text style={styles.primaryButtonText}>
                                                Create Account
                                            </Text>

                                            <Text style={styles.buttonArrow}>
                                                →
                                            </Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </Pressable>

                            <Text style={styles.secureNote}>
                                Your learning journey starts here.
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
                                onPress={showComingSoon}
                                accessibilityRole="button"
                                accessibilityLabel="Continue with Google"
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
                                onPress={showComingSoon}
                                accessibilityRole="button"
                                accessibilityLabel="Continue with Apple"
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

                        {/* Login Navigation */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already have an account?
                            </Text>

                            <Pressable
                                onPress={() => router.replace("/login")}
                                accessibilityRole="button"
                                accessibilityLabel="Go to sign in"
                            >
                                <Text style={styles.linkText}>
                                    Sign In
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}