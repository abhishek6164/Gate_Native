import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ navigation }) {

    const user = {
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        mobile: "9876543210",
        role: "OWNER",
        building: "A",
        flat: "101",
        status: "APPROVED",
    };

    const handleLogout = () => {
        navigation.navigate("Login");
    };

    return (
        <SafeAreaView style={{
            flex: 1, padding: 20, backgroundColor: "#f0fdf4",
        }}>

            <Text style={styles.title}>👤 Profile</Text>

            <View style={styles.card}>

                <View style={styles.avatar}>
                    <Text style={{ color: "#fff", fontSize: 24 }}>
                        {user.name.charAt(0)}
                    </Text>
                </View>

                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>

                <Text style={styles.status}>✅ {user.status}</Text>

                <View style={styles.infoBox}>
                    <Text>Email: {user.email}</Text>
                    <Text>Mobile: {user.mobile}</Text>
                    <Text>Flat: {user.building}-{user.flat}</Text>
                </View>

                <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                    <Text style={{ color: "#fff" }}>Logout</Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },

    card: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        elevation: 3
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#0ea5e9",
        justifyContent: "center",
        alignItems: "center"
    },

    name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    email: { color: "gray" },
    status: { color: "green", marginTop: 5 },

    infoBox: { marginTop: 15 },

    logout: {
        marginTop: 20,
        backgroundColor: "red",
        padding: 12,
        borderRadius: 8
    }
});