import React, { useState, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./screens/Home";
import SinglePlayerMode from "./screens/SinglePlayerMode";
import SinglePlayerFormVsHuman from "./screens/SinglePlayerFormVsHuman";
import SinglePlayerFormVsRobot from "./screens/SinglePlayerFormVsRobot";
import SinglePlayerHuman from "./screens/SinglePlayerHuman";
import SinglePlayerRobot from "./screens/SinglePlayerRobot";
import MultiplayerForm from "./screens/MultiplayerForm";
import MultiPlayerScreen from "./screens/MultiPlayerScreen";
import Settings from "./screens/Settings";
import PlayOnline from "./screens/PlayOnline";
import JoinRoom from "./screens/JoinRoom";
import CreateRoom from "./screens/CreateRoom";
import OnlineGameScreen from "./screens/OnlineGameScreen";

import { colors } from "./constants/Color";

const Stack = createStackNavigator();

function MyStack() {
  const [color, setColor] = useState("blue");
  let changeColor = (newColor) => {
    setColor(newColor);
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors[color].backgroundColor,
        },
        headerTitleAlign: "center",
        headerTintColor: colors[color].primarYColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="Home" options={{ title: "Home" }}>
        {(props) => <Home {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen
        name="SinglePlayerMode"
        options={{ title: "Single Player Mode" }}
      >
        {(props) => <SinglePlayerMode {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen
        name="SinglePlayerFormVsHuman"
        options={{ title: "Vs Human Mode" }}
      >
        {(props) => <SinglePlayerFormVsHuman {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen
        name="SinglePlayerFormVsRobot"
        options={{ title: "Vs Robot Mode" }}
      >
        {(props) => <SinglePlayerFormVsRobot {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen name="SinglePlayerHuman" options={{ title: "Vs Human" }}>
        {(props) => <SinglePlayerHuman {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen name="SinglePlayerRobot" options={{ title: "Vs Robot" }}>
        {(props) => <SinglePlayerRobot {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen name="MultiplayerForm" options={{ title: "2 Player Mode" }}>
        {(props) => <MultiplayerForm {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen
        name="MultiPlayerScreen"
        options={{ title: "2 Player Mode" }}
      >
        {(props) => <MultiPlayerScreen {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen name="PlayOnline" options={{ title: "Online Mode" }}>
        {(props) => <PlayOnline {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen name="JoinRoom" options={{ title: "Join Room" }}>
        {(props) => <JoinRoom {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen name="CreateRoom" options={{ title: "Create Room" }}>
        {(props) => <CreateRoom {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen name="OnlineGameScreen" options={{ title: "Online Mode" }}>
        {(props) => <OnlineGameScreen {...props} extraData={color} />}
      </Stack.Screen>

      <Stack.Screen name="Settings" options={{ title: "Settings" }}>
        {(props) => (
          <Settings {...props} extraData={color} extraData2={changeColor} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
