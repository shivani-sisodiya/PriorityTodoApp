import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddEditTodoScreen from "../screens/AddEditTodoScreen";
import DashboardScreen from "../screens/DashboardScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="AddEditTodo"
          component={AddEditTodoScreen}
          options={{ title: "Add / Edit Task" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
