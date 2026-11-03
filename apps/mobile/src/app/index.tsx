import { Redirect, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useAuth } from "../lib/auth/auth-context";

export default function HomeScreen() {
    const { state, retryRestore } = useAuth();

    if (state.status === "loading") {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#6558F5" />

                <Text style={styles.message}>
                    Restoring your session...
                </Text>
            </View>
        );
    }

    if (state.status === "error") {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Connection problem
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

    if (state.status === "authenticated") {
        return <Redirect href="/home" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ZELO 2.0</Text>

            <Text style={styles.subtitle}>
                Learn. Practice. Build.
            </Text>

            <Text style={styles.description}>
                Your coding journey starts here.
            </Text>

            <Link href="/login" asChild>
                <Pressable style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>
                        Get Started
                    </Text>
                </Pressable>
            </Link>

            <StatusBar style="dark" />
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
        fontSize: 32,
        fontWeight: "700",
        color: "#242424",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 8,
        fontSize: 16,
        color: "#6558F5",
        fontWeight: "600",
    },
    description: {
        marginTop: 16,
        marginBottom: 28,
        fontSize: 15,
        color: "#666666",
        textAlign: "center",
    },
    message: {
        marginTop: 16,
        fontSize: 15,
        color: "#666666",
        textAlign: "center",
        lineHeight: 22,
    },
    primaryButton: {
        marginTop: 24,
        minWidth: 180,
        alignItems: "center",
        justifyContent: "center",
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
});