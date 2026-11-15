import { useState } from "react";
import {
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

export default function RegisterScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState("");

    const handleCreateAccount = () => {
        setValidationError("");

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

        Alert.alert(
            "All Set!",
            "Your details are valid. Account creation will be connected in the next step.",
        );
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
                                />

                                <Pressable
                                    style={styles.visibilityButton}
                                    onPress={() => {
                                        setShowPassword((visible) => !visible);
                                    }}
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
                                />

                                <Pressable
                                    style={styles.visibilityButton}
                                    onPress={() => {
                                        setShowConfirmPassword(
                                            (visible) => !visible,
                                        );
                                    }}
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

                            {/* Create Account */}
                            <Pressable
                                onPress={handleCreateAccount}
                                accessibilityRole="button"
                                accessibilityLabel="Create ZELO account"
                                style={({ pressed }) => [
                                    styles.primaryButton,
                                    pressed && styles.buttonPressed,
                                ]}
                            >
                                <LinearGradient
                                    colors={["#8B5CF6", "#6428D9"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gradientPrimaryButton}
                                >
                                    <Text style={styles.primaryButtonText}>
                                        Create Account
                                    </Text>

                                    <Text style={styles.buttonArrow}>
                                        →
                                    </Text>
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