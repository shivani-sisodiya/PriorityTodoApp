import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://dummyjson.com";

// Store tokens
const saveTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.setItem("accessToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);
};

// Login API
export const loginApi = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();
    await saveTokens(data.accessToken, data.refreshToken);
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Logout API
export const logoutApi = async () => {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
};
