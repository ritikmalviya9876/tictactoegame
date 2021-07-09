import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons as Icon } from "react-native-vector-icons";
import { Ionicons as Icon2 } from "react-native-vector-icons";
import { colors } from "../constants/Color";

function Home(props) {
  let clr = props.extraData;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[clr].backgroundColor,
      width: "100%",
      height: "100%",
    },
    button: {
      width: 100,
      height: 100,
      borderRadius: 20,
      backgroundColor: colors[clr].secondaryColor,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Welcome to </Text>
        <Text style={{ fontWeight: "bold", fontSize: 32 }}>Tic Tac Toe !</Text>
      </View>

      <View style={{ flex: 1, padding: 5 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[styles.button, { marginRight: 5 }]}
            onPress={() =>
              props.navigation.navigate("SinglePlayerMode", { clr: clr })
            }
          >
            <Icon
              name="account"
              style={{
                color: colors[clr].primaryColor,
                fontSize: 50,
              }}
            />
            <Text>Single Player</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginLeft: 5 }]}
            onPress={() =>
              props.navigation.navigate("MultiplayerForm", { clr: clr })
            }
          >
            <Icon
              name="account-multiple"
              style={{ color: colors[clr].primaryColor, fontSize: 50 }}
            />
            <Text>Multi Player</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[styles.button, { marginRight: 5 }]}
            onPress={() =>
              props.navigation.navigate("PlayOnline", { clr: clr })
            }
          >
            <Icon2
              name="game-controller"
              style={{ color: colors[clr].primaryColor, fontSize: 50 }}
            />
            <Text>Play Online</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginLeft: 5 }]}
            onPress={() => props.navigation.navigate("Settings")}
          >
            <Icon2
              name="settings"
              style={{ color: colors[clr].primaryColor, fontSize: 50 }}
            />
            <Text>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 0.75,
          marginBottom: 10,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          Build with Expo
        </Text>
      </View>
    </View>
  );
}

export default Home;
