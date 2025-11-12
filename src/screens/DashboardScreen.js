import React, { useState, useCallback, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { markCompleted, deleteTodo, restoreTodo } from "../store/todosSlice";
import TodoItem from "../components/TodoItem";
import {
  makeSelectFilteredGroups,
  selectCompletedTodos,
} from "../store/selectors";

export default function DashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [sortEnabled, setSortEnabled] = useState(true);

  const grouped = useSelector((state) =>
    makeSelectFilteredGroups(search, sortEnabled)(state)
  );
  const completed = useSelector(selectCompletedTodos);

  const onAdd = useCallback(
    () => navigation.navigate("AddEditTodo"),
    [navigation]
  );
  const handleMarkComplete = useCallback(
    (id) => dispatch(markCompleted(id)),
    [dispatch]
  );
  const handleDelete = useCallback(
    (id) => dispatch(deleteTodo(id)),
    [dispatch]
  );
  const handleRestore = useCallback(
    (id) => dispatch(restoreTodo(id)),
    [dispatch]
  );

  // Logout confirmation
  const handleLogout = () => {
    if (Platform.OS === "web") {
      navigation.replace("Login");
    } else {
      Alert.alert("Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => navigation.replace("Login"),
        },
      ]);
    }
  };

  // Header configuration
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderCategory = ({ item: group }) => (
    <View style={styles.groupCard}>
      <Text style={styles.groupTitle}>{group.category}</Text>
      <FlatList
        data={group.tasks || []}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onComplete={() => handleMarkComplete(item.id)}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => navigation.navigate("AddEditTodo", { todo: item })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks in this category</Text>
        }
      />
    </View>
  );

  const renderCompleted = ({ item }) => (
    <View style={styles.completedItem}>
      <Text style={styles.completedTitle}>{item.title}</Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => handleRestore(item.id)}
          style={[styles.smallBtn, { backgroundColor: "#e8f5e9" }]}
        >
          <Text style={{ color: "#2e7d32" }}>Restore</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.smallBtn, { backgroundColor: "#ffebee" }]}
        >
          <Text style={{ color: "#c62828" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#007bff", "#00b4d8"]} style={styles.header}>
        <Text style={styles.headerTitle}>📋 Dashboard</Text>
        <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
          <MaterialIcons name="logout" size={26} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          placeholder="🔍 Search title or description..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Sorting & Add buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            { backgroundColor: sortEnabled ? "#34d399" : "#6b7280" },
          ]}
          onPress={() => setSortEnabled((prev) => !prev)}
        >
          <MaterialIcons name="sort" size={18} color="#fff" />
          <Text style={styles.sortText}>
            {sortEnabled ? "Sorted" : "Unsorted"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onAdd} style={styles.addButton}>
          <MaterialIcons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task Groups */}
      <FlatList
        data={grouped || []}
        keyExtractor={(g) => g.category}
        renderItem={renderCategory}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet — add one!</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Completed Tasks */}
      <View style={styles.completed}>
        <Text style={styles.groupTitle}>✅ Completed Tasks</Text>
        <FlatList
          data={completed || []}
          keyExtractor={(i) => i.id}
          renderItem={renderCompleted}
          ListEmptyComponent={
            <Text style={styles.empty}>No completed tasks</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef2f3" },

  // Header styling
  header: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    top: 20,
    fontWeight: "800",
  },
  logoutIcon: {
    position: "absolute",
    right: 20,
    top: 50,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 20,
  },

  // Search input
  searchContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 12,
    padding: 8,
    elevation: 3,
  },
  search: {
    borderWidth: 0,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#111",
  },

  // Buttons row
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 15,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sortText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6f61",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 6,
  },

  // Task list cards
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 10,
    marginVertical: 6,
    elevation: 3,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0077b6",
    marginBottom: 6,
  },
  empty: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginVertical: 12,
  },
  completed: {
    marginHorizontal: 10,
    marginTop: 16,
    backgroundColor: "#f0f9ff",
    padding: 10,
    borderRadius: 10,
  },
  completedItem: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  completedTitle: {
    fontWeight: "700",
    color: "#333",
  },
  smallBtn: {
    padding: 6,
    borderRadius: 8,
    marginLeft: 6,
    elevation: 2,
  },
});
