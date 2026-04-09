import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import storageService from "../../services/storageService";

export default function AlertsScreen() {
    const mockAlerts = [
        { id: 1, entryType: "VISITOR", name: "Rohit Sharma", mobile: "9876543210", building: "A", flat: "101", time: "10:30 AM", status: "PENDING" },
        { id: 2, entryType: "DELIVERY", name: "Delivery Executive", mobile: "9123456780", deliveryPartner: "Zomato", building: "B", flat: "202", time: "12:15 PM", status: "PENDING" },
    ];

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const loadAlerts = async () => {
            const stored = await storageService.getItem("alerts");
            setAlerts(stored ? JSON.parse(stored) : mockAlerts);
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

    const renderItem = ({ item }) => {
        const isPending = item.status === "PENDING";
        const isDelivery = item.entryType === "DELIVERY";

        return (
            <View style={[styles.card, !isPending && styles.inactiveCard]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconBox, { backgroundColor: isDelivery ? "#fff7ed" : "#f0f9ff" }]}>
                        <Ionicons
                            name={isDelivery ? "bicycle" : "person"}
                            size={20}
                            color={isDelivery ? "#f97316" : "#0ea5e9"}
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.typeText}>{isDelivery ? "Delivery Request" : "Guest Arrival"}</Text>
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                    <View style={[styles.statusBadge, styles[item.status.toLowerCase()]]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{item.name}</Text>
                    <Text style={styles.visitorSub}>{item.mobile} • {isDelivery ? item.deliveryPartner : "Personal"}</Text>
                </View>

                {isPending ? (
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => updateStatus(item.id, "REJECTED")}
                        >
                            <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                            <Text style={styles.rejectText}>Decline</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.approveButton}
                            onPress={() => updateStatus(item.id, "APPROVED")}
                        >
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.approveText}>Approve Entry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.closedInfo}>
                        <Ionicons
                            name={item.status === "APPROVED" ? "checkmark-done" : "close-outline"}
                            size={16}
                            color="#94a3b8"
                        />
                        <Text style={styles.closedText}>Action taken at {item.time}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.pageHeader}>
                <View>
                    <Text style={styles.title}>Gate Alerts</Text>
                    <Text style={styles.subtitle}>Who's at the gate right now?</Text>
                </View>
                <TouchableOpacity style={styles.historyBtn}>
                    <Ionicons name="time-outline" size={24} color="#64748b" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={alerts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="shield-checkmark-outline" size={60} color="#cbd5e1" />
                        <Text style={styles.emptyText}>All clear. No active requests.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    pageHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff'
    },
    title: { fontSize: 28, fontWeight: "800", color: "#1e293b" },
    subtitle: { fontSize: 14, color: "#64748b" },
    historyBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 12 },

    listContainer: { padding: 16 },
    card: {
        backgroundColor: "#fff", borderRadius: 24, padding: 16, marginBottom: 16,
        borderWidth: 1, borderColor: "#f1f5f9", elevation: 2, shadowColor: "#000", shadowOpacity: 0.05
    },
    inactiveCard: { opacity: 0.7, backgroundColor: '#f8fafc' },

    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    headerInfo: { flex: 1, marginLeft: 12 },
    typeText: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
    timeText: { fontSize: 14, fontWeight: '600', color: '#1e293b' },

    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800' },
    pending: { backgroundColor: '#fef3c7' },
    approved: { backgroundColor: '#dcfce7' },
    rejected: { backgroundColor: '#fee2e2' },

    visitorInfo: { marginBottom: 20 },
    visitorName: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
    visitorSub: { fontSize: 14, color: '#64748b', marginTop: 2 },

    actionRow: { flexDirection: 'row', gap: 12 },
    rejectButton: {
        flex: 1, flexDirection: 'row', height: 50, borderRadius: 15,
        borderWidth: 1.5, borderColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', gap: 6
    },
    approveButton: {
        flex: 2, flexDirection: 'row', height: 50, borderRadius: 15,
        backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center', gap: 8
    },
    rejectText: { color: '#ef4444', fontWeight: '700' },
    approveText: { color: '#fff', fontWeight: '700' },

    closedInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    closedText: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },

    empty: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 10, color: '#94a3b8', fontSize: 16 }
});