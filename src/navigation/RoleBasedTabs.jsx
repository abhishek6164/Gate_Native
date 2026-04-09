import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Icons ke liye
import { View, Platform } from "react-native";

// SCREENS (Keep your existing imports)
import Alerts from "../screens/common/Alerts";
import Community from "../screens/common/CommunityScreen";
import Profile from "../screens/common/ProfileScreen";
import EntryForm from "../screens/guard/EntryForm";
import ApprovedRequestScreen from "../screens/common/ApprovedRequestScreen";
import UserApproval from "../screens/admin/UserApproval";
import VisitorsScreen from "../screens/common/VisitorsScreen";
import CreateUserScreen from "../screens/admin/CreateUserScreen";
import PreApprovalForm from "../screens/common/PreApprovalForm";

const Tab = createBottomTabNavigator();

export default function RoleBasedTabs() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const user = await AsyncStorage.getItem("user");
            if (user) setRole(JSON.parse(user).role);
        };
        getUser();
    }, []);

    if (!role) return null;

    // Helper function icons set karne ke liye
    const getIcon = (routeName, focused) => {
        let iconName;
        if (routeName === "Approvals" || routeName === "Alerts") iconName = focused ? "notifications" : "notifications-outline";
        else if (routeName === "Visitors" || routeName === "Gate") iconName = focused ? "list" : "list-outline";
        else if (routeName === "NewUsers" || routeName === "CreatePass") iconName = focused ? "add-circle" : "add-circle-outline";
        else if (routeName === "Community") iconName = focused ? "people" : "people-outline";
        else if (routeName === "Profile") iconName = focused ? "person" : "person-outline";
        else if (routeName === "Approved") iconName = focused ? "checkmark-circle" : "checkmark-circle-outline";

        return <Ionicons name={iconName} size={24} color={focused ? "#6366f1" : "#94a3b8"} />;
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => getIcon(route.name, focused),
                tabBarActiveTintColor: "#6366f1",
                tabBarInactiveTintColor: "#94a3b8",
                tabBarStyle: {
                    height: Platform.OS === "ios" ? 90 : 70,
                    paddingBottom: Platform.OS === "ios" ? 30 : 12,
                    paddingTop: 12,
                    backgroundColor: "#ffffff",
                    borderTopWidth: 0,
                    elevation: 20, // Shadow for Android
                    shadowColor: "#000", // Shadow for iOS
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                },
            })}
        >
            {/* ADMIN */}
            {role === "ADMIN" && (
                <>
                    <Tab.Screen name="Approvals" component={UserApproval} options={{ title: "Requests" }} />
                    <Tab.Screen name="Visitors" component={VisitorsScreen} />
                    <Tab.Screen name="NewUsers" component={CreateUserScreen} options={{ title: "Add User" }} />
                </>
            )}

            {/* GUARD */}
            {role === "GUARD" && (
                <>
                    <Tab.Screen name="Gate" component={EntryForm} options={{ title: "Log Entry" }} />
                    <Tab.Screen name="Visitors" component={VisitorsScreen} />
                    <Tab.Screen name="Approved" component={ApprovedRequestScreen} options={{ title: "Verify" }} />
                </>
            )}

            {/* RESIDENTS (OWNER/TENANT/FAMILY) - Reusing logic to avoid code duplication */}
            {(role === "OWNER" || role === "TENANT" || role === "FAMILY") && (
                <>
                    <Tab.Screen name="Alerts" component={Alerts} />
                    <Tab.Screen name="CreatePass" component={PreApprovalForm} options={{ title: "Pre-Approve" }} />
                </>
            )}

            {/* COMMON SCREENS */}
            <Tab.Screen name="Community" component={Community} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}