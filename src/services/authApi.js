import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.177:5000/api";

const getHeaders = async () => {
    const token = await AsyncStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// ============ AUTH ============
export const signupUser = async (data) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Signup failed");
    return result;
};

export const loginUser = async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Login failed");
    return result;
};

// ============ ADMIN ============
export const getPendingUsers = async () => {
    const res = await fetch(`${BASE_URL}/admin/pending-users`, {
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const approveUser = async (id) => {
    const res = await fetch(`${BASE_URL}/admin/approve/${id}`, {
        method: "PUT",
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const rejectUser = async (id) => {
    const res = await fetch(`${BASE_URL}/admin/reject/${id}`, {
        method: "PUT",
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const createUser = async (data) => {
    const res = await fetch(`${BASE_URL}/admin/create-user`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

// ============ COMMON ============
export const getResidents = async () => {
    const res = await fetch(`${BASE_URL}/admin/residents`, {
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const getProfile = async () => {
    const res = await fetch(`${BASE_URL}/admin/profile`, {
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};



// ============ VISITORS ============
export const logVisitorEntry = async (data) => {
    const res = await fetch(`${BASE_URL}/visitors/entry`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const getTodayEntries = async () => {
    const res = await fetch(`${BASE_URL}/visitors/today`, {
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const getPreApprovals = async () => {
    const res = await fetch(`${BASE_URL}/visitors/pre-approvals`, {
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const logVisitorExit = async (id) => {
    const res = await fetch(`${BASE_URL}/visitors/exit/${id}`, {
        method: "PUT",
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const createPreApproval = async (data) => {
    const res = await fetch(`${BASE_URL}/visitors/pre-approval`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const getMyPreApprovals = async () => {
    const res = await fetch(`${BASE_URL}/visitors/my-approvals`, {
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

// ============ ALERTS ============
export const getMyAlerts = async () => {
    const res = await fetch(`${BASE_URL}/alerts/my-alerts`, {
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const updateAlertStatus = async (id, status) => {
    const res = await fetch(`${BASE_URL}/alerts/update/${id}`, {
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify({
            status
        })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const savePushToken = async (token) => {
    const res = await fetch(`${BASE_URL}/alerts/save-token`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({
            token
        })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};

export const markPreApprovalUsed = async (id) => {
    const res = await fetch(`${BASE_URL}/visitors/mark-used/${id}`, {
        method: "PUT",
        headers: await getHeaders()
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result;
};