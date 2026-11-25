import {
    ScrollView,
    Text,
    Pressable,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "../../../theme";

import { exploreStyles as styles } from "./ExploreScreen.styles";
import { AppHeader } from "../../../components/navigation/AppHeader";
import { BottomNavigation } from "../../../components/navigation/BottomNavigation";

// Curriculum worlds
const worlds = [
    {
        id: 1,
        name: "Frontend Foundations",
        description:
            "Learn how web pages are structured with HTML.",
        technology: "HTML",
        icon: "logo-html5" as const,
        accent: "#6B45F5",
        background: "#F0EAFF",
        iconBackground: "#E1D5FF",
        recommended: true,
    },
    {
        id: 2,
        name: "Styling Studio",
        description:
            "Make web pages attractive and responsive with CSS.",
        technology: "CSS",
        icon: "color-palette-outline" as const,
        accent: "#F28A25",
        background: "#FFF5E7",
        iconBackground: "#FFE5BD",
        recommended: false,
    },
    {
        id: 3,
        name: "JavaScript Lab",
        description:
            "Learn programming logic and add interactivity to websites.",
        technology: "JavaScript",
        icon: "logo-javascript" as const,
        accent: "#348AFF",
        background: "#EAF4FF",
        iconBackground: "#D5E8FF",
        recommended: false,
    },
    {
        id: 4,
        name: "React World",
        description:
            "Build reusable UI components and interactive web applications.",
        technology: "React",
        icon: "logo-react" as const,
        accent: "#16A66A",
        background: "#E9F9F1",
        iconBackground: "#D0F2E2",
        recommended: false,
    },
];

export default function ExploreScreen() {
    const router = useRouter();

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top", "bottom"]}
        >
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* HEADER */}
                    <AppHeader
                        showSearch
                        showNotifications
                        showProfile
                    />

                    {/* PAGE TITLE */}
                    <View style={styles.titleSection}>
                        <Text style={styles.pageTitle}>
                            Explore
                        </Text>

                        <Text style={styles.pageSubtitle}>
                            Choose your next skill.
                        </Text>
                    </View>

                    {/* WORLDS */}
                    <View style={styles.worldList}>
                        {worlds.map((world) => (
                            <WorldCard
                                key={world.id}
                                world={world}
                            />
                        ))}
                    </View>
                </ScrollView>

                {/* BOTTOM NAVIGATION */}
                <BottomNavigation activeTab="explore" />
            </View>
        </SafeAreaView>
    );
}

// =========================================
// WORLD CARD
// =========================================

interface WorldCardProps {
    world: (typeof worlds)[number];
}

function WorldCard({ world }: WorldCardProps) {
    return (
        <Pressable
            style={[
                styles.worldCard,
                {
                    backgroundColor: world.background,
                },
            ]}
            disabled
        >
            {/* WORLD ILLUSTRATION PLACEHOLDER */}
            <View
                style={[
                    styles.worldIllustration,
                    {
                        backgroundColor: world.iconBackground,
                    },
                ]}
            >
                <Ionicons
                    name={world.icon}
                    size={54}
                    color={world.accent}
                />

                <View
                    style={[
                        styles.worldNumberBadge,
                        {
                            backgroundColor: world.accent,
                        },
                    ]}
                >
                    <Text style={styles.worldNumberText}>
                        {world.id}
                    </Text>
                </View>
            </View>

            {/* WORLD CONTENT */}
            <View style={styles.worldContent}>
                <Text
                    style={[
                        styles.worldEyebrow,
                        {
                            color: world.accent,
                        },
                    ]}
                >
                    WORLD {world.id}
                </Text>

                <Text style={styles.worldTitle}>
                    {world.name}
                </Text>

                <Text style={styles.worldDescription}>
                    {world.description}
                </Text>

                {/* PROGRESS */}
                <View style={styles.progressSection}>
                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    backgroundColor: world.accent,
                                    width: "0%",
                                },
                            ]}
                        />
                    </View>

                    <Text style={styles.progressLabel}>
                        Progress unavailable
                    </Text>
                </View>
            </View>

            {/* STATUS / ARROW */}
            <View style={styles.worldRightSection}>
                {world.recommended ? (
                    <View
                        style={[
                            styles.statusBadge,
                            styles.recommendedBadge,
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                styles.recommendedText,
                            ]}
                        >
                            Recommended
                        </Text>
                    </View>
                ) : (
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            Available
                        </Text>
                    </View>
                )}

                <View style={styles.arrowButton}>
                    <Ionicons
                        name="chevron-forward"
                        size={25}
                        color={colors.primary}
                    />
                </View>
            </View>
        </Pressable>
    );
}