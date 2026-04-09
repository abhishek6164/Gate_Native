import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

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
        navigation.replace("Login");
    };

    const InfoRow = ({ label, value, icon }) => (
        <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
                <Text style={styles.infoIcon}>{icon}</Text>
                <Text style={styles.infoLabel}>{label}</Text>
            </View>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <Text style={styles.headerTitle}>My Profile</Text>

                {/* Profile Header Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarGradient}>
                        <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>● {user.status}</Text>
                    </View>
                </View>

                {/* Account Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Details</Text>
                    <View style={styles.detailsCard}>
                        <InfoRow icon="📧" label="Email" value={user.email} />
                        <View style={styles.separator} />
                        <InfoRow icon="📱" label="Mobile" value={user.mobile} />
                        <View style={styles.separator} />
                        <InfoRow icon="🏠" label="Residence" value={`Bldg ${user.building} - ${user.flat}`} />
                        <View style={styles.separator} />
                        <InfoRow icon="🔑" label="Role" value={user.role} />
                    </View>
                </View>

                {/* Actions Section */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
                        <Text style={styles.logoutIcon}>󰈆</Text>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>App Version 2.0.4</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    scrollContent: {
        padding: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1e293b",
        marginBottom: 25,
        letterSpacing: -0.5,
    },
    profileCard: {
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 30,
        marginBottom: 30,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
    },
    avatarGradient: {
        width: 90,
        height: 90,
        borderRadius: 30,
        backgroundColor: "#6366f1",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
    },
    avatarText: {
        color: "#fff",
        fontSize: 36,
        fontWeight: "800",
    },
    userName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1e293b",
    },
    statusBadge: {
        backgroundColor: "#f0fdf4",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#dcfce7",
    },
    statusText: {
        color: "#16a34a",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    detailsCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
    },
    infoLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    infoIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    infoLabel: {
        fontSize: 15,
        color: "#64748b",
        fontWeight: "500",
    },
    infoValue: {
        fontSize: 15,
        color: "#1e293b",
        fontWeight: "600",
    },
    separator: {
        height: 1,
        backgroundColor: "#f1f5f9",
        width: "100%",
    },
    logoutButton: {
        flexDirection: "row",
        backgroundColor: "#fee2e2",
        paddingVertical: 16,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    logoutText: {
        color: "#ef4444",
        fontSize: 16,
        fontWeight: "700",
    },
    versionText: {
        textAlign: "center",
        color: "#cbd5e1",
        fontSize: 12,
        marginTop: 20,
    }
});