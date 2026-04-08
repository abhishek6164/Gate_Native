import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useState } from "react";
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

    const buildingFlats = {
        A: [1, 2, 3, 4, 5, 6],
        B: [1, 2, 3, 4, 5],
        C: [1, 2, 3, 4, 5],
        D: [1, 2, 3, 4]
    };

    const handleSignup = async () => {
        const isValid =
            form.name &&
            form.email &&
            form.mobile &&
            form.password &&
            form.role &&
            form.building &&
            form.flat;

        if (!isValid) return;

        await signupUser({ ...form, status: "PENDING" });
        Alert.alert("Signup request sent!");
        navigation.navigate("Login");
    };

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar style="dark" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

                    <View style={styles.header}>
                        <Text style={styles.headerText}>Join My Gate</Text>
                    </View>

                    <View style={styles.main}>

                        <View style={styles.logoBox}>
                            <Text style={styles.logo}>🏢</Text>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>
                                Join your community & building
                            </Text>
                        </View>

                        <View style={styles.form}>

                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.input}
                                onChangeText={(t) => setForm({ ...form, name: t })}
                            />

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.input}
                                onChangeText={(t) => setForm({ ...form, email: t })}
                            />

                            <Text style={styles.label}>Mobile</Text>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.input}
                                onChangeText={(t) => setForm({ ...form, mobile: t })}
                            />

                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry
                                style={styles.input}
                                onChangeText={(t) => setForm({ ...form, password: t })}
                            />

                            <Text style={styles.label}>Account Type</Text>
                            <View style={styles.row}>
                                <TouchableOpacity style={[styles.selectBtn, form.role === "FAMILY" && styles.active]}
                                    onPress={() => setForm({ ...form, role: "FAMILY" })}>
                                    <Text>Family</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.selectBtn, form.role === "TENANT" && styles.active]}
                                    onPress={() => setForm({ ...form, role: "TENANT" })}>
                                    <Text>Tenant</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.label}>Building</Text>
                            <View style={styles.row}>
                                {Object.keys(buildingFlats).map((b) => (
                                    <TouchableOpacity key={b}
                                        style={[styles.selectBtn, form.building === b && styles.active]}
                                        onPress={() => setForm({ ...form, building: b, flat: "" })}>
                                        <Text>{b}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.label}>Flat</Text>
                            <View style={styles.row}>
                                {form.building &&
                                    buildingFlats[form.building].map((f) => (
                                        <TouchableOpacity key={f}
                                            style={[styles.selectBtn, form.flat === String(f) && styles.active]}
                                            onPress={() => setForm({ ...form, flat: String(f) })}>
                                            <Text>{f}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                                <Text style={styles.buttonText}>Create Account</Text>
                            </TouchableOpacity>

                        </View>

                        <Text style={styles.login}>
                            Already have account?{" "}
                            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
                                Login
                            </Text>
                        </Text>

                        <View style={styles.bottom}>
                            <Text style={styles.bottomLogo}>🏢 mygate</Text>
                            <Text style={styles.secure}>✓ Secure Community</Text>
                            <Text style={styles.secure}>✓ Verified Neighbors</Text>
                            <Text style={styles.secure}>✓ Easy Access</Text>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#e6fffa" },
    header: {
        padding: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#ddd"
    },
    headerText: { fontSize: 18, fontWeight: "bold" },
    main: { padding: 20 },
    logoBox: { alignItems: "center", marginBottom: 20 },
    logo: { fontSize: 40 },
    title: { fontSize: 22, fontWeight: "bold" },
    subtitle: { color: "gray" },

    form: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12
    },

    label: { marginTop: 10, marginBottom: 5, fontWeight: "600" },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8
    },

    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8
    },

    selectBtn: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        margin: 4
    },

    active: {
        backgroundColor: "#0ea5e9"
    },

    button: {
        marginTop: 15,
        backgroundColor: "#10b981",
        padding: 14,
        borderRadius: 10
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold"
    },

    login: {
        textAlign: "center",
        marginTop: 10
    },

    link: {
        color: "#0ea5e9",
        fontWeight: "bold"
    },

    bottom: {
        alignItems: "center",
        marginTop: 20
    },

    bottomLogo: {
        fontWeight: "bold",
        marginBottom: 10
    },

    secure: {
        fontSize: 12,
        color: "gray"
    }
});