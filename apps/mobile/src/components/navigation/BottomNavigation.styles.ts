import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    typography,
} from "../../theme";

export const bottomNavigationStyles = StyleSheet.create({
    container: {
        minHeight: 68,
        backgroundColor: colors.surface,

        borderTopWidth: 1,
        borderTopColor: colors.border,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",

        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 3,
    },

    tab: {
        flex: 1,
        height: 55,

        alignItems: "center",
        justifyContent: "center",
        gap: 3,

        borderRadius: radius.lg,
    },

    activeTab: {
        backgroundColor: colors.primarySoft,
    },

    label: {
        fontFamily: typography.family.bodyMedium,
        fontSize: 10,
        color: colors.textSecondary,
    },

    activeLabel: {
        color: colors.primary,
        fontFamily: typography.family.bodyBold,
    },
});