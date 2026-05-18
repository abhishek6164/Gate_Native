import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, KeyboardAvoidingView,
    Platform, ScrollView, ActivityIndicator
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import { createUser } from "../../services/authApi";

export default function CreateUserScreen() {
    const [user, setUser] = useState({
        name: "", email: "", mobile: "",
        password: "", role: "FAMILY",
        building: "", flat: ""
    });
    const [loading, setLoading] = useState(false);

    const buildings = ["A", "B", "C", "D"];
    const roles = ["FAMILY", "TENANT"];

    const buildingFlats = {
        A: [1, 2, 3, 4, 5, 6], B: [1, 2, 3, 4, 5],
        C: [1, 2, 3, 4, 5], D: [1, 2, 3, 4]
    };

    const handleSubmit = async () => {
        const { name, email, mobile, password, role, building, flat } = user;
        if (!name || !email || !mobile || !password || !role || !building || !flat) {
            Alert.alert("Missing Info", "Please fill all details 📝");
            return;
        }
        setLoading(true);
        try {
            await createUser(user);
            Alert.alert("Success ✅", `${user.name} has been added to society!`);
            setUser({ name: "", email: "", mobile: "", password: "", role: "FAMILY", building: "", flat: "" });
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const ChipButton = ({ label, value, field }) => (
        <TouchableOpacity
            onPress={() => setUser({ ...user, [field]: value, ...(field === "building" && { flat: "" }) })}
            style={[styles.chip, user[field] === value && styles.activeChip]}
        >
            <Text style={[styles.chipText, user[field] === value && styles.activeChipText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Resident</Text>
                        <Text style={styles.subtitle}>Register a new society member</Text>
                    </View>

                    <View style={styles.form}>
                        {/* NAME */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                placeholder="e.g. Rahul Sharma"
                                placeholderTextColor="#94a3b8"
                                value={user.name}
                                onChangeText={(t) => setUser({ ...user, name: t })}
                                style={styles.input}
                            />
                        </View>

                        {/* EMAIL */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                placeholder="rahul@example.com"
                                placeholderTextColor="#94a3b8"
                                value={user.email}
                                onChangeText={(t) => setUser({ ...user, email: t })}
                                style={styles.input}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        {/* MOBILE */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                placeholder="+91 00000 00000"
                                placeholderTextColor="#94a3b8"
                                value={user.mobile}
                                onChangeText={(t) => setUser({ ...user, mobile: t })}
                                style={styles.input}
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* PASSWORD */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                placeholder="••••••••"
                                placeholderTextColor="#94a3b8"
                                value={user.password}
                                onChangeText={(t) => setUser({ ...user, password: t })}
                                style={styles.input}
                                secureTextEntry
                            />
                        </View>

                        {/* ROLE */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Resident Role</Text>
                            <View style={styles.chipRow}>
                                {roles.map(r => <ChipButton key={r} label={r} value={r} field="role" />)}
                            </View>
                        </View>

                        {/* BUILDING */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Building</Text>
                            <View style={styles.chipRow}>
                                {buildings.map(b => <ChipButton key={b} label={b} value={b} field="building" />)}
                            </View>
                        </View>

                        {/* FLAT */}
                        {user.building ? (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Flat Number</Text>
                                <View style={styles.chipRow}>
                                    {buildingFlats[user.building].map(f => (
                                        <ChipButton key={f} label={String(f)} value={String(f)} field="flat" />
                                    ))}
                                </View>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.submitBtnText}>Create Member Account</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    scrollContent: { padding: 24 },
    header: { marginBottom: 32, marginTop: 10 },
    title: { fontSize: 28, fontWeight: "800", color: "#1e293b", letterSpacing: -0.5 },
    subtitle: { fontSize: 15, color: "#64748b", marginTop: 4 },
    form: {
        backgroundColor: "#fff", padding: 20, borderRadius: 24,
        shadowColor: "#000", shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05, shadowRadius: 20, elevation: 3,
    },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: "700", color: "#475569", marginBottom: 8, marginLeft: 4 },
    input: {
        backgroundColor: "#f1f5f9", paddingHorizontal: 16, paddingVertical: 14,
        borderRadius: 14, fontSize: 16, color: "#1e293b",
        borderWidth: 1, borderColor: "#e2e8f0",
    },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
        backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e2e8f0",
    },
    activeChip: { backgroundColor: "#6366f1", borderColor: "#6366f1" },
    chipText: { fontSize: 13, fontWeight: "700", color: "#64748b" },
    activeChipText: { color: "#fff" },
    submitBtn: {
        backgroundColor: "#6366f1", paddingVertical: 16, borderRadius: 16,
        alignItems: "center", marginTop: 10,
        shadowColor: "#6366f1", shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
    },
    submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});