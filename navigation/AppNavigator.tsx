import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import { BlobLoader } from "../components/BlobLoader";
import { LoadingContext } from "../context/LoadingContext";
import { IUserData, UserContext } from "../context/UserContext";
import { CameraScreen } from "../screens/camera/CameraScreen";
import { IDScreen } from "../screens/idScreen/IDScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { ObservationScreen } from "../screens/ObservationScreen";
import { WelcomeScreen } from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <NavigationContainer>
      <UserContext value={{ userData, setUserData }}>
        <LoadingContext value={{ loading, setLoading }}>
          {loading && <BlobLoader />}
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="ID" component={IDScreen} />
            <Stack.Screen name="Observation" component={ObservationScreen} />
          </Stack.Navigator>
        </LoadingContext>
      </UserContext>
    </NavigationContainer>
  );
};
