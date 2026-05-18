import React, { useState, useEffect } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity,
    ScrollView, ActivityIndicator, Alert
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getTodayEntries, logVisitorExit } from "../../services/authApi";

export default function VisitorsScreen() {
    const [visitorsData, setVisitorsData] = useState([]);
    const [deliveriesData, setDeliveriesData] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectedDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const data = await getTodayEntries();
            setVisitorsData(data.visitors);
            setDeliveriesData(data.deliveries);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleExit = async (id) => {
        try {
            await logVisitorExit(id);
            Alert.alert("✅ Done", "Exit logged!");
            fetchEntries(); // Refresh
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const getStatusStyle = (status) => {
        const success = ["ENTERED", "DELIVERED"];
        const isSuccess = success.includes(status);
        return {
            bg: isSuccess ? "#f0fdf4" : "#fef2f2",
            text: isSuccess ? "#16a34a" : "#ef4444",
            label: status
        };
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit'
        });
    };

    const ListItem = ({ item, icon, showExit }) => {
        const theme = getStatusStyle(item.status);
        return (
            <View style={styles.card}>
                <View style={styles.cardIconBox}>
                    <Text style={{ fontSize: 20 }}>{icon}</Text>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
                            <Text style={[styles.statusText, { color: theme.text }]}>{theme.label}</Text>
                        </View>
                    </View>
                    <Text style={styles.cardSub}>{item.mobile}</Text>
                    <View style={styles.cardFooter}>
                        <Text style={styles.footerText}>📍 Bldg {item.building}-{item.flat}</Text>
                        <Text style={styles.footerText}>🕒 {formatTime(item.entryTime || item.createdAt)}</Text>
                    </View>
                    {/* Exit Button - Sirf ENTERED status pe */}
                    {showExit && item.status === "ENTERED" && (
                        <TouchableOpacity
                            style={styles.exitBtn}
                            onPress={() => handleExit(item._id)}
                        >
                            <Text style={styles.exitBtnText}>Log Exit</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Gate Logs</Text>
                    <Text style={styles.dateText}>{selectedDate}</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn} onPress={fetchEntries}>
                    <Text style={{ fontSize: 18 }}>🔄</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={[styles.summaryBox, { backgroundColor: "#6366f1" }]}>
                        <Text style={styles.summaryLabel}>Visitors</Text>
                        <Text style={styles.summaryCount}>{visitorsData.length}</Text>
                    </View>
                    <View style={[styles.summaryBox, { backgroundColor: "#10b981" }]}>
                        <Text style={styles.summaryLabel}>Deliveries</Text>
                        <Text style={styles.summaryCount}>{deliveriesData.length}</Text>
                    </View>
                </View>

                {/* Visitors */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Visitors</Text>
                </View>
                {visitorsData.length === 0
                    ? <Text style={styles.emptyText}>No visitors today</Text>
                    : visitorsData.map(item => (
                        <ListItem key={item._id} item={item} icon="🚶" showExit={true} />
                    ))
                }

                {/* Deliveries */}
                <View style={[styles.sectionHeader, { marginTop: 25 }]}>
                    <Text style={styles.sectionTitle}>Deliveries</Text>
                </View>
                {deliveriesData.length === 0
                    ? <Text style={styles.emptyText}>No deliveries today</Text>
                    : deliveriesData.map(item => (
                        <ListItem key={item._id} item={item} icon="📦" showExit={false} />
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    header: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", paddingHorizontal: 20, paddingVertical: 15,
    },
    title: { fontSize: 26, fontWeight: "800", color: "#1e293b" },
    dateText: { fontSize: 14, color: "#64748b", fontWeight: "600" },
    filterBtn: {
        backgroundColor: "#fff", padding: 10, borderRadius: 12,
        elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5,
    },
    summaryContainer: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginVertical: 20 },
    summaryBox: {
        flex: 1, padding: 16, borderRadius: 20, elevation: 4,
        shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 8,
    },
    summaryLabel: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: "600" },
    summaryCount: { color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 4 },
    sectionHeader: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", paddingHorizontal: 20, marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#334155" },
    card: {
        backgroundColor: "#fff", marginHorizontal: 20, marginVertical: 6,
        padding: 15, borderRadius: 18, flexDirection: "row",
        alignItems: "center", borderWidth: 1, borderColor: "#f1f5f9",
    },
    cardIconBox: {
        width: 50, height: 50, backgroundColor: "#f8fafc",
        borderRadius: 14, justifyContent: "center",
        alignItems: "center", marginRight: 15,
    },
    cardContent: { flex: 1 },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    cardTitle: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
    cardSub: { fontSize: 13, color: "#64748b", marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: "800" },
    cardFooter: {
        flexDirection: "row", gap: 15, marginTop: 8,
        borderTopWidth: 1, borderTopColor: "#f8fafc", paddingTop: 8,
    },
    footerText: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },
    exitBtn: {
        backgroundColor: "#fee2e2", paddingVertical: 6, paddingHorizontal: 12,
        borderRadius: 8, marginTop: 8, alignSelf: "flex-start"
    },
    exitBtnText: { color: "#ef4444", fontWeight: "700", fontSize: 12 },
    emptyText: { textAlign: "center", color: "#94a3b8", marginVertical: 20 },
});