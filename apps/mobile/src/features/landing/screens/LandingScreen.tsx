import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "../../../lib/auth/auth-context";
import { getOnboardingRoute } from "../../../lib/auth/onboarding-navigation";

import { BrandLogo } from "../../../components/branding/BrandLogo";
import { Button } from "../../../components/ui/Button";

import { styles } from "./LandingScreen.styles";

const mascot = require("../../../../assets/branding/zelo-landing-mascot.png");

export default function LandingScreen() {
    const router = useRouter();
    const { state, retryRestore } = useAuth();

    if (state.status === "loading") {
        return (
            <SafeAreaView style={styles.centeredState}>
                <ActivityIndicator size="large" color="#7357E8" />
                <Text style={styles.stateMessage}>
                    Preparing your learning journey...
                </Text>
            </SafeAreaView>
        );
    }

    if (state.status === "error") {
        return (
            <SafeAreaView style={styles.centeredState}>
                <Text style={styles.errorTitle}>
                    Connection problem
                </Text>

                <Text style={styles.stateMessage}>
                    {state.message}
                </Text>

                <Button
                    title="Try Again"
                    onPress={() => void retryRestore()}
                />
            </SafeAreaView>
        );
    }

    if (state.status === "authenticated") {
        return (
            <Redirect
                href={getOnboardingRoute(state.profile)}
            />
        );
    }

    return (
        <SafeAreaView
            style={styles.screen}
            edges={["top", "bottom"]}
        >
            <StatusBar style="dark" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Brand */}
                    <View style={styles.brandContainer}>
                        <BrandLogo
                            variant="tagline"
                            width={190}
                        />
                    </View>

                    {/* Mascot Illustration */}
                    <View style={styles.illustrationContainer}>
                        <Image
                            source={mascot}
                            style={styles.mascot}
                            resizeMode="contain"
                            accessible
                            accessibilityLabel="ZELO coding mascot working on a laptop"
                        />
                    </View>

                    {/* Welcome Content */}
                    <View style={styles.content}>
                        <Text style={styles.heading}>
                            Learn Programming{"\n"}
                            <Text style={styles.headingHighlight}>
                                The Fun Way
                            </Text>
                        </Text>

                        <Text style={styles.description}>
                            Interactive lessons, real projects and a
                            step-by-step learning journey.
                        </Text>
                    </View>

                    {/* Get Started */}
                    <View style={styles.actions}>
                        <Pressable
                            onPress={() => router.push("/login")}
                            accessibilityRole="button"
                            accessibilityLabel="Get Started"
                            style={({ pressed }) => [
                                styles.buttonWrapper,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <LinearGradient
                                colors={["#8B5CF6", "#6428D9"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.buttonText}>
                                    Get Started
                                </Text>

                                <Text style={styles.buttonArrow}>
                                    →
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}