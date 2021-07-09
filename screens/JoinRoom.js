import React, { Component } from "react";
import {
  Alert,
  Button,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors } from "../constants/Color";
import { GameBoard } from "../functions/game";
import { createRoom, joinRoom } from "../functions/index";
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      room: "",
      isLoading: false,
    };
  }

  onLogin = async () => {
    const { name, room } = this.state;

    if (room.trim() === "" || name.trim() === "") {
      alert("Please enter Valid Properties");
      return;
    }

    this.setState({ isLoading: true });
    try {
      let response = await joinRoom(room, name);
      this.props.navigation.navigate("OnlineGameScreen", {
        clr: this.props.route.params.clr,
        roomId: response.roomID,
        name: name,
      });
    } catch (error) {
      console.log(error);
      alert("No such room! Please eneter a valid Room ID");
    }
    this.setState({ isLoading: false });
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <View
          style={{
            ...styles.container,
            backgroundColor:
              colors[this.props.route.params.clr].backgroundColor,
          }}
        >
          <TextInput
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
            placeholder={"Enter Your Name"}
            style={styles.input}
          />
          <TextInput
            value={this.state.room}
            onChangeText={(room) => this.setState({ room })}
            placeholder={"Enter Room Id"}
            style={styles.input}
          />

          <Button
            title={"Join Room"}
            color={colors[this.props.route.params.clr].primaryColor}
            style={styles.input}
            onPress={this.onLogin.bind(this)}
          />
        </View>
      );
    } else {
      return (
        <View style={[styles.container2, styles.horizontal]}>
          <ActivityIndicator
            size="large"
            color={colors[this.props.route.params.clr].primaryColor}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
  },
  container2: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
