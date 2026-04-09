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
    ScrollView
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";

export default function CreateUserScreen() {
    const [user, setUser] = useState({
        name: "",
        role: "OWNER", // Default set kar diya
        flat: ""
    });

    const roles = ["OWNER", "TENANT", "FAMILY"];

    const handleSubmit = () => {
        if (!user.name || !user.role || !user.flat) {
            Alert.alert("Missing Info", "Please fill all details to continue. 📝");
            return;
        }
        console.log("User Created:", user);
        Alert.alert("Success ✅", `${user.name} has been added to the society.`);
        setUser({ name: "", role: "OWNER", flat: "" });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.header}>
                        <Text style={styles.title}>Add Resident</Text>
                        <Text style={styles.subtitle}>Enter details to register a new member</Text>
                    </View>

                    <View style={styles.form}>
                        {/* NAME INPUT */}
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

                        {/* ROLE SELECTION (CHIPS) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Resident Role</Text>
                            <View style={styles.roleContainer}>
                                {roles.map((r) => (
                                    <TouchableOpacity
                                        key={r}
                                        onPress={() => setUser({ ...user, role: r })}
                                        style={[
                                            styles.roleChip,
                                            user.role === r && styles.activeChip
                                        ]}
                                    >
                                        <Text style={[
                                            styles.roleChipText,
                                            user.role === r && styles.activeChipText
                                        ]}>
                                            {r}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* FLAT INPUT */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Flat Number</Text>
                            <TextInput
                                placeholder="e.g. B-402"
                                placeholderTextColor="#94a3b8"
                                value={user.flat}
                                onChangeText={(t) => setUser({ ...user, flat: t })}
                                style={styles.input}
                                autoCapitalize="characters"
                            />
                        </View>

                        {/* SUBMIT BUTTON */}
                        <TouchableOpacity
                            style={styles.submitBtn}
                            onPress={handleSubmit}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.submitBtnText}>Create Member Account</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        marginBottom: 32,
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1e293b",
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: "#64748b",
        marginTop: 4,
    },
    form: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#475569",
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 14,
        fontSize: 16,
        color: "#1e293b",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    roleContainer: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
    },
    roleChip: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "#f1f5f9",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    activeChip: {
        backgroundColor: "#6366f1",
        borderColor: "#6366f1",
    },
    roleChipText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#64748b",
    },
    activeChipText: {
        color: "#fff",
    },
    submitBtn: {
        backgroundColor: "#6366f1",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});