# PriorityTodoApp
React Native start project is typically done using the Expo CLI or the React Native CLI. For a quick and manageable start, especially for a project like the To-Do App task, Expo Go is highly recommended.

# 📝 Priority To-Do App (React Native + Redux)

A modern cross-platform **React Native To-Do Application** built with **Redux Toolkit** for state management.  
It features task creation, editing, sorting by priority, search, category grouping, and beautiful animations — all optimized for **performance and simplicity**.

---

## 🚀 Features

✅ Add, edit, and delete tasks  
✅ Group tasks by category (Work, Personal, Urgent)  
✅ Sort tasks by priority (High → Low)  
✅ Search tasks by title or description  
✅ Mark tasks as completed / restore tasks  
✅ In-memory Redux state (no persistence)  
✅ Clean, modern UI with gradient header and animations  
✅ Works on **Android**, **iOS**, and **Web**

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend Framework | [React Native](https://reactnative.dev/) (Expo) |
| State Management | [Redux Toolkit](https://redux-toolkit.js.org/) |
| Navigation | [React Navigation](https://reactnavigation.org/) |
| Icons | [@expo/vector-icons (MaterialIcons)](https://icons.expo.fyi/) |
| Styling | React Native StyleSheet + LinearGradient |
| Build | Expo CLI |

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/priority-todo-app.git
   cd priority-todo-app

2. Install dependencies
npm install

3. Run the app (Expo)
  npx expo start

5. Run on specific platform
# Android
npx expo run:android

# iOS
npx expo run:ios

# Web
npx expo start --web


---

🧭 Navigation Flow

LoginScreen

- Uses a fake login API (loginApi()).

- Navigates to DashboardScreen after success.

DashboardScreen

- Displays all tasks grouped by category.

- Allows searching, sorting, marking complete, deleting, and adding tasks.

- "Add" navigates to AddEditTodoModal.

- "Logout" returns to Login screen.

AddEditTodoModal

- Allows adding a new task or editing an existing one.

- Selects Priority and Category from animated modal pickers.

<img width="1206" height="2622" alt="login" src="https://github.com/user-attachments/assets/28a1ea9c-4f40-4966-8e1c-6a62fa521375" />
<img width="1206" height="2622" alt="dashboard" src="https://github.com/user-attachments/assets/486a6770-4ce3-427a-a024-fc5c930a100f" />





