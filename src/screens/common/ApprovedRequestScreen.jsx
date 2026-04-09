import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import storageService from "../../services/storageService";

export default function ApprovedRequestScreen() {
    const mockData = [
        { id: 1, type: "VISITOR", name: "Rohit Sharma", mobile: "9876543210", building: "A", flat: "101", status: "PENDING", time: "10:30 AM" },
        { id: 2, type: "DELIVERY", name: "Amazon Guy", mobile: "9123456780", partner: "Amazon", building: "B", flat: "202", status: "APPROVED", time: "12:15 PM" },
    ];

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await storageService.getItem("preApprovals");
            setRequests(data ? JSON.parse(data) : mockData);
        };
        loadData();
    }, []);

    const getStatusTheme = (status) => {
        switch (status) {
            case "PENDING": return { bg: "#fff7ed", text: "#c2410c", border: "#ffedd5", label: "Waiting..." };
            case "APPROVED": return { bg: "#f0fdf4", text: "#15803d", border: "#dcfce7", label: "Entry Allowed" };
            case "REJECTED": return { bg: "#fef2f2", text: "#b91c1c", border: "#fee2e2", label: "Entry Denied" };
            default: return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0", label: status };
        }
    };

    const renderItem = ({ item }) => {
        const theme = getStatusTheme(item.status);

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeEmoji}>{item.type === "DELIVERY" ? "📦" : "🚶"}</Text>
                        <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    <Text style={styles.timeText}>{item.time}</Text>
                </View>

                <View style={styles.mainInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.mobile}>{item.mobile}</Text>

                    <View style={styles.locRow}>
                        <Text style={styles.locTag}>📍 Bldg {item.building} - {item.flat}</Text>
                        {item.type === "DELIVERY" && (
                            <Text style={styles.partnerTag}>🚚 {item.partner}</Text>
                        )}
                    </View>
                </View>

                <View style={[styles.statusFooter, { backgroundColor: theme.bg, borderColor: theme.border }]}>
                    <Text style={[styles.statusMsg, { color: theme.text }]}>
                        {item.status === "PENDING" ? "⏳" : item.status === "APPROVED" ? "✅" : "❌"} {theme.label}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Approvals</Text>
                <Text style={styles.headerSub}>Real-time entry requests</Text>
            </View>

            <FlatList
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.empty}>No requests found</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1e293b",
    },
    headerSub: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 2,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f1f5f9",
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        paddingBottom: 0,
    },
    typeBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    typeEmoji: { fontSize: 14, marginRight: 6 },
    typeText: { fontSize: 11, fontWeight: "700", color: "#64748b", letterSpacing: 0.5 },
    timeText: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },

    mainInfo: {
        padding: 15,
    },
    name: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1e293b",
    },
    mobile: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 2,
    },
    locRow: {
        flexDirection: "row",
        marginTop: 12,
        gap: 8,
    },
    locTag: {
        fontSize: 12,
        backgroundColor: "#f1f5f9",
        color: "#475569",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontWeight: "600",
    },
    partnerTag: {
        fontSize: 12,
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        fontWeight: "600",
    },
    statusFooter: {
        paddingVertical: 12,
        alignItems: "center",
        borderTopWidth: 1,
    },
    statusMsg: {
        fontSize: 14,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    empty: {
        textAlign: "center",
        marginTop: 50,
        color: "#94a3b8",
    }
});