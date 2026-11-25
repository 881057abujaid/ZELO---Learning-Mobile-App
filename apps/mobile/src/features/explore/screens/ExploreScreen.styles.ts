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
    titleSection: {
        marginBottom: 20,
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
    worldList: {
        gap: 14,
    },
    worldCard: {
        height: 176,
        borderRadius: radius.xl,
        padding: 10,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.9)",

        shadowColor: "#31245A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.045,
        shadowRadius: 8,
        elevation: 2,

        overflow: "hidden",
    },
    worldIllustration: {
        width: 108,
        height: 154,
        borderRadius: radius.lg,

        position: "relative",
        overflow: "hidden",

        backgroundColor: "rgba(255,255,255,0.55)",
        flexShrink: 0,
    },
    worldImage: {
        width: "100%",
        height: "100%",
    },
    worldNumberBadge: {
        position: "absolute",
        top: 7,
        left: 7,
        width: 25,
        height: 25,
        borderRadius: radius.full,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "rgba(255,255,255,0.85)",
    },
    worldNumberText: {
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 12,
        color: colors.white,
    },
    worldContent: {
        flex: 1,
        marginLeft: 11,
        justifyContent: "center",
        minWidth: 0,
    },
    worldEyebrow: {
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 10,
        letterSpacing: 0.35,
        marginBottom: 4,
    },
    worldTitle: {
        fontFamily: typography.family.heading,
        fontSize: 16,
        lineHeight: 21,
        color: colors.textPrimary,
    },
    worldDescription: {
        fontFamily: typography.family.body,
        fontSize: 11,
        lineHeight: 15,
        color: colors.textSecondary,
        marginTop: 4,
    },
    progressSection: {
        marginTop: 10,
    },
    progressTrack: {
        height: 6,
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
        fontSize: 9,
        color: colors.textSecondary,
        marginTop: 4,
    },
    worldRightSection: {
        width: 30,
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "flex-end",
        marginLeft: 4,
    },
    recommendedBadge: {
        position: "absolute",
        top: 1,
        right: -1,
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        paddingHorizontal: 6,
        paddingVertical: 5,
        borderRadius: radius.full,
        backgroundColor: "#FFE8BD",
    },
    recommendedText: {
        fontFamily: typography.family.bodyBold,
        fontSize: 8,
        color: "#B66A00",
    },
    arrowButton: {
        width: 30,
        height: 30,
        borderRadius: radius.full,
        backgroundColor: "rgba(255,255,255,0.8)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 1,
    },
});
