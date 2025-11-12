import React, { useState, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addTodo, updateTodo } from "../store/todosSlice";

const PRIORITIES = ["High", "Medium", "Low"];
const CATEGORIES = ["Work", "Personal", "Urgent"];

export default function AddEditTodoModal({ navigation, route }) {
  const dispatch = useDispatch();
  const existing = route.params?.todo;

  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [priority, setPriority] = useState(existing?.priority || "Medium");
  const [category, setCategory] = useState(existing?.category || "Work");

  const [priorityModal, setPriorityModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);

  // Animation setup for modal
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showModal = (setVisible) => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = (setVisible) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: existing ? "✏️ Edit Task" : "➕ Add Task",
      headerStyle: { backgroundColor: "#007bff" },
      headerTintColor: "#fff",
    });
  }, [navigation, existing]);

  const onSave = () => {
    if (!title.trim()) return alert("Please enter a title.");
    if (existing) {
      dispatch(
        updateTodo({ id: existing.id, title, description, priority, category })
      );
    } else {
      dispatch(addTodo({ title, description, priority, category }));
    }
    navigation.goBack();
  };

  const renderModal = (
    visible,
    setVisible,
    options,
    current,
    setValue,
    label
  ) => (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => hideModal(setVisible)}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          { opacity: fadeAnim, transform: [{ scale: fadeAnim }] },
        ]}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select {label}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  item === current && { backgroundColor: "#007bff20" },
                ]}
                onPress={() => {
                  setValue(item);
                  hideModal(setVisible);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    item === current && {
                      color: "#007bff",
                      fontWeight: "700",
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => hideModal(setVisible)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={["#e0f2ff", "#f8faff"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Input Card */}
          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title..."
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter task details..."
            />

            <Text style={styles.label}>Priority</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => showModal(setPriorityModal)}
            >
              <MaterialIcons name="flag" size={18} color="#007bff" />
              <Text style={styles.selectorText}>{priority}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => showModal(setCategoryModal)}
            >
              <MaterialIcons name="category" size={18} color="#007bff" />
              <Text style={styles.selectorText}>{category}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Floating Save Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onSave}
          style={styles.saveButton}
        >
          <LinearGradient
            colors={["#007bff", "#00b4d8"]}
            style={styles.saveGradient}
          >
            <MaterialIcons name="save" size={24} color="#fff" />
            <Text style={styles.saveText}>Save Task</Text>
          </LinearGradient>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {/* Priority Modal */}
      {renderModal(
        priorityModal,
        setPriorityModal,
        PRIORITIES,
        priority,
        setPriority,
        "Priority"
      )}

      {/* Category Modal */}
      {renderModal(
        categoryModal,
        setCategoryModal,
        CATEGORIES,
        category,
        setCategory,
        "Category"
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 80 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 6,
    color: "#007bff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    fontSize: 16,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
  },
  selectorText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#111",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007bff",
    marginBottom: 10,
    textAlign: "center",
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  optionText: { fontSize: 16, textAlign: "center" },
  cancelButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelText: { color: "#007bff", fontWeight: "700" },
  saveButton: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  saveGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    paddingVertical: 14,
    elevation: 5,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 8,
  },
});
