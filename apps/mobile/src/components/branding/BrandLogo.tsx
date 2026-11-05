import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from "react-native";

const wordmark = require("../../../assets/branding/zelo-wordmark.png");
const wordmarkWithTagline = require("../../../assets/branding/zelo-wordmark-tagline.png");
const appIcon = require("../../../assets/branding/zelo-app-icon.png");

type BrandLogoVariant = "wordmark" | "tagline" | "icon";

interface BrandLogoProps {
    variant?: BrandLogoVariant;
    width: number;
    style?: StyleProp<ImageStyle>;
    accessibleLabel?: string;
}

const sources = {
    wordmark,
    tagline: wordmarkWithTagline,
    icon: appIcon,
} as const;

const aspectRatios = {
    wordmark: 2048 / 682,
    tagline: 2048 / 682,
    icon: 1,
} as const;

export function BrandLogo({
    variant = "wordmark",
    width,
    style,
    accessibleLabel = "ZELO — Learn. Practice. Build.",
}: BrandLogoProps) {
    const height = width / aspectRatios[variant];

    return (
        <View style={styles.container}>
            <Image
                source={sources[variant]}
                resizeMode="contain"
                accessibilityRole="image"
                accessibilityLabel={accessibleLabel}
                style={[{ width, height }, style]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
});
