import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "react-native-vector-icons";
import { Ionicons as Icon2 } from "react-native-vector-icons";
import { colors } from "../constants/Color";

function Home(props) {
  let clr = props.route.params.clr;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors[clr].backgroundColor,
      width: "100%",
      height: "100%",
    },
    button: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: colors[clr].secondaryColor,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  const [playerName, setPlayerName] = useState("player");

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 32 }}>Single Player</Text>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>Vs Human</Text>
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
          <View
            style={[styles.button, { flexDirection: "row", width: 210 }]}
            // onPress={() => this.handleClrick(1)}
          >
            <Icon
              name="account"
              style={{ color: colors[clr].primaryColor, fontSize: 30 }}
            />
            <TextInput
              style={{ marginLeft: 10, width: 100, height: 50 }}
              onChangeText={(text) => setPlayerName(text)}
              value={playerName}
            />
          </View>
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
              props.navigation.navigate("SinglePlayerHuman", {
                player: playerName,
                clr: clr,
              })
            }
          >
            <Icon2
              name="play"
              style={{ color: colors[clr].primaryColor, fontSize: 40 }}
            />
            <Text>Start Game</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginLeft: 5 }]}
            onPress={() => alert("Please go to Main Scren for Setting!")}
          >
            <Icon2
              name="settings"
              style={{ color: colors[clr].primaryColor, fontSize: 40 }}
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
