import "expo-router/entry";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./src/navigation/AppNavigator";
import { persistor, store } from "./src/store";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}
