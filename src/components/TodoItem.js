import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TodoItem({ todo, onComplete, onDelete, onEdit }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation for mounting
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Shake animation for delete button
  const handleDeletePress = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After animation ends, trigger delete action
      onDelete();
    });
  };

  const categoryColors = {
    Work: '#007bff',
    Personal: '#9b5de5',
    Urgent: '#ef233c',
  };

  const accent = categoryColors[todo.category] || '#00b4d8';

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateX: shakeAnim }],
          borderLeftColor: accent,
        },
      ]}
    >
      <View style={styles.info}>
        <Text style={styles.title}>{todo.title}</Text>
        {todo.description ? (
          <Text style={styles.description}>{todo.description}</Text>
        ) : null}

        <View style={styles.tagsRow}>
          <View style={[styles.tag, { backgroundColor: accent + '33' }]}>
            <Text style={[styles.tagText, { color: accent }]}>{todo.category}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: '#fef3c7' }]}>
            <Text
              style={[
                styles.tagText,
                {
                  color:
                    todo.priority === 'High'
                      ? '#dc2626'
                      : todo.priority === 'Medium'
                      ? '#f59e0b'
                      : '#16a34a',
                },
              ]}
            >
              {todo.priority}
            </Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        {/* Done */}
        <Pressable
          onPress={onComplete}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: '#16a34a' },
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons name="check-circle" size={22} color="#fff" />
        </Pressable>

        {/* Edit */}
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: '#f59e0b' },
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons name="edit" size={22} color="#fff" />
        </Pressable>

        {/* Delete (shake animation) */}
        <Pressable
          onPress={handleDeletePress}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: '#dc2626' },
            pressed && { opacity: 0.8 },
          ]}
        >
          <MaterialIcons name="delete" size={22} color="#fff" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderLeftWidth: 5,
    alignItems: 'center',
  },
  info: { flex: 1, paddingRight: 10 },
  title: { fontSize: 17, fontWeight: '700', color: '#333' },
  description: { fontSize: 14, color: '#555', marginTop: 2 },
  tagsRow: { flexDirection: 'row', marginTop: 8 },
  tag: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 6,
  },
  tagText: { fontSize: 12, fontWeight: '600' },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconBtn: {
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 10,
    elevation: 3,
  },
});
