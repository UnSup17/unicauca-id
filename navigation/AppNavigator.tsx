import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { CameraScreen } from "../screens/CameraScreen";
import { IDScreen } from "../screens/idScreen/IDScreen";
import { IUserData, UserContext } from "../context/UserContext";
import { useState } from "react";

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  return (
    <NavigationContainer>
      <UserContext value={{ userData, setUserData }}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="ID" component={IDScreen} />
        </Stack.Navigator>
      </UserContext>
    </NavigationContainer>
  );
};
