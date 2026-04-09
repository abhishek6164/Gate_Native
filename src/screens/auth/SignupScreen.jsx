import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from "react-native";
import { signupUser } from "../../services/authApi";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function SignupScreen({ navigation }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "",
        building: "",
        flat: ""
    });
    const [loading, setLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const buildingFlats = {
        A: [1, 2, 3, 4, 5, 6],
        B: [1, 2, 3, 4, 5],
        C: [1, 2, 3, 4, 5],
        D: [1, 2, 3, 4]
    };

    const handleSignup = async () => {
        const isValid = Object.values(form).every(value => value.trim() !== "");

        if (!isValid) {
            Alert.alert("Missing Fields", "Please fill all the details to continue.");
            return;
        }

        setLoading(true);
        try {
            await signupUser({ ...form, status: "PENDING" });
            Alert.alert("Success", "Signup request sent! Please wait for admin approval.");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const renderSelectButton = (label, value, type) => {
        const isActive = form[type] === value;
        return (
            <TouchableOpacity
                key={value}
                activeOpacity={0.7}
                style={[styles.selectBtn, isActive && styles.activeSelectBtn]}
                onPress={() => setForm({ ...form, [type]: value, ...(type === 'building' && { flat: "" }) })}
            >
                <Text style={[styles.selectBtnText, isActive && styles.activeSelectBtnText]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <Text style={{ fontSize: 32 }}>🏢</Text>
                        </View>
                        <Text style={styles.title}>Join MyGate</Text>
                        <Text style={styles.subtitle}>Create an account to join your community</Text>
                    </View>

                    <View style={styles.formCard}>
                        {/* Basic Info */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                placeholder="John Doe"
                                placeholderTextColor="#94a3b8"
                                style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
                                onFocus={() => setFocusedInput('name')}
                                onBlur={() => setFocusedInput(null)}
                                onChangeText={(t) => setForm({ ...form, name: t })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholder="john@example.com"
                                placeholderTextColor="#94a3b8"
                                style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput(null)}
                                onChangeText={(t) => setForm({ ...form, email: t })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                keyboardType="phone-pad"
                                placeholder="+91 00000 00000"
                                placeholderTextColor="#94a3b8"
                                style={[styles.input, focusedInput === 'mobile' && styles.inputFocused]}
                                onFocus={() => setFocusedInput('mobile')}
                                onBlur={() => setFocusedInput(null)}
                                onChangeText={(t) => setForm({ ...form, mobile: t })}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                secureTextEntry
                                placeholder="••••••••"
                                placeholderTextColor="#94a3b8"
                                style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                onChangeText={(t) => setForm({ ...form, password: t })}
                            />
                        </View>

                        {/* Account Type Selection */}
                        <Text style={styles.label}>I am a...</Text>
                        <View style={styles.chipRow}>
                            {['FAMILY', 'TENANT'].map(role => renderSelectButton(role === 'FAMILY' ? 'Family Member' : 'Tenant', role, 'role'))}
                        </View>

                        {/* Building Selection */}
                        <Text style={styles.label}>Building</Text>
                        <View style={styles.chipRow}>
                            {Object.keys(buildingFlats).map(b => renderSelectButton(b, b, 'building'))}
                        </View>

                        {/* Flat Selection */}
                        {form.building ? (
                            <>
                                <Text style={styles.label}>Flat Number</Text>
                                <View style={styles.chipRow}>
                                    {buildingFlats[form.building].map(f => renderSelectButton(String(f), String(f), 'flat'))}
                                </View>
                            </>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Request Access</Text>}
                        </TouchableOpacity>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerBrand}>🏢 mygate</Text>
                        <Text style={styles.footerText}>Verified & Secure Community</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    scrollContent: { paddingHorizontal: 20, paddingVertical: 30 },
    header: { alignItems: "center", marginBottom: 30 },
    iconCircle: {
        width: 70,
        height: 70,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: { fontSize: 26, fontWeight: "800", color: "#1e293b" },
    subtitle: { fontSize: 15, color: "#64748b", marginTop: 5 },

    formCard: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
    },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "700", color: "#475569", marginBottom: 8, marginTop: 10 },
    input: {
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        fontSize: 15,
        color: "#1e293b",
        borderWidth: 1.5,
        borderColor: "transparent"
    },
    inputFocused: { borderColor: "#6366f1", backgroundColor: "#fff" },

    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
    selectBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#e2e8f0",
        backgroundColor: "#f8fafc",
    },
    activeSelectBtn: {
        backgroundColor: "#6366f1",
        borderColor: "#6366f1",
    },
    selectBtnText: { color: "#64748b", fontWeight: "600", fontSize: 13 },
    activeSelectBtnText: { color: "#fff" },

    button: {
        backgroundColor: "#10b981", // Success Green
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 25,
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

    loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    loginText: { color: "#64748b", fontSize: 14 },
    loginLink: { color: "#6366f1", fontWeight: "700" },

    footer: { marginTop: 30, alignItems: "center" },
    footerBrand: { fontSize: 13, fontWeight: "800", color: "#94a3b8", letterSpacing: 1 },
    footerText: { fontSize: 12, color: "#cbd5e1", marginTop: 4 }
});