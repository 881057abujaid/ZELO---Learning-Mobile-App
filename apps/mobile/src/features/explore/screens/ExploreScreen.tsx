import {
    Image,
    ScrollView,
    Text,
    Pressable,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../theme";

import { exploreStyles as styles } from "./ExploreScreen.styles";
import { AppHeader } from "../../../components/navigation/AppHeader";
import { BottomNavigation } from "../../../components/navigation/BottomNavigation";

// Curriculum worlds. Illustrations are local assets to keep the screen reliable offline.
const worlds = [
    {
        id: 1,
        name: "Frontend Foundations",
        description: "Learn how web pages are structured with HTML.",
        technology: "HTML",
        image: require("../../../../assets/worlds/world-html.webp"),
        accent: "#6B45F5",
        background: "#F0EAFF",
        recommended: true,
    },
    {
        id: 2,
        name: "Styling Studio",
        description: "Make web pages attractive and responsive with CSS.",
        technology: "CSS",
        image: require("../../../../assets/worlds/world-css.webp"),
        accent: "#F28A25",
        background: "#FFF5E7",
        recommended: false,
    },
    {
        id: 3,
        name: "JavaScript Lab",
        description: "Learn programming logic and add interactivity to websites.",
        technology: "JavaScript",
        image: require("../../../../assets/worlds/world-javascript.webp"),
        accent: "#348AFF",
        background: "#EAF4FF",
        recommended: false,
    },
    {
        id: 4,
        name: "React World",
        description: "Build reusable UI components and interactive web applications.",
        technology: "React",
        image: require("../../../../assets/worlds/world-react.webp"),
        accent: "#16A66A",
        background: "#E9F9F1",
        recommended: false,
    },
];

export default function ExploreScreen() {
    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <AppHeader showSearch showNotifications showProfile />

                    <View style={styles.titleSection}>
                        <Text style={styles.pageTitle}>Explore</Text>
                        <Text style={styles.pageSubtitle}>Choose your next skill.</Text>
                    </View>

                    <View style={styles.worldList}>
                        {worlds.map((world) => (
                            <WorldCard key={world.id} world={world} />
                        ))}
                    </View>
                </ScrollView>

                <BottomNavigation activeTab="explore" />
            </View>
        </SafeAreaView>
    );
}

interface WorldCardProps {
    world: (typeof worlds)[number];
}

function WorldCard({ world }: WorldCardProps) {
    return (
        <Pressable
            style={[styles.worldCard, { backgroundColor: world.background }]}
            disabled
            accessibilityRole="button"
            accessibilityLabel={`${world.name}, ${world.technology} world`}
        >
            <View style={styles.worldIllustration}>
                <Image
                    source={world.image}
                    style={styles.worldImage}
                    resizeMode="cover"
                    accessibilityLabel={`${world.name} illustration`}
                />
                <View style={[styles.worldNumberBadge, { backgroundColor: world.accent }]}>
                    <Text style={styles.worldNumberText}>{world.id}</Text>
                </View>
            </View>

            <View style={styles.worldContent}>
                <Text style={[styles.worldEyebrow, { color: world.accent }]}>
                    WORLD {String(world.id).padStart(2, "0")} · {world.technology.toUpperCase()}
                </Text>
                <Text style={styles.worldTitle}>{world.name}</Text>
                <Text style={styles.worldDescription} numberOfLines={2}>
                    {world.description}
                </Text>

                <View style={styles.progressSection}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { backgroundColor: world.accent, width: "0%" }]} />
                    </View>
                    <Text style={styles.progressLabel}>Progress unavailable</Text>
                </View>
            </View>

            <View style={styles.worldRightSection}>
                {world.recommended && (
                    <View style={styles.recommendedBadge}>
                        <Ionicons name="sparkles" size={10} color="#B66A00" />
                        <Text style={styles.recommendedText}>Start here</Text>
                    </View>
                )}
                <View style={styles.arrowButton}>
                    <Ionicons name="chevron-forward" size={21} color={colors.primary} />
                </View>
            </View>
        </Pressable>
    );
}
