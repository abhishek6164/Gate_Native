import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function VisitorsScreen() {
    const [selectedDate] = useState(new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    }));

    const visitorsData = [
        { id: 1, name: "Rahul Sharma", mobile: "9876543210", building: "A", flat: "101", entryTime: "09:30 AM", status: "exited" },
        { id: 2, name: "Priya Patel", mobile: "8765432109", building: "B", flat: "205", entryTime: "02:15 PM", status: "entered" },
    ];

    const deliveriesData = [
        { id: 1, deliveryPartner: "Amazon", recipient: "Rajesh", building: "A", flat: "101", entryTime: "11:30 AM", status: "delivered" },
        { id: 2, deliveryPartner: "Swiggy", recipient: "Meera", building: "B", flat: "205", entryTime: "01:15 PM", status: "pending" },
    ];

    const getStatusStyle = (status) => {
        const success = ["entered", "delivered"];
        const isSuccess = success.includes(status);
        return {
            bg: isSuccess ? "#f0fdf4" : "#fef2f2",
            text: isSuccess ? "#16a34a" : "#ef4444",
            label: status.toUpperCase()
        };
    };

    const ListItem = ({ title, sub, loc, time, status, icon }) => {
        const theme = getStatusStyle(status);
        return (
            <View style={styles.card}>
                <View style={styles.cardIconBox}>
                    <Text style={{ fontSize: 20 }}>{icon}</Text>
                </View>
                <View style={styles.cardContent}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: theme.bg }]}>
                            <Text style={[styles.statusText, { color: theme.text }]}>{theme.label}</Text>
                        </View>
                    </View>
                    <Text style={styles.cardSub}>{sub}</Text>
                    <View style={styles.cardFooter}>
                        <Text style={styles.footerText}>📍 Bldg {loc}</Text>
                        <Text style={styles.footerText}>🕒 {time}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Gate Logs</Text>
                    <Text style={styles.dateText}>{selectedDate}</Text>
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <Text style={{ fontSize: 18 }}>📅</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Summary Section */}
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

                {/* Visitors Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Visitors</Text>
                    <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
                </View>
                {visitorsData.map(item => (
                    <ListItem
                        key={item.id}
                        title={item.name}
                        sub={item.mobile}
                        loc={`${item.building}-${item.flat}`}
                        time={item.entryTime}
                        status={item.status}
                        icon="🚶"
                    />
                ))}

                {/* Deliveries Section */}
                <View style={[styles.sectionHeader, { marginTop: 25 }]}>
                    <Text style={styles.sectionTitle}>Deliveries</Text>
                    <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
                </View>
                {deliveriesData.map(item => (
                    <ListItem
                        key={item.id}
                        title={item.deliveryPartner}
                        sub={`For: ${item.recipient}`}
                        loc={`${item.building}-${item.flat}`}
                        time={item.entryTime}
                        status={item.status}
                        icon="📦"
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1e293b",
    },
    dateText: {
        fontSize: 14,
        color: "#64748b",
        fontWeight: "600",
    },
    filterBtn: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    summaryContainer: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    summaryBox: {
        flex: 1,
        padding: 16,
        borderRadius: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    summaryLabel: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 14,
        fontWeight: "600",
    },
    summaryCount: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "800",
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#334155",
    },
    viewAll: {
        color: "#6366f1",
        fontWeight: "600",
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginVertical: 6,
        padding: 15,
        borderRadius: 18,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#f1f5f9",
    },
    cardIconBox: {
        width: 50,
        height: 50,
        backgroundColor: "#f8fafc",
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    cardContent: {
        flex: 1,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1e293b",
    },
    cardSub: {
        fontSize: 13,
        color: "#64748b",
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "800",
    },
    cardFooter: {
        flexDirection: "row",
        gap: 15,
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#f8fafc",
        paddingTop: 8,
    },
    footerText: {
        fontSize: 11,
        color: "#94a3b8",
        fontWeight: "600",
    }
});