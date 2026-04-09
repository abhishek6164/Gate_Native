import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera"; // Updated import
import { Ionicons } from "@expo/vector-icons";
import storageService from "../../services/storageService";

export default function EntryFormScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraOn, setCameraOn] = useState(false);
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);

    const [entryType, setEntryType] = useState("VISITOR"); // Default set
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        deliveryPartner: "",
        building: "",
        flat: "",
    });

    // Handle missing permissions
    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.cameraBtn} onPress={requestPermission}>
                    <Text style={{ color: '#fff' }}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const capturePhoto = async () => {
        if (cameraRef.current) {
            const photoData = await cameraRef.current.takePictureAsync({ quality: 0.5 });
            setPhoto(photoData.uri);
            setCameraOn(false);
        }
    };

    const handleSubmit = async () => {
        if (!photo) {
            Alert.alert("Photo Required", "Please take a photo of the visitor.");
            return;
        }

        setSubmitting(true);
        try {
            const approvals = await storageService.getItem("preApprovals");
            const parsed = approvals ? JSON.parse(approvals) : [];

            // Check if resident already pre-approved this visitor/delivery
            const match = parsed.find(
                (item) =>
                    item.mobile === formData.mobile &&
                    item.status === "APPROVED"
            );

            if (!match) {
                Alert.alert("❌ Access Denied", "No pre-approval found for this mobile number. Please contact the resident.");
            } else {
                Alert.alert("✅ Verified", `Entry logged for ${formData.name}. Welcome!`);
                setFormData({ name: "", mobile: "", deliveryPartner: "", building: "", flat: "" });
                setPhoto(null);
            }
        } catch (e) {
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const isFormValid = formData.name && formData.mobile && formData.building && formData.flat && photo;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                <View style={styles.header}>
                    <Text style={styles.title}>Gate Terminal</Text>
                    <Text style={styles.subtitle}>Log new entry into society</Text>
                </View>

                {/* TYPE SELECTOR */}
                <View style={styles.typeContainer}>
                    <TouchableOpacity
                        style={[styles.typeBtn, entryType === "VISITOR" && styles.activeTypeBtn]}
                        onPress={() => setEntryType("VISITOR")}
                    >
                        <Ionicons name="person" size={20} color={entryType === "VISITOR" ? "#fff" : "#64748b"} />
                        <Text style={[styles.typeText, entryType === "VISITOR" && styles.activeTypeText]}>Visitor</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.typeBtn, entryType === "DELIVERY" && styles.activeTypeBtn]}
                        onPress={() => setEntryType("DELIVERY")}
                    >
                        <Ionicons name="cube" size={20} color={entryType === "DELIVERY" ? "#fff" : "#64748b"} />
                        <Text style={[styles.typeText, entryType === "DELIVERY" && styles.activeTypeText]}>Delivery</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    {/* PHOTO SECTION */}
                    <View style={styles.photoSection}>
                        {cameraOn ? (
                            <CameraView style={styles.cameraPreview} ref={cameraRef}>
                                <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto}>
                                    <View style={styles.captureInner} />
                                </TouchableOpacity>
                            </CameraView>
                        ) : photo ? (
                            <View style={styles.imageWrapper}>
                                <Image source={{ uri: photo }} style={styles.previewImage} />
                                <TouchableOpacity style={styles.retakeBtn} onPress={() => setPhoto(null)}>
                                    <Ionicons name="refresh" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.photoPlaceholder} onPress={() => setCameraOn(true)}>
                                <Ionicons name="camera" size={40} color="#94a3b8" />
                                <Text style={styles.photoLabel}>Take Visitor Photo</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            placeholder="Full Name"
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(t) => setFormData({ ...formData, name: t })}
                        />
                        <TextInput
                            placeholder="Mobile Number"
                            keyboardType="phone-pad"
                            style={styles.input}
                            value={formData.mobile}
                            onChangeText={(t) => setFormData({ ...formData, mobile: t })}
                        />

                        {entryType === "DELIVERY" && (
                            <TextInput
                                placeholder="Service (Zomato, Amazon, etc.)"
                                style={styles.input}
                                value={formData.deliveryPartner}
                                onChangeText={(t) => setFormData({ ...formData, deliveryPartner: t })}
                            />
                        )}

                        <View style={styles.row}>
                            <TextInput
                                placeholder="Bldg"
                                style={[styles.input, { flex: 1 }]}
                                value={formData.building}
                                onChangeText={(t) => setFormData({ ...formData, building: t })}
                            />
                            <TextInput
                                placeholder="Flat No."
                                style={[styles.input, { flex: 2 }]}
                                value={formData.flat}
                                onChangeText={(t) => setFormData({ ...formData, flat: t })}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    disabled={!isFormValid || submitting}
                    style={[styles.submitBtn, !isFormValid && styles.disabledBtn]}
                    onPress={handleSubmit}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.submitText}>Authorize Entry</Text>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    header: { padding: 20 },
    title: { fontSize: 26, fontWeight: "800", color: "#1e293b" },
    subtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },

    typeContainer: { flexDirection: "row", paddingHorizontal: 20, gap: 12, marginBottom: 20 },
    typeBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        padding: 12, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e2e8f0", gap: 8
    },
    activeTypeBtn: { backgroundColor: "#6366f1", borderColor: "#6366f1" },
    typeText: { fontWeight: "700", color: "#64748b" },
    activeTypeText: { color: "#fff" },

    card: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 24, overflow: "hidden", elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
    photoSection: { height: 250, backgroundColor: "#f1f5f9" },
    cameraPreview: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 },
    captureBtn: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
    captureInner: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff' },
    photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    photoLabel: { marginTop: 8, color: "#94a3b8", fontWeight: "600" },
    previewImage: { width: '100%', height: '100%' },
    imageWrapper: { flex: 1, position: 'relative' },
    retakeBtn: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },

    form: { padding: 20 },
    input: { backgroundColor: "#f8fafc", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0", fontSize: 16, marginBottom: 12 },
    row: { flexDirection: "row", gap: 12 },

    submitBtn: {
        backgroundColor: "#10b981", margin: 20, padding: 18, borderRadius: 16,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10
    },
    disabledBtn: { backgroundColor: "#cbd5e1" },
    submitText: { color: "#fff", fontSize: 18, fontWeight: "700" }
});