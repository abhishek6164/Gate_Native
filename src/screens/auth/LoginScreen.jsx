import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import storageService from "../../services/storageService";
import { loginUser } from "../../services/authApi";

export default function LoginScreen({ navigation }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const handleLogin = async () => {
        if (!form.email || !form.password) return;

        const cleanData = {
            email: form.email.trim().toLowerCase(),
            password: form.password.trim()
        };

        setLoading(true);
        try {
            const res = await loginUser(cleanData);
            await storageService.setItem("token", res.token);
            await storageService.setItem("user", JSON.stringify(res.user));

            if (res.user.status !== "APPROVED") {
                Alert.alert("Access Restricted", "Please wait for admin approval before logging in.");
                setLoading(false);
                return;
            }

            navigation.replace("Main");
        } catch (error) {
            Alert.alert("Login Failed", error.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = form.email.length > 0 && form.password.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <Text style={{ fontSize: 32 }}>🏢</Text>
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue to MyGate</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholder="name@company.com"
                                placeholderTextColor="#94a3b8"
                                value={form.email}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput(null)}
                                onChangeText={(t) => setForm({ ...form, email: t })}
                                style={[
                                    styles.input,
                                    focusedInput === 'email' && styles.inputFocused
                                ]}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                placeholder="••••••••"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry
                                value={form.password}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                onChangeText={(t) => setForm({ ...form, password: t })}
                                style={[
                                    styles.input,
                                    focusedInput === 'password' && styles.inputFocused
                                ]}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={!isFormValid || loading}
                            activeOpacity={0.8}
                            style={[
                                styles.button,
                                (!isFormValid || loading) && styles.buttonDisabled
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>New to MyGate? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                                <Text style={styles.signupLink}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footer}>
                        <Text style={styles.footerBrand}>🏢 mygate</Text>
                        <View style={styles.badgeRow}>
                            <View style={styles.badge}><Text style={styles.badgeText}>✓ Secure</Text></View>
                            <View style={styles.badge}><Text style={styles.badgeText}>✓ Encrypted</Text></View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc", // Modern off-white/greyish background
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        // Shadow for iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1e293b",
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: "#64748b",
        marginTop: 8,
    },
    formCard: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#475569",
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: "#f1f5f9",
        borderWidth: 1.5,
        borderColor: "transparent",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        fontSize: 16,
        color: "#1e293b",
    },
    inputFocused: {
        borderColor: "#6366f1",
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#4f46e5", // Indigo color
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#4f46e5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: "#a5b4fc",
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: "#64748b",
        fontSize: 14,
    },
    signupLink: {
        color: "#4f46e5",
        fontWeight: "700",
        fontSize: 14,
    },
    footer: {
        marginTop: 40,
        alignItems: "center",
    },
    footerBrand: {
        fontSize: 14,
        fontWeight: "700",
        color: "#94a3b8",
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 10,
    },
    badge: {
        backgroundColor: "#e2e8f0",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 10,
        color: "#64748b",
        fontWeight: "600",
    }
});