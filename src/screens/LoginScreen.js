import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { loginApi } from "../utils/api";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    setLoading(true);
    try {
      const loginResult = await loginApi(username, password);
      console.log("Login successful:", loginResult);
      navigation.replace("Dashboard");
    } catch (err) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#007bff", "#00b4d8", "#90e0ef"]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Animated Header */}
          <Animated.View
            style={[
              styles.headerContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/992/992651.png",
              }}
              style={styles.logo}
            />
            <Text style={styles.title}>Priority To-Do</Text>
            <Text style={styles.subtitle}>Organize. Focus. Achieve.</Text>
          </Animated.View>

          {/* Login Card */}
          <Animated.View
            style={[
              styles.card,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Username */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={22} color="#007bff" />
              <TextInput
                placeholder="Username"
                placeholderTextColor="#999"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                editable={!loading}
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={22} color="#007bff" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onLogin}
              disabled={loading}
              style={{ marginTop: 15 }}
            >
              <LinearGradient
                colors={["#007bff", "#00b4d8"]}
                style={styles.loginButton}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="login" size={22} color="#fff" />
                    <Text style={styles.loginText}>Login</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#e0f7fa",
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#111",
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
});
