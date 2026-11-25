import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    typography,
} from "../../theme";

export const appHeaderStyles = StyleSheet.create({

    /* =========================================
       HEADER CONTAINER
    ========================================= */

    header: {
        minHeight: 68,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: 20,
    },


    /* =========================================
       BRAND
    ========================================= */

    brandContainer: {
        justifyContent: "center",
        marginLeft: -18,
    },


    /* =========================================
       HEADER ACTIONS
    ========================================= */

    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },


    /* =========================================
       ICON BUTTON
    ========================================= */

    headerIconButton: {
        width: 42,
        height: 42,

        borderRadius: radius.full,

        backgroundColor: "#F1EEFF",

        alignItems: "center",
        justifyContent: "center",

        position: "relative",
    },


    /* =========================================
       NOTIFICATION DOT
    ========================================= */

    notificationDot: {
        position: "absolute",

        top: 7,
        right: 7,

        width: 8,
        height: 8,

        borderRadius: radius.full,

        backgroundColor: "#FF4966",
    },


    /* =========================================
       PROFILE BUTTON
    ========================================= */

    profileButton: {
        marginLeft: 3,
        position: "relative",
    },


    /* =========================================
       AVATAR
    ========================================= */

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


    /* =========================================
       AVATAR FALLBACK TEXT
    ========================================= */

    avatarText: {
        fontFamily: typography.family.bodyExtraBold,
        fontSize: 20,
        color: colors.brandPurpleDeep,
    },


    /* =========================================
       AVATAR IMAGE
    ========================================= */

    avatarImage: {
        width: "100%",
        height: "100%",

        borderRadius: radius.full,
    },

});