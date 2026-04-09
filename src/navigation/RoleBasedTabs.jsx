import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// SCREENS
import Alerts from "../screens/common/Alerts";
import Community from "../screens/common/CommunityScreen";
import Profile from "../screens/common/ProfileScreen";

// GUARD
import EntryForm from "../screens/guard/EntryForm";
import ApprovedRequestScreen from "../screens/common/ApprovedRequestScreen";
// ADMIN
import UserApproval from "../screens/admin/UserApproval";
import VisitorsScreen from "../screens/common/VisitorsScreen";
import CreateUserScreen from "../screens/admin/CreateUserScreen";

// OWNER / TENANT / FAMILY
import PreApprovalForm from "../screens/common/PreApprovalForm";

const Tab = createBottomTabNavigator();

export default function RoleBasedTabs() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const user = await AsyncStorage.getItem("user");
            if (user) {
                setRole(JSON.parse(user).role);
            }
        };
        getUser();
    }, []);

    if (!role) return null;

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>

            {/*  ADMIN */}
            {role === "ADMIN" && (
                <>
                    <Tab.Screen name="Approvals" component={UserApproval} />
                    <Tab.Screen name="Visitors" component={VisitorsScreen} />
                    <Tab.Screen name="NewUsers" component={CreateUserScreen} />
                    <Tab.Screen name="Community" component={Community} />
                    <Tab.Screen name="Profile" component={Profile} />
                </>
            )}

            {/*  GUARD */}
            {role === "GUARD" && (
                <>
                    <Tab.Screen name="Gate" component={EntryForm} />
                    <Tab.Screen name="Visitors" component={VisitorsScreen} />
                    <Tab.Screen name="ApprovedRequestScreen" component={ApprovedRequestScreen} />
                    <Tab.Screen name="Community" component={Community} />
                    <Tab.Screen name="Profile" component={Profile} />
                </>
            )}

            {/*  OWNER */}
            {role === "OWNER" && (
                <>
                    <Tab.Screen name="Alerts" component={Alerts} />
                    <Tab.Screen name="CreatePass" component={PreApprovalForm} />
                    <Tab.Screen name="Community" component={Community} />
                    <Tab.Screen name="Profile" component={Profile} />
                </>
            )}

            {/*  TENANT */}
            {role === "TENANT" && (
                <>
                    <Tab.Screen name="Alerts" component={Alerts} />
                    <Tab.Screen name="CreatePass" component={PreApprovalForm} />
                    <Tab.Screen name="Community" component={Community} />
                    <Tab.Screen name="Profile" component={Profile} />
                </>
            )}

            {/*  FAMILY */}
            {role === "FAMILY" && (
                <>
                    <Tab.Screen name="Alerts" component={Alerts} />
                    <Tab.Screen name="CreatePass" component={PreApprovalForm} />
                    <Tab.Screen name="Community" component={Community} />
                    <Tab.Screen name="Profile" component={Profile} />
                </>
            )}

        </Tab.Navigator>
    );
}