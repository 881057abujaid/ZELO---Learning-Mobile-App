import { StyleSheet } from "react-native";

import { colors } from "../../../theme";
import { radius } from "../../../theme/shape";
import { typography } from "../../../theme/typography";

export const exploreStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    scrollContent: {
        paddingHorizontal: 18,
        paddingBottom: 24,
    },

    /* =========================
       TITLE
    ========================= */

    titleSection: {
        marginBottom: 22,
    },

    pageTitle: {
        fontFamily: typography.family.display,
        fontSize: 43,
        lineHeight: 50,
        color: colors.textPrimary,
    },

    pageSubtitle: {
        fontFamily: typography.family.body,
        fontSize: 18,
        lineHeight: 25,
        color: colors.textSecondary,
        marginTop: 3,
    },

    /* =========================
       WORLD LIST
    ========================= */

    worldList: {
        gap: 16,
    },

    /* =========================
       WORLD CARD
    ========================= */

    worldCard: {
        minHeight: 205,
        borderRadius: radius.xl,
        padding: 13,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.7)",
    },

    worldIllustration: {
        width: 112,
        height: 150,
        borderRadius: radius.lg,

        alignItems: "center",
        justifyContent: "center",

        position: "relative",
        overflow: "hidden",
    },

    worldNumberBadge: {
        position: "absolute",
        top: 8,
        left: 8,

        width: 25,
        height: 25,
        borderRadius: radius.full,

        alignItems: "center",
        justifyContent: "center",
    },

    worldNumberText: {
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 12,
        color: colors.white,
    },

    /* =========================
       WORLD CONTENT
    ========================= */

    worldContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
        minWidth: 0,
    },

    worldEyebrow: {
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 12,
        letterSpacing: 0.4,
        marginBottom: 4,
    },

    worldTitle: {
        fontFamily: typography.family.heading,
        fontSize: 17,
        lineHeight: 22,
        color: colors.textPrimary,
    },

    worldDescription: {
        fontFamily: typography.family.body,
        fontSize: 12,
        lineHeight: 17,
        color: colors.textSecondary,
        marginTop: 5,
    },

    /* =========================
       PROGRESS
    ========================= */

    progressSection: {
        marginTop: 12,
    },

    progressTrack: {
        height: 8,
        width: "100%",
        borderRadius: radius.full,
        backgroundColor: "rgba(100,90,150,0.12)",
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        borderRadius: radius.full,
    },

    progressLabel: {
        fontFamily: typography.family.bodyMedium,
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 5,
    },

    /* =========================
       RIGHT SECTION
    ========================= */

    worldRightSection: {
        width: 34,
        height: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 5,
    },

    statusBadge: {
        position: "absolute",
        top: 0,
        right: -2,

        paddingHorizontal: 9,
        paddingVertical: 6,

        borderRadius: radius.full,
        backgroundColor: "rgba(255,255,255,0.65)",
    },

    statusText: {
        fontFamily: typography.family.bodyBold,
        fontSize: 9,
        color: colors.textSecondary,
    },

    recommendedBadge: {
        backgroundColor: "#FFE8BD",
    },

    recommendedText: {
        color: "#D97706",
    },

    arrowButton: {
        width: 35,
        height: 35,
        borderRadius: radius.full,
        backgroundColor: "rgba(255,255,255,0.7)",

        alignItems: "center",
        justifyContent: "center",

        position: "absolute",
        bottom: 4,
        right: -2,
    },

    /* =========================
       BOTTOM NAVIGATION
    ========================= */

    bottomNavigation: {
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

    bottomNavItem: {
        flex: 1,
        height: 55,

        alignItems: "center",
        justifyContent: "center",
        gap: 3,

        borderRadius: radius.lg,
    },

    bottomNavItemActive: {
        backgroundColor: colors.primarySoft,
    },

    bottomNavLabel: {
        fontFamily: typography.family.bodyMedium,
        fontSize: 10,
        color: colors.textSecondary,
    },

    bottomNavLabelActive: {
        color: colors.primary,
        fontFamily: typography.family.bodyBold,
    },
});