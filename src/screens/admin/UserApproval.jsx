import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Animated
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function UserApproval() {
    const [pendingUsers, setPendingUsers] = useState([
        { id: 1, name: "Rahul Sharma", role: "TENANT", email: "rahul@email.com", date: "25 Mar 2024" },
        { id: 2, name: "Amit Kumar", role: "OWNER", email: "amit@email.com", date: "26 Mar 2024" },
    ]);

    const handleAction = (id) => {
        // Simple filter logic for demo
        setPendingUsers(prev => prev.filter((u) => u.id !== id));
    };

    const roleStyles = {
        OWNER: { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
        TENANT: { bg: "#f5f3ff", text: "#6d28d9", dot: "#8b5cf6" },
        FAMILY: { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
    };

    const renderUserCard = ({ item }) => {
        const theme = roleStyles[item.role] || roleStyles.OWNER;

        return (
            <View style={styles.card}>
                <View style={styles.cardTop}>
                    <View style={styles.userInfo}>
                        <View style={[styles.avatar, { backgroundColor: theme.bg }]}>
                            <Text style={[styles.avatarText, { color: theme.text }]}>
                                {item.name.charAt(0)}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.nameText}>{item.name}</Text>
                            <Text style={styles.emailText}>{item.email}</Text>
                        </View>
                    </View>
                    <View style={[styles.roleBadge, { backgroundColor: theme.bg }]}>
                        <View style={[styles.dot, { backgroundColor: theme.dot }]} />
                        <Text style={[styles.roleText, { color: theme.text }]}>{item.role}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBottom}>
                    <Text style={styles.dateLabel}>Applied on {item.date}</Text>
                    <View style={styles.actionGroup}>
                        <TouchableOpacity
                            style={styles.rejectCircle}
                            onPress={() => handleAction(item.id)}
                            activeOpacity={0.6}
                        >
                            <Text style={styles.rejectIcon}>✕</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.approveBtn}
                            onPress={() => handleAction(item.id)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.approveBtnText}>Approve User</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>User Approvals</Text>
                    <Text style={styles.headerSub}>Verify residency requests</Text>
                </View>
                {pendingUsers.length > 0 && (
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{pendingUsers.length}</Text>
                    </View>
                )}
            </View>

            {pendingUsers.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Text style={styles.emptyEmoji}>🎉</Text>
                    </View>
                    <Text style={styles.emptyTitle}>All caught up!</Text>
                    <Text style={styles.emptySub}>No pending user approvals at the moment.</Text>
                </View>
            ) : (
                <FlatList
                    data={pendingUsers}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listPadding}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderUserCard}
                />
            )}
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
    countBadge: {
        backgroundColor: "#6366f1",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    countText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "800",
    },
    listPadding: {
        padding: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#f1f5f9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: "700",
    },
    nameText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1e293b",
    },
    emailText: {
        fontSize: 13,
        color: "#94a3b8",
        marginTop: 1,
    },
    roleBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    roleText: {
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: "#f1f5f9",
        marginVertical: 16,
    },
    cardBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateLabel: {
        fontSize: 12,
        color: "#94a3b8",
        fontWeight: "500",
    },
    actionGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    rejectCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#fee2e2",
        justifyContent: "center",
        alignItems: "center",
    },
    rejectIcon: {
        color: "#ef4444",
        fontSize: 16,
        fontWeight: "bold",
    },
    approveBtn: {
        backgroundColor: "#10b981",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    approveBtnText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#f0fdf4",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    emptyEmoji: {
        fontSize: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1e293b",
    },
    emptySub: {
        fontSize: 14,
        color: "#94a3b8",
        marginTop: 6,
        textAlign: "center",
        paddingHorizontal: 40,
    }
});