import { StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../lib/auth/auth-context";

export default function ProtectedHomeScreen() {
    const { state } = useAuth();

    if (state.status !== "authenticated") {
        return null;
    }

    const { profile } = state;

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>
                ZELO 2.0
            </Text>

            <Text style={styles.title}>
                Welcome back!
            </Text>

            <Text style={styles.subtitle}>
                {profile.profile.username
                    ? `Hello, ${profile.profile.username}!`
                    : profile.email}
            </Text>

            <Text style={styles.description}>
                Your authenticated learning space is ready.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
    },
    eyebrow: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6558F5",
        letterSpacing: 2,
    },
    title: {
        marginTop: 16,
        fontSize: 30,
        fontWeight: "700",
        color: "#242424",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 12,
        fontSize: 18,
        color: "#555555",
        textAlign: "center",
    },
    description: {
        marginTop: 20,
        fontSize: 15,
        lineHeight: 22,
        color: "#777777",
        textAlign: "center",
    },
});