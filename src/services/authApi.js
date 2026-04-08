//  BASE URL (BAAD ME SIRF YAHI CHANGE KARNA)
const BASE_URL = "http://localhost:8000/api";
// baad me:
// const BASE_URL = "https://your-django-api.com/api";


//  HAR ROLE KE LOGIN IDS (TESTING KE LIYE)
const usersDB = [{
        email: "admin@gmail.com",
        password: "admin123",
        role: "ADMIN",
        status: "APPROVED",
    },
    {
        email: "family@gmail.com",
        password: "family123",
        role: "FAMILY",
        status: "APPROVED",
    },
    {
        email: "owner@gmail.com",
        password: "owner123",
        role: "OWNER",
        status: "APPROVED",
    },
    {
        email: "tenant@gmail.com",
        password: "tenant123",
        role: "TENANT",
        status: "APPROVED",
    },
    {
        email: "guard@gmail.com",
        password: "guard123",
        role: "GUARD",
        status: "APPROVED",
    },
];


//  LOGIN API
export const loginUser = async (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            const foundUser = usersDB.find(
                (u) =>
                u.email === data.email.trim().toLowerCase() &&
                u.password === data.password.trim()
            );

            if (!foundUser) {
                reject("Wrong credentials");
            } else {
                resolve({
                    token: "fake-token",
                    user: foundUser,
                });
            }
        }, 800);
    });
};

//  SIGNUP API
// eslint-disable-next-line no-unused-vars
export const signupUser = async (data) => {
    //  MOCK
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                message: "Signup request sent",
            });
        }, 800);
    });

    //  BAAD ME
    /*
    const res = await fetch(`${BASE_URL}/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
    */
};