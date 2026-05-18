import React, { useEffect, useState, useCallback } from "react";
import {
    View, Text, FlatList, StyleSheet,
    ActivityIndicator, Alert, TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getPreApprovals, markPreApprovalUsed } from "../../services/authApi";

export default function ApprovedRequestScreen() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchApprovals = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            const data = await getPreApprovals();
            setRequests(data.approvals);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchApprovals();
        // Auto refresh har 15 sec
        const interval = setInterval(() => fetchApprovals(), 15000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkUsed = async (id, name) => {
        Alert.alert(
            "Confirm Entry",
            `Mark ${name}'s entry as completed?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            await markPreApprovalUsed(id);
                            // List mein USED mark karo
                            setRequests(prev =>
                                prev.map(item =>
                                    item._id === id ? { ...item, status: "USED" } : item
                                )
                            );
                            Alert.alert("✅ Done!", "Entry logged in Visitors screen!");
                        } catch (error) {
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case "APPROVED": return { bg: "#f0fdf4", text: "#15803d", border: "#dcfce7", label: "Entry Allowed" };
            case "USED": return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0", label: "Already Used" };
            default: return { bg: "#fef2f2", text: "#b91c1c", border: "#fee2e2", label: "Entry Denied" };
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const renderItem = ({ item }) => {
        const theme = getStatusTheme(item.status);
        const isApproved = item.status === "APPROVED";

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeEmoji}>{item.type === "DELIVERY" ? "📦" : "🚶"}</Text>
                        <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    <Text style={styles.timeText}>Valid till {formatDate(item.validTill)}</Text>
                </View>

                <View style={styles.mainInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.mobile}>{item.mobile}</Text>
                    <View style={styles.locRow}>
                        <Text style={styles.locTag}>📍 Bldg {item.building} - {item.flat}</Text>
                        {item.type === "DELIVERY" && item.deliveryPartner ? (
                            <Text style={styles.partnerTag}>🚚 {item.deliveryPartner}</Text>
                        ) : null}
                    </View>
                    {item.createdBy && (
                        <Text style={styles.approvedBy}>
                            👤 {item.createdBy.name} — Bldg {item.createdBy.building}-{item.createdBy.flat}
                        </Text>
                    )}
                </View>

                {/* Status Footer */}
                <View style={[styles.statusFooter, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    <Text style={[styles.statusMsg, { color: theme.text }]}>
                        {item.status === "APPROVED" ? "✅" : "🔘"} {theme.label}
                    </Text>
                </View>

                {/* ✅ Mark Entry Button - Sirf APPROVED pe dikhega */}
                {isApproved && (
                    <TouchableOpacity
                        style={styles.markBtn}
                        onPress={() => handleMarkUsed(item._id, item.name)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.markBtnText}>✅ Mark Entry Complete</Text>
                    </TouchableOpacity>
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
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pre-Approvals</Text>
                <Text style={styles.headerSub}>Verify before allowing entry</Text>
            </View>

            <FlatList
                data={requests}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onRefresh={() => fetchApprovals(true)}
                refreshing={refreshing}
                ListEmptyComponent={
                    <View style={{ alignItems: "center", marginTop: 80 }}>
                        <Text style={{ fontSize: 40 }}>🎉</Text>
                        <Text style={styles.empty}>No pre-approvals found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8fafc" },
    header: {
        paddingHorizontal: 20, paddingVertical: 20,
        backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f1f5f9",
    },
    headerTitle: { fontSize: 24, fontWeight: "800", color: "#1e293b" },
    headerSub: { fontSize: 14, color: "#64748b", marginTop: 2 },
    listContainer: { padding: 16 },
    card: {
        backgroundColor: "#fff", borderRadius: 20, marginBottom: 16,
        borderWidth: 1, borderColor: "#f1f5f9", overflow: "hidden",
        elevation: 2, shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10,
    },
    cardHeader: {
        flexDirection: "row", justifyContent: "space-between",
        alignItems: "center", padding: 12, paddingBottom: 0,
    },
    typeBadge: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: "#f8fafc", paddingHorizontal: 10,
        paddingVertical: 4, borderRadius: 10,
    },
    typeEmoji: { fontSize: 14, marginRight: 6 },
    typeText: { fontSize: 11, fontWeight: "700", color: "#64748b", letterSpacing: 0.5 },
    timeText: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
    mainInfo: { padding: 15 },
    name: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
    mobile: { fontSize: 14, color: "#64748b", marginTop: 2 },
    locRow: { flexDirection: "row", marginTop: 12, gap: 8, flexWrap: "wrap" },
    locTag: {
        fontSize: 12, backgroundColor: "#f1f5f9", color: "#475569",
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontWeight: "600",
    },
    partnerTag: {
        fontSize: 12, backgroundColor: "#eff6ff", color: "#2563eb",
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontWeight: "600",
    },
    approvedBy: { fontSize: 12, color: "#94a3b8", marginTop: 8, fontWeight: "500" },
    statusFooter: {
        paddingVertical: 10, alignItems: "center", borderTopWidth: 1,
    },
    statusMsg: { fontSize: 13, fontWeight: "800", letterSpacing: 0.5 },
    markBtn: {
        backgroundColor: "#6366f1", paddingVertical: 14,
        alignItems: "center", marginTop: 0,
    },
    markBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
    empty: { color: "#94a3b8", fontSize: 16, marginTop: 10 },
});