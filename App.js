import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import GenderScreen from "./screens/GenderScreen";
import InterestsScreen from "./screens/InterestsScreen";
import ProfilePictureScreen from "./screens/ProfilePictureScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Interests">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Gender"
          component={GenderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Interests"
          component={InterestsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfilePictureScreen"
          component={ProfilePictureScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
