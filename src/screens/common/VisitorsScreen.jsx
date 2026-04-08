import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VisitorsScreen() {

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const visitorsData = [
        {
            id: 1,
            name: "Rahul Sharma",
            mobile: "9876543210",
            building: "A",
            flat: "101",
            entryTime: "09:30 AM",
            status: "exited",
        },
        {
            id: 2,
            name: "Priya Patel",
            mobile: "8765432109",
            building: "B",
            flat: "205",
            entryTime: "02:15 PM",
            status: "entered",
        },
    ];

    const deliveriesData = [
        {
            id: 1,
            deliveryPartner: "Amazon",
            recipient: "Rajesh",
            building: "A",
            flat: "101",
            entryTime: "11:30 AM",
            status: "delivered",
        },
        {
            id: 2,
            deliveryPartner: "Swiggy",
            recipient: "Meera",
            building: "B",
            flat: "205",
            entryTime: "01:15 PM",
            status: "pending",
        },
    ];

    const getStatusColor = (status) => {
        return status === "entered" || status === "delivered"
            ? "green"
            : "red";
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>👥 Visitors</Text>
                <Text style={styles.date}>{selectedDate}</Text>
            </View>

            {/* SUMMARY */}
            <View style={styles.summaryRow}>
                <View style={styles.box}>
                    <Text>Visitors</Text>
                    <Text style={styles.count}>{visitorsData.length}</Text>
                </View>

                <View style={styles.box}>
                    <Text>Deliveries</Text>
                    <Text style={styles.count}>{deliveriesData.length}</Text>
                </View>
            </View>

            {/* VISITORS LIST */}
            <Text style={styles.section}>🚶 Visitors</Text>

            <FlatList
                data={visitorsData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={{ color: getStatusColor(item.status) }}>
                                ●
                            </Text>
                        </View>

                        <Text style={styles.small}>{item.mobile}</Text>
                        <Text style={styles.small}>{item.building}-{item.flat}</Text>
                        <Text style={styles.small}>{item.entryTime}</Text>
                    </View>
                )}
            />

            {/* DELIVERY */}
            <Text style={styles.section}>📦 Deliveries</Text>

            <FlatList
                data={deliveriesData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.name}>{item.deliveryPartner}</Text>
                            <Text style={{ color: getStatusColor(item.status) }}>
                                ●
                            </Text>
                        </View>

                        <Text style={styles.small}>{item.recipient}</Text>
                        <Text style={styles.small}>{item.building}-{item.flat}</Text>
                        <Text style={styles.small}>{item.entryTime}</Text>
                    </View>
                )}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: "row", justifyContent: "space-between" },
    title: { fontSize: 18, fontWeight: "bold" },
    date: { fontSize: 12, color: "gray" },

    summaryRow: { flexDirection: "row", gap: 10, marginVertical: 10 },
    box: {
        flex: 1,
        backgroundColor: "#e0f2fe",
        padding: 10,
        borderRadius: 10
    },
    count: { fontSize: 18, fontWeight: "bold" },

    section: { marginTop: 10, fontWeight: "bold" },

    card: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginVertical: 5,
        elevation: 2
    },

    rowBetween: { flexDirection: "row", justifyContent: "space-between" },
    name: { fontWeight: "bold" },
    small: { fontSize: 12, color: "gray" }
});