import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import storageService from "../../services/storageService";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function PreApprovalForm() {
    const navigation = useNavigation();

    const [form, setForm] = useState({
        type: "VISITOR", // Default set kar diya taaki empty na rahe
        name: "",
        mobile: "",
        partner: "",
    });

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.mobile) {
            Alert.alert("Missing Details", "Bhai, naam aur mobile number toh daal do! 😤");
            return;
        }

        const newRequest = {
            ...form,
            id: Date.now(),
            status: "APPROVED", // Pre-approval hamesha already approved hota hai
            createdAt: new Date().toLocaleTimeString(),
        };

        try {
            const oldData = await storageService.getItem("preApprovals");
            const parsedData = oldData ? JSON.parse(oldData) : [];
            const updated = [newRequest, ...parsedData];

            await storageService.setItem("preApprovals", JSON.stringify(updated));

            Alert.alert("Pass Generated 🚀", `Entry pass created for ${form.name}. Guard will see this on their gate terminal.`);
            navigation.goBack();
        } catch (err) {
            console.log("Error saving:", err);
            Alert.alert("Error", "Something went wrong while saving.");
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

                    {/* BACK BUTTON & HEADER */}
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
                        {/* TYPE SELECTION CHIPS */}
                        <Text style={styles.label}>Who is coming?</Text>
                        <View style={styles.typeRow}>
                            <TouchableOpacity
                                style={[styles.typeBtn, form.type === "VISITOR" && styles.activeBtn]}
                                onPress={() => handleChange("type", "VISITOR")}
                            >
                                <Ionicons name="people" size={20} color={form.type === "VISITOR" ? "#fff" : "#64748b"} />
                                <Text style={[styles.btnText, form.type === "VISITOR" && styles.activeBtnText]}>Guest</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.typeBtn, form.type === "DELIVERY" && styles.activeBtn]}
                                onPress={() => handleChange("type", "DELIVERY")}
                            >
                                <Ionicons name="cart" size={20} color={form.type === "DELIVERY" ? "#fff" : "#64748b"} />
                                <Text style={[styles.btnText, form.type === "DELIVERY" && styles.activeBtnText]}>Delivery</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        {/* INPUT FIELDS */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Visitor Full Name</Text>
                            <TextInput
                                placeholder="e.g. Mukesh Ambani"
                                placeholderTextColor="#94a3b8"
                                value={form.name}
                                onChangeText={(text) => handleChange("name", text)}
                                style={styles.input}
                            />
                        </View>

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

                        {form.type === "DELIVERY" && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Delivery Service</Text>
                                <TextInput
                                    placeholder="Swiggy, Zomato, BlueDart..."
                                    placeholderTextColor="#94a3b8"
                                    value={form.partner}
                                    onChangeText={(text) => handleChange("partner", text)}
                                    style={styles.input}
                                />
                            </View>
                        )}
                    </View>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
                        <Text style={styles.submitText}>Generate Digital Pass</Text>
                        <Ionicons name="qr-code-outline" size={20} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.footerNote}>
                        Note: Guard will be able to see this approval when the visitor arrives.
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
    activeBtn: { backgroundColor: "#0f766e" }, // Using your Teal color
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
    footerNote: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20, paddingHorizontal: 20 }
});