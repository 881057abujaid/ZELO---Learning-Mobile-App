import {
    ScrollView,
    Text,
    Pressable,
    View,
    Image,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { useAuth } from "../../../lib/auth/auth-context";
import { colors } from "../../../theme";
import { BrandLogo } from "../../../components/branding/BrandLogo";
import { homeStyles as styles } from "./HomeScreen.styles";

// Avatar Images mapping
const avatarImages: Record<string, any> = {
    girl_01: require("../../../../assets/avatars/luna.png"),
    girl_02: require("../../../../assets/avatars/mia.png"),
    girl_03: require("../../../../assets/avatars/ava.png"),
    girl_04: require("../../../../assets/avatars/zara.png"),
    boy_01: require("../../../../assets/avatars/leo.png"),
    boy_02: require("../../../../assets/avatars/max.png"),
    boy_03: require("../../../../assets/avatars/kai.png"),
    boy_04: require("../../../../assets/avatars/aren.png"),
};

const statIcons = {
    streak: require("../../../../assets/icons/streak-flame.png"),
    crown: require("../../../../assets/icons/crown.png"),
    coins: require("../../../../assets/icons/coins.png"),
    skill: require("../../../../assets/icons/skill-bars.png"),
};

export default function HomeScreen() {
    const router = useRouter();
    const { state } = useAuth();

    if (state.status !== "authenticated") {
        return null;
    }

    const profile = state.profile.profile;

    const username =
        profile.username ||
        state.profile.email.split("@")[0];

    const initial = username.charAt(0).toUpperCase();
    const avatarKey = profile.avatarKey;

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
                    <View style={styles.header}>
                        <View style={styles.brandContainer}>
                            <BrandLogo
                                variant="tagline"
                                width={140}
                            />
                        </View>

                        <View style={styles.headerActions}>
                            <Pressable
                                style={styles.headerIconButton}
                                accessibilityLabel="Notifications"
                            >
                                <Ionicons
                                    name="notifications-outline"
                                    size={23}
                                    color={colors.textPrimary}
                                />

                                <View style={styles.notificationDot} />
                            </Pressable>

                            <View style={styles.avatar}>
                                {avatarKey && avatarImages[avatarKey] ? (
                                    <Image
                                        source={avatarImages[avatarKey]}
                                        style={styles.avatarImage}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <Text style={styles.avatarText}>
                                        {initial}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

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
                                icon="compass"
                                color="#5594FF"
                                background="#E6F0FF"
                                title="Explore"
                                subtitle="Learning paths"
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
}

function QuickAction({
    icon,
    color,
    background,
    title,
    subtitle,
}: QuickActionProps) {
    return (
        <Pressable
            style={styles.quickActionCard}
            disabled
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