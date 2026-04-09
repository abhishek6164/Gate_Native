import {
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateUserScreen() {

    const [user, setUser] = useState({
        name: "",
        role: "",
        flat: ""
    });

    const handleSubmit = () => {
        if (!user.name || !user.role || !user.flat) {
            Alert.alert("Error", "Fill all fields 😤");
            return;
        }

        console.log("User:", user);
        Alert.alert("Success", "User Created 🚀");

        setUser({ name: "", role: "", flat: "" });
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 20 ,backgroundColor: "#f0fdf4"}}>

            <Text style={styles.title}>➕ Create User</Text>

            {/* NAME */}
            <TextInput
                placeholder="Full Name"
                value={user.name}
                onChangeText={(t) => setUser({ ...user, name: t })}
                style={styles.input}
            />

            {/* ROLE */}
            <TextInput
                placeholder="Role (OWNER / TENANT / FAMILY)"
                value={user.role}
                onChangeText={(t) => setUser({ ...user, role: t })}
                style={styles.input}
            />

            {/* FLAT */}
            <TextInput
                placeholder="Flat (A-101)"
                value={user.flat}
                onChangeText={(t) => setUser({ ...user, flat: t })}
                style={styles.input}
            />

            {/* BUTTON */}
            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={{ color: "#fff", textAlign: "center" }}>
                    Create User
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

    input: {
        borderWidth: 1,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10
    },

    btn: {
        backgroundColor: "#0ea5e9",
        padding: 14,
        borderRadius: 10,
        marginTop: 10
    }
});