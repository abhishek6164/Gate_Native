import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function CommunityScreen() {
  const residentsData = [
    { id: '1', name: "Ethan Hunt", role: "OWNER", flat: "A-101", mobile: "9876543210" },
    { id: '2', name: "Alice Smith", role: "TENANT", flat: "B-202", mobile: "9123456780" },
    { id: '3', name: "Bob Johnson", role: "FAMILY", flat: "C-303", mobile: "9988776655" },
    { id: '4', name: "Charlie Brown", role: "OWNER", flat: "D-404", mobile: "9988112233" },
  ];

  const [search, setSearch] = useState("");

  const filtered = residentsData.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.flat.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleTheme = (role) => {
    switch (role) {
      case "OWNER": return { bg: "#ecfdf5", text: "#059669", circle: "#10b981" };
      case "TENANT": return { bg: "#eff6ff", text: "#2563eb", circle: "#3b82f6" };
      default: return { bg: "#fff7ed", text: "#d97706", circle: "#f59e0b" };
    }
  };

  const renderResident = ({ item }) => {
    const theme = getRoleTheme(item.role);
    // Get Initials for Avatar
    const initials = item.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
      <TouchableOpacity activeOpacity={0.7} style={styles.card}>
        <View style={styles.leftSection}>
          <View style={[styles.avatar, { backgroundColor: theme.circle }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.nameText}>{item.name}</Text>
            <View style={styles.flatTag}>
              <Text style={styles.flatText}>📍 {item.flat}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <View style={[styles.roleBadge, { backgroundColor: theme.bg }]}>
            <Text style={[styles.roleText, { color: theme.text }]}>{item.role}</Text>
          </View>
          <Text style={styles.mobileText}>{item.mobile}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>{residentsData.length} Members in your society</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search by name or flat number..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderResident}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No residents found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Clean Slate background
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    // Soft Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#1e293b",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  leftSection: {
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
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },
  flatTag: {
    marginTop: 4,
  },
  flatText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  mobileText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 16,
  }
});