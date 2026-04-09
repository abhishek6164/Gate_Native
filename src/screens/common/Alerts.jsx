import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import storageService from "../../services/storageService";

export default function AlertsScreen() {
    const mockAlerts = [
        {
            id: 1,
            entryType: "VISITOR",
            name: "Rohit Sharma",
            mobile: "9876543210",
            building: "A",
            flat: "101",
            time: "10:30 AM",
            status: "PENDING",
        },
        {
            id: 2,
            entryType: "DELIVERY",
            name: "Amazon Guy",
            mobile: "9123456780",
            deliveryPartner: "Amazon",
            building: "B",
            flat: "202",
            time: "12:15 PM",
            status: "PENDING",
        },
    ];

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const loadAlerts = async () => {
            const stored = await storageService.getItem("alerts");

            if (stored) {
                setAlerts(JSON.parse(stored));
            } else {
                setAlerts(mockAlerts);
            }
        };

        loadAlerts();
    }, []);

    const updateStatus = async (id, status) => {
        const updated = alerts.map((item) =>
            item.id === id ? { ...item, status } : item
        );

        setAlerts(updated);
        await storageService.setItem("alerts", JSON.stringify(updated));
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "PENDING":
                return styles.pending;
            case "APPROVED":
                return styles.approved;
            case "REJECTED":
                return styles.rejected;
            default:
                return {};
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>

            {/* TOP */}
            <View style={styles.rowBetween}>
                <Text style={styles.type}>
                    {item.entryType === "DELIVERY" ? "📦 Delivery" : "🚶 Visitor"}
                </Text>

                <Text style={[styles.status, getStatusStyle(item.status)]}>
                    {item.status}
                </Text>
            </View>

            {/* INFO */}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.mobile}>{item.mobile}</Text>
            <Text style={styles.flat}>
                📍 {item.building}-{item.flat}
            </Text>

            {item.entryType === "DELIVERY" && (
                <Text style={styles.partner}>🚚 {item.deliveryPartner}</Text>
            )}

            <Text style={styles.time}>{item.time}</Text>

            {/* ACTIONS */}
            {item.status === "PENDING" && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => updateStatus(item.id, "APPROVED")}
                    >
                        <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => updateStatus(item.id, "REJECTED")}
                    >
                        <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>

            <Text style={styles.header}>🔔 Alerts</Text>

            <FlatList
                data={alerts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />

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
        marginBottom: 15,
    },

    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 3,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    type: {
        fontWeight: "600",
    },

    status: {
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        color: "#fff",
    },

    pending: {
        backgroundColor: "#f59e0b",
    },

    approved: {
        backgroundColor: "#10b981",
    },

    rejected: {
        backgroundColor: "#ef4444",
    },

    name: {
        fontWeight: "600",
        marginTop: 5,
    },

    mobile: {
        color: "gray",
    },

    flat: {
        marginTop: 5,
    },

    partner: {
        color: "gray",
    },

    time: {
        fontSize: 12,
        color: "gray",
        marginTop: 5,
    },

    actions: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
    },

    approveBtn: {
        flex: 1,
        backgroundColor: "#10b981",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },

    rejectBtn: {
        flex: 1,
        backgroundColor: "#ef4444",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontWeight: "600",
    },
});