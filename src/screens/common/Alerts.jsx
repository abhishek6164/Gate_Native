import React, { useEffect, useState, useCallback } from "react";
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { getMyAlerts, updateAlertStatus } from "../../services/authApi";

// ❌ expo-notifications import hata diya

export default function AlertsScreen() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAlerts = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            const data = await getMyAlerts();
            setAlerts(data.alerts);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();

        // ✅ Har 10 seconds mein auto refresh
        const interval = setInterval(() => fetchAlerts(), 10000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (id, status) => {
        try {
            await updateAlertStatus(id, status);
            setAlerts(prev =>
                prev.map(item =>
                    item._id === id ? { ...item, status } : item
                )
            );
            Alert.alert(
                status === "APPROVED" ? "✅ Approved" : "❌ Declined",
                status === "APPROVED" ? "Visitor entry allowed!" : "Visitor entry denied!"
            );
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const renderItem = ({ item }) => {
        const isPending = item.status === "PENDING";
        const isDelivery = item.type === "DELIVERY";

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
                        <Text style={styles.typeText}>
                            {isDelivery ? "Delivery Request" : "Guest Arrival"}
                        </Text>
                        <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusBadge, styles[item.status.toLowerCase()]]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{item.name}</Text>
                    <Text style={styles.visitorSub}>
                        {item.mobile} • {isDelivery ? item.deliveryPartner : "Personal Visit"}
                    </Text>
                    <Text style={styles.flatInfo}>
                        📍 Bldg {item.building} - Flat {item.flat}
                    </Text>
                </View>

                {isPending ? (
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => handleAction(item._id, "REJECTED")}
                        >
                            <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                            <Text style={styles.rejectText}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.approveButton}
                            onPress={() => handleAction(item._id, "APPROVED")}
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
                        <Text style={styles.closedText}>
                            Action taken at {formatTime(item.actionTime || item.updatedAt)}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    if (loading) return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#6366f1" />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.pageHeader}>
                <View>
                    <Text style={styles.title}>Gate Alerts</Text>
                    <Text style={styles.subtitle}>Who's at the gate right now?</Text>
                </View>
                <TouchableOpacity style={styles.historyBtn} onPress={() => fetchAlerts(true)}>
                    <Ionicons name="refresh" size={24} color="#64748b" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={alerts}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onRefresh={() => fetchAlerts(true)}
                refreshing={refreshing}
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
        borderWidth: 1, borderColor: "#f1f5f9", elevation: 2,
        shadowColor: "#000", shadowOpacity: 0.05
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
    flatInfo: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
    actionRow: { flexDirection: 'row', gap: 12 },
    rejectButton: {
        flex: 1, flexDirection: 'row', height: 50, borderRadius: 15,
        borderWidth: 1.5, borderColor: '#fee2e2',
        justifyContent: 'center', alignItems: 'center', gap: 6
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