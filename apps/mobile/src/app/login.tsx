import { Redirect, Link } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useAuth } from "../lib/auth/auth-context";

export default function LoginScreen() {
    const { state, retryRestore } = useAuth();

    if (state.status === "loading") {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#6558F5" />

                <Text style={styles.message}>
                    Checking your session...
                </Text>
            </View>
        );
    }

    if (state.status === "authenticated") {
        return <Redirect href="/home" />;
    }

    if (state.status === "error") {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Unable to restore session
                </Text>

                <Text style={styles.message}>
                    {state.message}
                </Text>

                <Pressable
                    style={styles.primaryButton}
                    onPress={() => void retryRestore()}
                >
                    <Text style={styles.primaryButtonText}>
                        Try Again
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to ZELO</Text>

            <Text style={styles.subtitle}>
                Your coding journey starts here.
            </Text>

            <Text style={styles.message}>
                Email and password sign-in will be connected
                in the next authentication feature.
            </Text>

            <Link href="/" asChild>
                <Pressable style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>
                        Back to Home
                    </Text>
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#242424",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 12,
        fontSize: 16,
        color: "#6558F5",
        textAlign: "center",
    },
    message: {
        marginTop: 20,
        fontSize: 15,
        lineHeight: 23,
        color: "#666666",
        textAlign: "center",
    },
    primaryButton: {
        marginTop: 24,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: "#6558F5",
    },
    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        marginTop: 28,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#6558F5",
    },
    secondaryButtonText: {
        color: "#6558F5",
        fontSize: 15,
        fontWeight: "600",
    },
});