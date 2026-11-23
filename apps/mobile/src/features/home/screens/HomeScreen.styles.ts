import { StyleSheet } from "react-native";

import {
    colors,
    spacing,
    radius,
    typography,
} from "../../../theme";

export const homeStyles = StyleSheet.create({
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
        paddingTop: 8,
        paddingBottom: 24,
    },

    /* HEADER */

    header: {
        minHeight: 68,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    brandContainer: {
        justifyContent: "center",
        marginLeft: -18,
    },

    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    headerIconButton: {
        width: 42,
        height: 42,
        borderRadius: radius.full,
        backgroundColor: "#F1EEFF",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    notificationDot: {
        position: "absolute",
        top: 7,
        right: 7,
        width: 8,
        height: 8,
        borderRadius: radius.full,
        backgroundColor: "#FF4966",
    },

    profileButton: {
        marginLeft: 3,
        position: "relative",
    },

    avatar: {
        width: 45,
        height: 45,
        borderRadius: radius.full,
        backgroundColor: "#DED2FF",
        borderWidth: 2,
        borderColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 20,
        color: colors.brandPurpleDeep,
    },

    avatarImage: {
        width: "100%",
        height: "100%",
        borderRadius: radius.full,
    },

    avatarBadge: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 20,
        height: 20,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        borderWidth: 1.5,
        borderColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarBadgeText: {
        fontFamily: typography.family.bodyBold,
        fontSize: 10,
        color: colors.white,
    },

    /* STATS CARD */

    statsCard: {
        minHeight: 112,
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: "#F0ECFA",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 14,
        marginBottom: 22,

        shadowColor: "#4D2AA8",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 2,
    },

    statItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },

    statIconContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    statIcon: {
        width: 30,
        height: 30,
    },

    crownIcon: {
        width: 30,
        height: 30,
    },

    statValue: {
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 17,
        color: colors.textPrimary,
    },

    statLabel: {
        fontFamily: typography.family.body,
        fontSize: 10,
        color: colors.textSecondary,
        textAlign: "center",
    },

    statDivider: {
        width: 1,
        height: 58,
        backgroundColor: colors.border,
        marginHorizontal: 3,
    },

    xpStat: {
        flex: 1.35,
        paddingHorizontal: 5,
    },

    xpHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 7,
    },

    xpProgressBackground: {
        height: 7,
        width: "100%",
        borderRadius: radius.full,
        backgroundColor: "#EAE5FA",
        overflow: "hidden",
        marginBottom: 5,
    },

    xpProgressFill: {
        width: "0%",
        height: "100%",
        borderRadius: radius.full,
        backgroundColor: colors.primary,
    },

    levelValue: {
        fontFamily: typography.family.bodyBold,
        fontSize: 12,
        color: colors.textPrimary,
        textAlign: "center",
    },

    /* HERO CARD */

    heroCard: {
        height: 250,
        borderRadius: radius.xl,
        overflow: "hidden",
        marginBottom: 25,
        backgroundColor: "#E8D9FF",
    },

    heroBackgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },

    heroOverlay: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 18,
        paddingVertical: 16,
    },

    heroTextContent: {
        width: "58%",
        justifyContent: "center",
        zIndex: 2,
    },

    heroEyebrow: {
        fontFamily: typography.family.bodyBold,
        fontSize: 10,
        letterSpacing: 0.8,
        color: "#58439A",
        marginBottom: 8,
    },

    heroTitle: {
        fontFamily: typography.family.heading,
        fontSize: 22,
        lineHeight: 27,
        color: colors.textPrimary,
    },

    heroDescription: {
        fontFamily: typography.family.body,
        fontSize: 11,
        lineHeight: 16,
        color: "#514778",
        marginTop: 7,
        maxWidth: 190,
    },

    heroButton: {
        height: 40,
        paddingHorizontal: 12,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        marginTop: 13,
        alignSelf: "flex-start",
        opacity: 0.9,
    },

    heroButtonText: {
        fontFamily: typography.family.bodyBold,
        fontSize: 11,
        color: colors.white,
    },

    /* SECTION */

    section: {
        marginBottom: 25,
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 13,
        paddingHorizontal: 2,
    },

    sectionTitle: {
        fontFamily: typography.family.heading,
        fontSize: 21,
        color: colors.textPrimary,
    },

    seeAllButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    seeAllText: {
        fontFamily: typography.family.bodyBold,
        fontSize: 13,
        color: colors.primary,
    },

    /* QUICK ACTIONS */

    quickActions: {
        flexDirection: "row",
        gap: 10,
    },

    quickActionCard: {
        flex: 1,
        minHeight: 118,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        paddingVertical: 13,
        paddingHorizontal: 6,
        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: "#EAE5F5",

        borderBottomWidth: 4,
        borderBottomColor: "#D8D0EA",
    },

    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: radius.full,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 9,
    },

    quickActionTitle: {
        fontFamily: typography.family.bodyBold,
        fontSize: 12,
        color: colors.textPrimary,
        textAlign: "center",
    },

    quickActionSubtitle: {
        fontFamily: typography.family.body,
        fontSize: 10,
        color: colors.textSecondary,
        marginTop: 3,
        textAlign: "center",
    },

    /* RECOMMENDATIONS */

    recommendationList: {
        gap: 10,
    },

    recommendationCard: {
        minHeight: 100,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#EAE5F5",

        borderBottomWidth: 4,
        borderBottomColor: "#D8D0EA",
    },

    recommendationIcon: {
        width: 68,
        height: 68,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
    },

    recommendationContent: {
        flex: 1,
        marginLeft: 12,
    },

    recommendationTitle: {
        fontFamily: typography.family.bodyBold,
        fontSize: 14,
        color: colors.textPrimary,
    },

    recommendationSubtitle: {
        fontFamily: typography.family.body,
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 3,
    },

    recommendationMeta: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 7,
    },

    recommendationDuration: {
        fontFamily: typography.family.bodyMedium,
        fontSize: 11,
        color: colors.textSecondary,
    },

    recommendationArrow: {
        width: 32,
        height: 32,
        borderRadius: radius.full,
        backgroundColor: colors.primarySoft,
        alignItems: "center",
        justifyContent: "center",
    },

    /* BOTTOM NAV */

    bottomNavigation: {
        minHeight: 64,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 5,
        paddingTop: 5,
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