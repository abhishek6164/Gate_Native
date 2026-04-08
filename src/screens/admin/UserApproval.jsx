import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function UserApproval() {

    const [pendingUsers, setPendingUsers] = useState([
        { id: 1, name: "Rahul Sharma", role: "TENANT", email: "rahul@email.com", date: "2024-03-25" },
        { id: 2, name: "Amit Kumar", role: "OWNER", email: "amit@email.com", date: "2024-03-26" },
    ]);

    const handleApprove = (id) => {
        const updated = pendingUsers.filter((u) => u.id !== id);
        setPendingUsers(updated);
    };

    const handleReject = (id) => {
        const updated = pendingUsers.filter((u) => u.id !== id);
        setPendingUsers(updated);
    };

    const roleStyles = {
        OWNER: { bg: "#dbeafe", text: "#2563eb" },
        TENANT: { bg: "#ede9fe", text: "#7c3aed" },
        FAMILY: { bg: "#dcfce7", text: "#16a34a" },
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>🛡️ New Users Approvals</Text>

                <Text style={styles.badge}>
                    {pendingUsers.length} Pending
                </Text>
            </View>

            {/* EMPTY STATE */}
            {pendingUsers.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyIcon}>✅</Text>
                    <Text style={styles.emptyText}>All users approved</Text>
                </View>
            ) : (

                <FlatList
                    data={pendingUsers}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 15 }}
                    renderItem={({ item }) => (
                        <View style={styles.card}>

                            {/* TOP */}
                            <View style={styles.rowBetween}>
                                <View>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.email}>{item.email}</Text>
                                </View>

                                <View style={[
                                    styles.roleBadge,
                                    { backgroundColor: roleStyles[item.role].bg }
                                ]}>
                                    <Text style={{
                                        color: roleStyles[item.role].text,
                                        fontSize: 12
                                    }}>
                                        {item.role}
                                    </Text>
                                </View>
                            </View>

                            {/* DATE */}
                            <Text style={styles.date}>
                                Applied on: {item.date}
                            </Text>

                            {/* BUTTONS */}
                            <View style={styles.buttonRow}>

                                <TouchableOpacity
                                    style={[styles.btn, { backgroundColor: "#22c55e" }]}
                                    onPress={() => handleApprove(item.id)}
                                >
                                    <Text style={styles.btnText}>✔ Approve</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.btn, { backgroundColor: "#ef4444" }]}
                                    onPress={() => handleReject(item.id)}
                                >
                                    <Text style={styles.btnText}>✖ Reject</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0fdfa"
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15
    },

    title: {
        fontSize: 18,
        fontWeight: "bold"
    },

    badge: {
        backgroundColor: "#fef9c3",
        color: "#854d0e",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12
    },

    emptyBox: {
        margin: 20,
        padding: 40,
        backgroundColor: "#fff",
        borderRadius: 16,
        alignItems: "center"
    },

    emptyIcon: {
        fontSize: 30
    },

    emptyText: {
        color: "gray",
        marginTop: 5
    },

    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 16,
        marginBottom: 10,
        elevation: 2
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    name: {
        fontWeight: "600",
        fontSize: 15
    },

    email: {
        fontSize: 12,
        color: "gray"
    },

    roleBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12
    },

    date: {
        fontSize: 11,
        color: "#9ca3af",
        marginTop: 5
    },

    buttonRow: {
        flexDirection: "row",
        marginTop: 10,
        gap: 8
    },

    btn: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        alignItems: "center"
    },

    btnText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13
    }
});