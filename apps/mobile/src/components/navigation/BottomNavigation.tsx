import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "../../theme";
import { bottomNavigationStyles as styles } from "./BottomNavigation.styles";

type TabName = "home" | "explore" | "code" | "quests" | "profile";

interface BottomNavigationProps {
    activeTab: TabName;
}

const tabs = [
    {
        id: "home",
        icon: "home",
        label: "Home",
        route: "/home",
    },
    {
        id: "explore",
        icon: "compass",
        label: "Explore",
        route: "/explore",
    },
    {
        id: "code",
        icon: "code-slash",
        label: "Code",
        route: null,
    },
    {
        id: "quests",
        icon: "trophy-outline",
        label: "Quests",
        route: null,
    },
    {
        id: "profile",
        icon: "person-outline",
        label: "Profile",
        route: "/avatar",
    },
] as const;

export function BottomNavigation({
    activeTab,
}: BottomNavigationProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                const isDisabled = tab.route === null;

                return (
                    <Pressable
                        key={tab.id}
                        style={[
                            styles.tab,
                            isActive && styles.activeTab,
                        ]}
                        onPress={() => {
                            if (!tab.route || isActive) return;

                            router.replace(tab.route);
                        }}
                        disabled={isDisabled || isActive}
                        accessibilityRole="tab"
                        accessibilityState={{
                            selected: isActive,
                            disabled: isDisabled,
                        }}
                        accessibilityLabel={tab.label}
                    >
                        <Ionicons
                            name={tab.icon}
                            size={25}
                            color={
                                isActive
                                    ? colors.primary
                                    : colors.textSecondary
                            }
                        />

                        <Text
                            style={[
                                styles.label,
                                isActive && styles.activeLabel,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}