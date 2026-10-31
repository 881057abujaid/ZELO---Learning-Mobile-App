import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ZELO 2.0</Text>

            <Text style={styles.subtitle}>
                Learn. Practice. Build.
            </Text>

            <StatusBar style="dark" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#242424',
    },
    subtitle: {
        marginTop: 8,
        fontSize: 16,
        color: '#666666',
    },
});