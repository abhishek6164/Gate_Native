import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import storageService from "../../services/storageService";

export default function ApprovedRequestScreen() {
    const mockData = [
        {
            id: 1,
            type: "VISITOR",
            name: "Rohit Sharma",
            mobile: "9876543210",
            building: "A",
            flat: "101",
            status: "PENDING",
            time: "10:30 AM",
        },
        {
            id: 2,
            type: "DELIVERY",
            name: "Amazon Guy",
            mobile: "9123456780",
            partner: "Amazon",
            building: "B",
            flat: "202",
            status: "APPROVED",
            time: "12:15 PM",
        },
    ];

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await storageService.getItem("preApprovals");

            if (data) {
                setRequests(JSON.parse(data));
            } else {
                setRequests(mockData);
            }
        };

        loadData();
    }, []);

    const updateStatus = async (id, status) => {
        const updated = requests.map((req) =>
            req.id === id ? { ...req, status } : req
        );

        setRequests(updated);
        await storageService.setItem("preApprovals", JSON.stringify(updated));
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

            <View style={styles.rowBetween}>
                <Text style={styles.type}>
                    {item.type === "DELIVERY" ? "📦 Delivery" : "🚶 Visitor"}
                </Text>

                <Text style={[styles.status, getStatusStyle(item.status)]}>
                    {item.status}
                </Text>
            </View>

            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.mobile}>{item.mobile}</Text>

            <Text style={styles.flat}>
                📍 {item.building}-{item.flat}
            </Text>

            {item.type === "DELIVERY" && (
                <Text style={styles.partner}>🚚 {item.partner}</Text>
            )}

            <Text style={styles.time}>{item.time}</Text>

            {/*  GUARD VIEW ONLY MESSAGE */}
            {item.status === "PENDING" && (
                <Text style={{ color: "orange", marginTop: 8 }}>
                     Waiting for approval from resident
                </Text>
            )}

            {item.status === "APPROVED" && (
                <Text style={{ color: "green", marginTop: 8 }}>
                     Entry Allowed
                </Text>
            )}

            {item.status === "REJECTED" && (
                <Text style={{ color: "red", marginTop: 8 }}>
                     Entry Denied
                </Text>
            )}

        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerText}>🛡️ Approval Requests</Text>
            </View>

            {/* LIST */}
            <FlatList
                data={requests}
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
        marginBottom: 15,
    },

    headerText: {
        fontSize: 18,
        fontWeight: "bold",
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