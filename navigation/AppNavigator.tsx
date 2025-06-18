import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { LoginScreen } from "../screens/LoginScreen"
import { WelcomeScreen } from "../screens/WelcomeScreen"
import { CameraScreen } from "../screens/CameraScreen"
import { IDScreen } from "../screens/idScreen/IDScreen"

const Stack = createStackNavigator()

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="ID" component={IDScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
