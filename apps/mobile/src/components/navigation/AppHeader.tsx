import {
    View,
    Text,
    Pressable,
    Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuth } from "../../lib/auth/auth-context";
import { colors } from "../../theme";
import { BrandLogo } from "../branding/BrandLogo";

import { appHeaderStyles as styles } from "./AppHeader.styles";

/* =========================================
   AVATAR IMAGES
========================================= */

const avatarImages: Record<string, any> = {
    girl_01: require("../../../assets/avatars/luna.png"),
    girl_02: require("../../../assets/avatars/mia.png"),
    girl_03: require("../../../assets/avatars/ava.png"),
    girl_04: require("../../../assets/avatars/zara.png"),

    boy_01: require("../../../assets/avatars/leo.png"),
    boy_02: require("../../../assets/avatars/max.png"),
    boy_03: require("../../../assets/avatars/kai.png"),
    boy_04: require("../../../assets/avatars/aren.png"),
};

/* =========================================
   APP HEADER
========================================= */

interface AppHeaderProps {
    showSearch?: boolean;
    showNotifications?: boolean;
    showProfile?: boolean;
}

export function AppHeader({
    showSearch = false,
    showNotifications = true,
    showProfile = true,
}: AppHeaderProps) {
    const router = useRouter();
    const { state } = useAuth();

    /* AUTH GUARD */

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
        <View style={styles.header}>
            {/* BRAND LOGO */}

            <View style={styles.brandContainer}>
                <BrandLogo
                    variant="tagline"
                    width={140}
                />
            </View>

            {/* HEADER ACTIONS */}

            <View style={styles.headerActions}>
                {/* SEARCH */}

                {showSearch && (
                    <Pressable
                        style={styles.headerIconButton}
                        accessibilityLabel="Search"
                        disabled
                    >
                        <Ionicons
                            name="search"
                            size={23}
                            color={colors.textPrimary}
                        />
                    </Pressable>
                )}

                {/* NOTIFICATIONS */}

                {showNotifications && (
                    <Pressable
                        style={styles.headerIconButton}
                        accessibilityLabel="Notifications"
                        disabled
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={23}
                            color={colors.textPrimary}
                        />

                        <View style={styles.notificationDot} />
                    </Pressable>
                )}

                {/* PROFILE */}

                {showProfile && (
                    <Pressable
                        style={styles.profileButton}
                        onPress={() => router.push("/avatar")}
                        accessibilityLabel="Open profile"
                    >
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
                    </Pressable>
                )}
            </View>
        </View>
    );
}