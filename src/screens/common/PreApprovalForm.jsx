import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Alert,
    KeyboardAvoidingView, Platform, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createPreApproval } from "../../services/authApi";

export default function PreApprovalForm() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        type: "VISITOR",
        name: "",
        mobile: "",
        deliveryPartner: "",
    });

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.mobile) {
            Alert.alert("Missing Details", "Naam aur mobile number zaroori hai!");
            return;
        }

        if (form.mobile.length !== 10) {
            Alert.alert("Invalid Mobile", "10 digit ka mobile number daalo!");
            return;
        }

        setLoading(true);
        try {
            // Logged in user ka building aur flat AsyncStorage se lo
            const userData = await AsyncStorage.getItem("user");
            const user = JSON.parse(userData);

            // Valid till — aaj se 1 din baad
            const validTill = new Date();
            validTill.setDate(validTill.getDate() + 1);

            await createPreApproval({
                type: form.type,
                name: form.name,
                mobile: form.mobile,
                deliveryPartner: form.deliveryPartner || "",
                building: user.building,
                flat: user.flat,
                validTill: validTill.toISOString()
            });

            Alert.alert(
                "Pass Generated 🚀",
                `Entry pass created for ${form.name}. Guard will see this on their gate terminal.`
            );

            setForm({ type: "VISITOR", name: "", mobile: "", deliveryPartner: "" });
            navigation.goBack();

        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    {/* HEADER */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color="#1e293b" />
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.title}>Pre-Approve</Text>
                            <Text style={styles.subtitle}>Create a digital entry pass</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        {/* TYPE SELECTION */}
                        <Text style={styles.label}>Who is coming?</Text>
                        <View style={styles.typeRow}>
                            <TouchableOpacity
                                style={[styles.typeBtn, form.type === "VISITOR" && styles.activeBtn]}
                                onPress={() => handleChange("type", "VISITOR")}
                            >
                                <Ionicons
                                    name="people"
                                    size={20}
                                    color={form.type === "VISITOR" ? "#fff" : "#64748b"}
                                />
                                <Text style={[styles.btnText, form.type === "VISITOR" && styles.activeBtnText]}>
                                    Guest
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.typeBtn, form.type === "DELIVERY" && styles.activeBtn]}
                                onPress={() => handleChange("type", "DELIVERY")}
                            >
                                <Ionicons
                                    name="cart"
                                    size={20}
                                    color={form.type === "DELIVERY" ? "#fff" : "#64748b"}
                                />
                                <Text style={[styles.btnText, form.type === "DELIVERY" && styles.activeBtnText]}>
                                    Delivery
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        {/* NAME */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Visitor Full Name</Text>
                            <TextInput
                                placeholder="e.g. Rahul Sharma"
                                placeholderTextColor="#94a3b8"
                                value={form.name}
                                onChangeText={(text) => handleChange("name", text)}
                                style={styles.input}
                            />
                        </View>

                        {/* MOBILE */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                placeholder="10-digit number"
                                placeholderTextColor="#94a3b8"
                                value={form.mobile}
                                keyboardType="numeric"
                                maxLength={10}
                                onChangeText={(text) => handleChange("mobile", text)}
                                style={styles.input}
                            />
                        </View>

                        {/* DELIVERY PARTNER */}
                        {form.type === "DELIVERY" && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Delivery Service</Text>
                                <TextInput
                                    placeholder="Swiggy, Zomato, BlueDart..."
                                    placeholderTextColor="#94a3b8"
                                    value={form.deliveryPartner}
                                    onChangeText={(text) => handleChange("deliveryPartner", text)}
                                    style={styles.input}
                                />
                            </View>
                        )}
                    </View>

                    {/* SUBMIT */}
                    <TouchableOpacity
                        style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.submitText}>Generate Digital Pass</Text>
                                <Ionicons name="qr-code-outline" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.footerNote}>
                        Note: Guard will be able to see this approval when the visitor arrives.
                        Pass is valid for 24 hours.
                    </Text>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    scrollContent: { padding: 20 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 15 },
    backBtn: { padding: 8, backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
    title: { fontSize: 26, fontWeight: "800", color: "#1e293b" },
    subtitle: { fontSize: 14, color: "#64748b" },
    card: {
        backgroundColor: "#fff", padding: 20, borderRadius: 24,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 15, elevation: 5
    },
    label: { fontSize: 14, fontWeight: "700", color: "#475569", marginBottom: 12 },
    typeRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
    typeBtn: {
        flex: 1, flexDirection: 'row', padding: 14, borderRadius: 14,
        backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: 'center', gap: 8
    },
    activeBtn: { backgroundColor: "#0f766e" },
    btnText: { color: "#64748b", fontWeight: "700" },
    activeBtnText: { color: "#fff" },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 20 },
    inputGroup: { marginBottom: 18 },
    input: {
        backgroundColor: "#f8fafc", padding: 14, borderRadius: 12,
        borderWidth: 1, borderColor: "#e2e8f0", fontSize: 16, color: "#1e293b"
    },
    submitBtn: {
        marginTop: 25, backgroundColor: "#0f766e", padding: 18, borderRadius: 18,
        flexDirection: 'row', alignItems: "center", justifyContent: "center", gap: 10,
        shadowColor: "#0f766e", shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
    },
    submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    footerNote: {
        textAlign: 'center', color: '#94a3b8', fontSize: 12,
        marginTop: 20, paddingHorizontal: 20
    }
});