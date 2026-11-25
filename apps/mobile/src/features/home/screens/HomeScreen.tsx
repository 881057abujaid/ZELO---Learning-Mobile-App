import {
    ScrollView,
    Text,
    Pressable,
    View,
    Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "../../../theme";
import { homeStyles as styles } from "./HomeScreen.styles";
import { AppHeader } from "../../../components/navigation/AppHeader";

const statIcons = {
    streak: require("../../../../assets/icons/streak-flame.png"),
    crown: require("../../../../assets/icons/crown.png"),
    coins: require("../../../../assets/icons/coins.png"),
    skill: require("../../../../assets/icons/skill-bars.png"),
};

export default function HomeScreen() {
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
                        showNotifications
                        showProfile
                    />

                    {/* GAMIFICATION SUMMARY */}
                    <View style={styles.statsCard}>
                        {/* STREAK */}
                        <View style={styles.statItem}>
                            <View style={styles.statIconContainer}>
                                <Image
                                    source={statIcons.streak}
                                    style={styles.statIcon}
                                    resizeMode="contain"
                                />
                            </View>

                            <Text style={styles.statValue}>
                                —
                            </Text>

                            <Text style={styles.statLabel}>
                                Day Streak
                            </Text>
                        </View>

                        <View style={styles.statDivider} />

                        {/* XP */}
                        <View style={styles.xpStat}>
                            <View style={styles.xpHeader}>
                                <Image
                                    source={statIcons.crown}
                                    style={styles.crownIcon}
                                    resizeMode="contain"
                                />

                                <Text style={styles.statValue}>
                                    Level —
                                </Text>
                            </View>

                            <View style={styles.xpProgressBackground}>
                                <View
                                    style={styles.xpProgressFill}
                                />
                            </View>

                            <Text style={styles.statLabel}>
                                XP not available yet
                            </Text>
                        </View>

                        <View style={styles.statDivider} />

                        {/* COINS */}
                        <View style={styles.statItem}>
                            <Image
                                source={statIcons.coins}
                                style={styles.statIcon}
                                resizeMode="contain"
                            />

                            <Text style={styles.statValue}>
                                —
                            </Text>

                            <Text style={styles.statLabel}>
                                Coins
                            </Text>
                        </View>

                        <View style={styles.statDivider} />

                        {/* LEVEL */}
                        <View style={styles.statItem}>
                            <Image
                                source={statIcons.skill}
                                style={styles.statIcon}
                                resizeMode="contain"
                            />

                            <Text style={styles.levelValue}>
                                Beginner
                            </Text>

                            <Text style={styles.statLabel}>
                                Your Level
                            </Text>
                        </View>
                    </View>

                    {/* CONTINUE LEARNING */}
                    <View style={styles.heroCard}>
                        <Image
                            source={require("../../../../assets/images/hero-banner.png")}
                            style={styles.heroBackgroundImage}
                            resizeMode="cover"
                        />

                        <View style={styles.heroOverlay}>
                            <View style={styles.heroTextContent}>
                                <Text style={styles.heroEyebrow}>
                                    YOUR LEARNING JOURNEY
                                </Text>

                                <Text style={styles.heroTitle}>
                                    Start coding{"\n"}
                                    from zero.
                                </Text>

                                <Text style={styles.heroDescription}>
                                    Learn programming step by step
                                    and build real skills.
                                </Text>

                                <Pressable
                                    style={styles.heroButton}
                                    disabled
                                >
                                    <Text style={styles.heroButtonText}>
                                        Start Learning
                                    </Text>

                                    <Ionicons
                                        name="arrow-forward"
                                        size={18}
                                        color="#FFFFFF"
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* QUICK ACTIONS */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                Quick Actions
                            </Text>
                        </View>

                        <View style={styles.quickActions}>
                            <QuickAction
                                icon="book"
                                color="#8B5CF6"
                                background="#F0E7FF"
                                title="New Lesson"
                                subtitle="Start learning"
                            />

                            <QuickAction
                                icon="code-slash"
                                color="#22C77A"
                                background="#E2F9EC"
                                title="Code Practice"
                                subtitle="Solve challenges"
                            />

                            <QuickAction
                                icon="compass-outline"
                                color={colors.primary}
                                background={colors.primarySoft}
                                title="Explore Worlds"
                                subtitle="Discover your path"
                                onPress={() => router.push("/explore")}
                            />
                        </View>
                    </View>

                    {/* RECOMMENDED */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                Recommended for You
                            </Text>

                            <Pressable
                                style={styles.seeAllButton}
                                disabled
                            >
                                <Text style={styles.seeAllText}>
                                    See All
                                </Text>

                                <Ionicons
                                    name="arrow-forward"
                                    size={17}
                                    color={colors.primary}
                                />
                            </Pressable>
                        </View>

                        <View style={styles.recommendationList}>
                            <RecommendationCard
                                icon="logo-html5"
                                iconColor="#F07845"
                                iconBackground="#FFF0E7"
                                title="HTML Basics"
                                subtitle="Start your web journey"
                                duration="Beginner"
                            />

                            <RecommendationCard
                                icon="logo-css3"
                                iconColor="#478EFF"
                                iconBackground="#E8F1FF"
                                title="CSS Basics"
                                subtitle="Style your webpages"
                                duration="Beginner"
                            />
                        </View>
                    </View>
                </ScrollView>

                {/* BOTTOM NAVIGATION */}
                <View style={styles.bottomNavigation}>
                    <BottomNavItem
                        icon="home"
                        label="Home"
                        active
                    />

                    <BottomNavItem
                        icon="compass-outline"
                        label="Explore"
                        onPress={() => router.push("/explore")}
                    />

                    <BottomNavItem
                        icon="code-slash"
                        label="Code"
                    />

                    <BottomNavItem
                        icon="trophy-outline"
                        label="Quests"
                    />

                    <BottomNavItem
                        icon="person-outline"
                        label="Profile"
                        onPress={() => router.push("/avatar")}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

/* =========================================
   QUICK ACTION COMPONENT
========================================= */

interface QuickActionProps {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    background: string;
    title: string;
    subtitle: string;
    onPress?: () => void;
}

function QuickAction({
    icon,
    color,
    background,
    title,
    subtitle,
    onPress,
}: QuickActionProps) {
    return (
        <Pressable
            style={styles.quickActionCard}
            onPress={onPress}
            disabled={!onPress}
        >
            <View
                style={[
                    styles.quickActionIcon,
                    { backgroundColor: background },
                ]}
            >
                <Ionicons
                    name={icon}
                    size={25}
                    color={color}
                />
            </View>

            <Text style={styles.quickActionTitle}>
                {title}
            </Text>

            <Text style={styles.quickActionSubtitle}>
                {subtitle}
            </Text>
        </Pressable>
    );
}

/* =========================================
   RECOMMENDATION COMPONENT
========================================= */

interface RecommendationCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBackground: string;
    title: string;
    subtitle: string;
    duration: string;
}

function RecommendationCard({
    icon,
    iconColor,
    iconBackground,
    title,
    subtitle,
    duration,
}: RecommendationCardProps) {
    return (
        <Pressable
            style={styles.recommendationCard}
            disabled
        >
            <View
                style={[
                    styles.recommendationIcon,
                    { backgroundColor: iconBackground },
                ]}
            >
                <Ionicons
                    name={icon}
                    size={30}
                    color={iconColor}
                />
            </View>

            <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>
                    {title}
                </Text>

                <Text style={styles.recommendationSubtitle}>
                    {subtitle}
                </Text>

                <View style={styles.recommendationMeta}>
                    <Ionicons
                        name="time-outline"
                        size={14}
                        color={colors.textSecondary}
                    />

                    <Text style={styles.recommendationDuration}>
                        {duration}
                    </Text>
                </View>
            </View>

            <View style={styles.recommendationArrow}>
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.primary}
                />
            </View>
        </Pressable>
    );
}

/* =========================================
   BOTTOM NAVIGATION COMPONENT
========================================= */

interface BottomNavItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    active?: boolean;
    onPress?: () => void;
}

function BottomNavItem({
    icon,
    label,
    active = false,
    onPress,
}: BottomNavItemProps) {
    return (
        <Pressable
            style={[
                styles.bottomNavItem,
                active && styles.bottomNavItemActive,
            ]}
            onPress={onPress}
            disabled={!onPress && !active}
        >
            <Ionicons
                name={icon}
                size={25}
                color={
                    active
                        ? colors.primary
                        : colors.textSecondary
                }
            />

            <Text
                style={[
                    styles.bottomNavLabel,
                    active && styles.bottomNavLabelActive,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}