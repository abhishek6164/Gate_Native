import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import storageService from "../../services/storageService"; // tera async storage wrapper
import { useNavigation } from "@react-navigation/native";

export default function PreApprovalForm() {
    const navigation = useNavigation();

    const [form, setForm] = useState({
        type: "",
        name: "",
        mobile: "",
        partner: "",
    });

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = async () => {
        if (!form.type || !form.name || !form.mobile) {
            alert("Fill required fields 😤");
            return;
        }

        const newRequest = {
            ...form,
            id: Date.now(),
            status: "PENDING",
        };

        try {
            const oldData = await storageService.getItem("preApprovals");
            const parsedData = oldData ? JSON.parse(oldData) : [];

            const updated = [newRequest, ...parsedData];

            await storageService.setItem(
                "preApprovals",
                JSON.stringify(updated)
            );

            alert("Pre-approval sent 🚀");
            navigation.goBack();
        } catch (err) {
            console.log("Error saving:", err);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>

            <Text style={styles.header}>📋 Pre-Approval</Text>

            {/* TYPE */}
            <View style={styles.row}>
                <TouchableOpacity
                    style={[
                        styles.typeBtn,
                        form.type === "VISITOR" && styles.activeBtn,
                    ]}
                    onPress={() => handleChange("type", "VISITOR")}
                >
                    <Text style={styles.btnText}>Visitor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.typeBtn,
                        form.type === "DELIVERY" && styles.activeBtn,
                    ]}
                    onPress={() => handleChange("type", "DELIVERY")}
                >
                    <Text style={styles.btnText}>Delivery</Text>
                </TouchableOpacity>
            </View>

            {/* NAME */}
            <TextInput
                placeholder="Visitor Name"
                value={form.name}
                onChangeText={(text) => handleChange("name", text)}
                style={styles.input}
            />

            {/* MOBILE */}
            <TextInput
                placeholder="Mobile Number"
                value={form.mobile}
                keyboardType="numeric"
                onChangeText={(text) => handleChange("mobile", text)}
                style={styles.input}
            />

            {/* DELIVERY PARTNER */}
            {form.type === "DELIVERY" && (
                <TextInput
                    placeholder="Delivery Partner (Amazon, Swiggy...)"
                    value={form.partner}
                    onChangeText={(text) => handleChange("partner", text)}
                    style={styles.input}
                />
            )}

            {/* BUTTON */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Send Request</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0fdf4",
        padding: 15,
    },

    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },

    row: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 15,
    },

    typeBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
    },

    activeBtn: {
        backgroundColor: "#0f766e",
    },

    btnText: {
        color: "#fff",
        fontWeight: "600",
    },

    input: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    submitBtn: {
        marginTop: 10,
        backgroundColor: "#0f766e",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },

    submitText: {
        color: "#fff",
        fontWeight: "bold",
    },
});