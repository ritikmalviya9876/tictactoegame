import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons as Icon2 } from "react-native-vector-icons";
import { FontAwesome as Icon3 } from "react-native-vector-icons";
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
      width: 150,
      height: 150,
      borderRadius: 20,
      backgroundColor: colors[clr].secondaryColor,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 32 }}>Single Player</Text>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Select Mode</Text>
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
            style={[styles.button, { marginRight: 10 }]}
            onPress={() =>
              props.navigation.navigate("SinglePlayerFormVsHuman", { clr: clr })
            }
          >
            <Icon2
              name="person"
              style={{ color: colors[clr].primaryColor, fontSize: 100 }}
            />
            <Text>Vs Human </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginLeft: 10 }]}
            onPress={() =>
              props.navigation.navigate("SinglePlayerFormVsRobot", { clr: clr })
            }
          >
            <Icon3
              name="android"
              style={{ color: colors[clr].primaryColor, fontSize: 100 }}
            />
            <Text>Vs Robot</Text>
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
