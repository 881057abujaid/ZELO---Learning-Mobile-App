import { useEffect } from "react";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import {
    Exo2_700Bold,
    Exo2_800ExtraBold,
    Exo2_900Black,
} from "@expo-google-fonts/exo-2";

import {
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
} from "@expo-google-fonts/nunito-sans";

import { AuthProvider } from "../lib/auth/auth-context";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Exo2_700Bold,
        Exo2_800ExtraBold,
        Exo2_900Black,
        NunitoSans_400Regular,
        NunitoSans_600SemiBold,
        NunitoSans_700Bold,
        NunitoSans_800ExtraBold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            void SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </AuthProvider>
    );
}
