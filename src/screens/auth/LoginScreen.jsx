import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useState } from "react";
import storageService from "../../services/storageService";
import { loginUser } from "../../services/authApi";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen({ navigation }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!form.email || !form.password) return;

        const cleanData = {
            email: form.email.trim().toLowerCase(),
            password: form.password.trim()
        };

        setLoading(true);
        try {
            console.log('[LoginScreen] Attempting login...');
            const res = await loginUser(cleanData);
            console.log('[LoginScreen] Login successful, saving to storage...');

            // Attempt to save to storage (will fail silently if unavailable)
            await storageService.setItem("token", res.token);
            await storageService.setItem("user", JSON.stringify(res.user));
            console.log('[LoginScreen] Credentials saved to storage');

            if (res.user.status !== "APPROVED") {
                Alert.alert("Wait for admin approval");
                setLoading(false);
                return;
            }

            Alert.alert(`Welcome ${res.user.role}`);
            navigation.replace("Main");
        } catch (error) {
            console.error('[LoginScreen] Login error:', error);
            Alert.alert("Wrong credentials", error.message || "Please check your email and password");
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = form.email && form.password;

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar style="dark" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >

                <View style={styles.header}>
                    <Text style={styles.headerText}>Login</Text>
                </View>

                <View style={styles.main}>

                    <View style={styles.logoBox}>
                        <Text style={styles.logo}>🏢</Text>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>
                            Login to your My Gate account
                        </Text>
                    </View>

                    <View style={styles.form}>

                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="your@email.com"
                            value={form.email}
                            onChangeText={(t) => setForm({ ...form, email: t })}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Enter password"
                            secureTextEntry
                            value={form.password}
                            onChangeText={(t) => setForm({ ...form, password: t })}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={!isFormValid || loading}
                            style={[
                                styles.button,
                                !(isFormValid && !loading) && styles.disabled
                            ]}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Logging..." : "Login to My Gate"}
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <Text style={styles.signup}>
                        Don’t have account?{" "}
                        <Text
                            style={styles.link}
                            onPress={() => navigation.navigate("Signup")}
                        >
                            Signup
                        </Text>
                    </Text>

                    <View style={styles.bottom}>
                        <Text style={styles.bottomLogo}>🏢 mygate</Text>
                        <Text style={styles.secure}>✓ Secure & Encrypted</Text>
                        <Text style={styles.secure}>✓ GDPR Compliant</Text>
                        <Text style={styles.secure}>✓ ISO 27001 Certified</Text>
                    </View>

                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e6fffa"
    },
    header: {
        padding: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderColor: "#ddd"
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold"
    },
    main: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between"
    },
    logoBox: {
        alignItems: "center",
        marginBottom: 20
    },
    logo: {
        fontSize: 40
    },
    title: {
        fontSize: 22,
        fontWeight: "bold"
    },
    subtitle: {
        color: "gray"
    },
    form: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12
    },
    label: {
        marginBottom: 5,
        fontWeight: "600"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10
    },
    button: {
        backgroundColor: "#0ea5e9",
        padding: 14,
        borderRadius: 10,
        marginTop: 10
    },
    disabled: {
        backgroundColor: "#ccc"
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold"
    },
    signup: {
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