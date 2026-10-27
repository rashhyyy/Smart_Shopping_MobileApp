import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Animated,
} from "react-native";
import { useUser } from "../context/UserContext";

export default function StartPage() {
    const router = useRouter();
    const { isLoggedIn, isLoadingSession } = useUser();

    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!isLoadingSession && isLoggedIn) {
            router.replace("/home");
        }
    }, [isLoadingSession, isLoggedIn]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);



    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.container}
            resizeMode="cover"
        >
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Animated.Image
                    source={require("../../assets/images/logo.png")}
                    style={[
                        styles.logo,
                        {
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                />
            </View>

            {/* Title */}
            <Text style={styles.smart}>Smart</Text>
            <Text style={styles.shopping}>Shopping</Text>

            {/* Indicator */}
            <View style={styles.indicatorContainer}>
                <View style={styles.line} />
                <View style={styles.dot} />
                <View style={styles.line} />
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                Track prices. Save more. Shop smarter.
            </Text>

            {/* Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    if (isLoggedIn) {
                        router.replace("/home");
                    } else {
                        router.push("/login");
                    }
                }}
            >
                <Text style={styles.buttonText}>
                    Get Started →
                </Text>
            </TouchableOpacity>

            {/* Bottom Wave */}

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F7F4",
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: "cover",
    },

    smart: {
        fontSize: 54,
        fontWeight: "800",
        color: "#111",
        marginBottom: -5,
    },

    shopping: {
        fontSize: 54,
        fontWeight: "800",
        color: "#E86817",
    },

    indicatorContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 15,
    },

    line: {
        width: 50,
        height: 1,
        backgroundColor: "#DDD",
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#E86817",
        marginHorizontal: 10,
    },

    subtitle: {
        fontSize: 17,
        color: "#666",
        marginBottom: 40,
    },

    button: {
        backgroundColor: "#F26A16",
        width: "80%",
        height: 62,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },

    buttonText: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "700",
    },
});