import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { BrandLogo } from "../../../components/branding/BrandLogo";
import { colors } from "../../../theme/colors";

import { styles } from "./AvatarScreen.styles";

type AvatarOption = {
    key: string;
    name: string;
    image: any;
    backgroundColor: string;
    category: "girl" | "boy";
};

const AVATARS: AvatarOption[] = [
    {
        key: "girl_01",
        name: "Luna",
        image: require("../../../../assets/avatars/luna.png"),
        backgroundColor: "#F1E8FF",
        category: "girl",
    },
    {
        key: "girl_02",
        name: "Mia",
        image: require("../../../../assets/avatars/mia.png"),
        backgroundColor: "#FFE9E0",
        category: "girl",
    },
    {
        key: "girl_03",
        name: "Ava",
        image: require("../../../../assets/avatars/ava.png"),
        backgroundColor: "#E3F5FF",
        category: "girl",
    },
    {
        key: "girl_04",
        name: "Zara",
        image: require("../../../../assets/avatars/zara.png"),
        backgroundColor: "#E8F7E8",
        category: "girl",
    },
    {
        key: "boy_01",
        name: "Leo",
        image: require("../../../../assets/avatars/leo.png"),
        backgroundColor: "#E7E8FF",
        category: "boy",
    },
    {
        key: "boy_02",
        name: "Max",
        image: require("../../../../assets/avatars/max.png"),
        backgroundColor: "#FFF1D8",
        category: "boy",
    },
    {
        key: "boy_03",
        name: "Kai",
        image: require("../../../../assets/avatars/kai.png"),
        backgroundColor: "#DFF6F3",
        category: "boy",
    },
    {
        key: "boy_04",
        name: "Aren",
        image: require("../../../../assets/avatars/aren.png"),
        backgroundColor: "#FCE4F2",
        category: "boy",
    },
];

export default function AvatarScreen() {
    const [selectedAvatar, setSelectedAvatar] =
        useState<string | null>(null);

    const handleContinue = () => {
        if (!selectedAvatar) {
            return;
        }

        console.log("Selected avatar:", selectedAvatar);
    };

    const handleSkip = () => {
        console.log("Avatar selection skipped.");
    };

    return (
        <SafeAreaView
            style={styles.screen}
            edges={["top", "bottom"]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* Brand */}
                    <View style={styles.brand}>
                        <BrandLogo
                            variant="tagline"
                            width={170}
                        />
                    </View>

                    {/* Heading */}
                    <View style={styles.heading}>
                        <Text style={styles.title}>
                            Choose your avatar
                        </Text>

                        <Text style={styles.subtitle}>
                            Pick a character that represents you!
                        </Text>
                    </View>

                    {/* Avatar Grid */}
                    <View style={styles.avatarGrid}>
                        {AVATARS.map((avatar) => {
                            const isSelected =
                                selectedAvatar === avatar.key;

                            return (
                                <Pressable
                                    key={avatar.key}
                                    onPress={() =>
                                        setSelectedAvatar(
                                            avatar.key,
                                        )
                                    }
                                    accessibilityRole="button"
                                    accessibilityLabel={
                                        `${avatar.name} avatar`
                                    }
                                    accessibilityState={{
                                        selected: isSelected,
                                    }}
                                    style={[
                                        styles.avatarCard,
                                        isSelected &&
                                        styles.avatarCardSelected,
                                    ]}
                                >
                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <View
                                            style={
                                                styles.selectionIndicator
                                            }
                                        >
                                            <Ionicons
                                                name="checkmark"
                                                size={14}
                                                color={colors.white}
                                            />
                                        </View>
                                    )}

                                    {/* Avatar Image */}
                                    <View
                                        style={[
                                            styles.avatarImage,
                                            {
                                                backgroundColor:
                                                    avatar.backgroundColor,
                                            },
                                        ]}
                                    >
                                        <Image
                                            source={avatar.image}
                                            style={styles.avatarImageContent}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    {/* Avatar Name */}
                                    <Text
                                        style={[
                                            styles.avatarName,
                                            isSelected &&
                                            styles.avatarNameSelected,
                                        ]}
                                    >
                                        {avatar.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Selected Avatar Message */}
                    <View style={styles.selectionMessage}>
                        {selectedAvatar ? (
                            <Text style={styles.selectionText}>
                                Great choice! Your avatar is selected.
                            </Text>
                        ) : (
                            <Text style={styles.selectionText}>
                                You can change your avatar anytime.
                            </Text>
                        )}
                    </View>

                    {/* Continue Button */}
                    <Pressable
                        onPress={handleContinue}
                        disabled={!selectedAvatar}
                        accessibilityRole="button"
                        accessibilityLabel="Continue"
                        style={({ pressed }) => [
                            styles.primaryButton,
                            !selectedAvatar &&
                            styles.primaryButtonDisabled,
                            pressed &&
                            selectedAvatar &&
                            styles.buttonPressed,
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>
                            Continue
                        </Text>

                        <Text style={styles.buttonArrow}>
                            →
                        </Text>
                    </Pressable>

                    {/* Skip */}
                    <Pressable
                        onPress={handleSkip}
                        accessibilityRole="button"
                        accessibilityLabel="Skip avatar selection"
                        style={styles.skipButton}
                    >
                        <Text style={styles.skipButtonText}>
                            Skip for now
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}