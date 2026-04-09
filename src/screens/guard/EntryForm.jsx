import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,

    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Camera } from "expo-camera";
import storageService from "../../services/storageService";

export default function EntryFormScreen({ navigation }) {

    const [hasPermission, setHasPermission] = useState(null);
    const [cameraOn, setCameraOn] = useState(false);
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);

    const [entryType, setEntryType] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        deliveryPartner: "",
        building: "",
        flat: "",
    });

    const buildingFlats = {
        A: ["101", "102", "103"],
        B: ["201", "202"],
        C: ["301", "302"],
    };

    //  CAMERA PERMISSION
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    //  CAPTURE PHOTO
    const capturePhoto = async () => {
        if (cameraRef.current) {
            const photoData = await cameraRef.current.takePictureAsync();
            setPhoto(photoData.uri);
            setCameraOn(false);
        }
    };

    //  SUBMIT
    const handleSubmit = async () => {

        if (!photo) {
            alert("Photo required ");
            return;
        }

        const approvals = await storageService.getItem("preApprovals");
        const parsed = approvals ? JSON.parse(approvals) : [];

        const match = parsed.find(
            (item) =>
                item.name === formData.name &&
                item.mobile === formData.mobile &&
                item.status === "APPROVED"
        );

        if (!match) {
            alert("❌ No approval found!");
            return;
        }

        alert("✅ Entry Allowed ");
        console.log("ENTRY SUCCESS", formData);
    };

    const isFormValid =
        formData.name &&
        formData.mobile &&
        entryType &&
        formData.building &&
        formData.flat &&
        photo;

    if (hasPermission === null) return <View />;
    if (hasPermission === false) return <Text>No camera access</Text>;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                {/* HEADER */}
                <Text style={styles.header}> Create Entry</Text>

                {/* NAME */}
                <TextInput
                    placeholder="Visitor Name"
                    style={styles.input}
                    onChangeText={(t) => setFormData({ ...formData, name: t })}
                />

                {/* MOBILE */}
                <TextInput
                    placeholder="Mobile"
                    keyboardType="numeric"
                    style={styles.input}
                    onChangeText={(t) => setFormData({ ...formData, mobile: t })}
                />

                {/* ENTRY TYPE */}
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[
                            styles.typeBtn,
                            entryType === "VISITOR" && styles.activeBtn,
                        ]}
                        onPress={() => setEntryType("VISITOR")}
                    >
                        <Text>Visitor</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeBtn,
                            entryType === "DELIVERY" && styles.activeBtn,
                        ]}
                        onPress={() => setEntryType("DELIVERY")}
                    >
                        <Text>Delivery</Text>
                    </TouchableOpacity>
                </View>

                {/* DELIVERY */}
                {entryType === "DELIVERY" && (
                    <TextInput
                        placeholder="Delivery Partner"
                        style={styles.input}
                        onChangeText={(t) =>
                            setFormData({ ...formData, deliveryPartner: t })
                        }
                    />
                )}

                {/* BUILDING */}
                <TextInput
                    placeholder="Building (A/B/C)"
                    style={styles.input}
                    onChangeText={(t) =>
                        setFormData({ ...formData, building: t })
                    }
                />

                {/* FLAT */}
                <TextInput
                    placeholder="Flat"
                    style={styles.input}
                    onChangeText={(t) =>
                        setFormData({ ...formData, flat: t })
                    }
                />

                {/* CAMERA BUTTON */}
                {!cameraOn && !photo && (
                    <TouchableOpacity
                        style={styles.cameraBtn}
                        onPress={() => setCameraOn(true)}
                    >
                        <Text style={{ color: "#fff" }}>Open Camera</Text>
                    </TouchableOpacity>
                )}

                {/* CAMERA VIEW */}
                {cameraOn && (
                    <Camera style={styles.camera} ref={cameraRef}>
                        <TouchableOpacity
                            style={styles.captureBtn}
                            onPress={capturePhoto}
                        />
                    </Camera>
                )}

                {/* PHOTO */}
                {photo && (
                    <View>
                        <Image source={{ uri: photo }} style={styles.image} />
                        <TouchableOpacity onPress={() => setPhoto(null)}>
                            <Text style={{ color: "red" }}>Retake</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* SUBMIT */}
                <TouchableOpacity
                    disabled={!isFormValid}
                    style={[
                        styles.submitBtn,
                        !isFormValid && { backgroundColor: "#ccc" },
                    ]}
                    onPress={handleSubmit}
                >
                    <Text style={{ color: "#fff" }}>
                        {submitting ? "Submitting..." : "Submit Entry"}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eefaf6",
        padding: 15,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    row: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 10,
    },
    typeBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#eee",
        alignItems: "center",
    },
    activeBtn: {
        backgroundColor: "#0ea5e9",
    },
    cameraBtn: {
        backgroundColor: "#f97316",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
    },
    camera: {
        height: 300,
        borderRadius: 10,
        overflow: "hidden",
    },
    captureBtn: {
        width: 60,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 50,
        alignSelf: "center",
        marginTop: 220,
    },
    image: {
        width: "100%",
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    submitBtn: {
        backgroundColor: "#0ea5e9",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
});