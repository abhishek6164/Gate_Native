import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityScreen() {

  const residentsData = [
    { name: "E", role: "OWNER", flat: "A-101", mobile: "9876543210" },
    { name: "A", role: "TENANT", flat: "B-202", mobile: "9123456780" },
    { name: "B", role: "FAMILY", flat: "C-303", mobile: "9988776655" },
  ];

  const [search, setSearch] = useState("");

  const filtered = residentsData.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.flat.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role) => {
    if (role === "OWNER") return "#10b981";
    if (role === "TENANT") return "#3b82f6";
    return "#f59e0b";
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>

      <Text style={styles.title}>👥 Community</Text>

      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      <FlatList
        data={filtered}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={{ color: "#fff" }}>{item.name}</Text>
              </View>

              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.sub}>{item.role} • {item.flat}</Text>
              </View>
            </View>

            <View>
              <Text style={styles.mobile}>{item.mobile}</Text>
              <Text style={{ color: getRoleColor(item.role), fontSize: 12 }}>
                {item.role}
              </Text>
            </View>

          </View>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2
  },
  row: { flexDirection: "row", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center"
  },
  name: { fontWeight: "bold" },
  sub: { fontSize: 12, color: "gray" },
  mobile: { fontSize: 12 }
});