import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RegisterProvider } from "./context/RegisterContext"; // Contexto de registro
import { MatchProvider } from "./utils/MatchContext"; // Contexto de matches

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileFormScreen from "./screens/FormProfileScreen";
import GenderScreen from "./screens/GenderScreen";
import InterestsScreen from "./screens/InterestsScreen";
import ProfilePictureScreen from "./screens/ProfilePictureScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MatchScreen from "./screens/MatchScreen";
import ChatScreen from "./screens/ChatScreen";
import MatchesScreen from "./screens/MatchesScreen";
import ChatRoomScreen from "./screens/ChatRoomScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <RegisterProvider>
      <MatchProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Profile">
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
              name="FormProfile"
              component={ProfileFormScreen}
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
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Match"
              component={MatchScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Matches"
              component={MatchesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoomScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MatchProvider>
    </RegisterProvider>
  );
};

export default App;
