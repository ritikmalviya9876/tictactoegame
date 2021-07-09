import React, { Component } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { colors } from "../constants/Color";
import { GameBoard } from "../functions/game";
import { createRoom } from "../functions/index";
export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      isLoading: false,
    };
  }

  onLogin = async () => {
    const { name } = this.state;
    if (name.trim() === "") {
      alert("Please enter Valid Name");
      return;
    }

    let gameObj = JSON.parse(JSON.stringify(new GameBoard(name, null)));
    gameObj._turn = name;
    this.setState({ isLoading: true });
    try {
      let { roomID } = await createRoom({
        ...gameObj,
        PLAYER_ONE: name,
      });
      this.props.navigation.navigate("OnlineGameScreen", {
        clr: this.props.route.params.clr,
        roomId: roomID,
        name: name,
      });
    } catch (error) {
      console.log(error);
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

          <Button
            title={"Create Room"}
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
});
