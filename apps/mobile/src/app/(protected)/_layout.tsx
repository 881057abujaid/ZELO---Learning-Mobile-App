import { Stack, Redirect } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useAuth } from "../../lib/auth/auth-context";

export default function ProtectedLayout() {
    const { state, retryRestore } = useAuth();

    if (state.status === "loading") {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#6558F5" />

                <Text style={styles.message}>
                    Verifying your session...
                </Text>
            </View>
        );
    }

    if (state.status === "error") {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    Unable to verify your session
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

    if (state.status === "unauthenticated") {
        return <Redirect href="/" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#242424",
        textAlign: "center",
    },
    message: {
        marginTop: 16,
        fontSize: 15,
        lineHeight: 22,
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
});