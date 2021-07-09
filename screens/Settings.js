import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ToggleButton } from "react-native-paper";
import { colors } from "../constants/Color";

export default class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.extraData,
    };
  }

  updateTheme(value) {
    this.setState({ value: value });
    this.props.extraData2(value);
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        width: "100%",
        height: "100%",
      },
      button: {
        width: 100,
        height: 100,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
      },
    });
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: colors[this.state.value].backgroundColor,
        }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 32 }}>Settings</Text>
        </View>

        <View style={{ flex: 1, padding: 5 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            Choose Theme
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ToggleButton.Row
              style={{ marginTop: 10 }}
              onValueChange={(value) => {
                if (value !== null) this.updateTheme(value);
                else alert("Already " + this.state.value);
              }}
              value={this.state.value}
            >
              <ToggleButton icon="square" color="red" value="red" />
              <ToggleButton icon="square" color="blue" value="blue" />
              <ToggleButton icon="square" color="yellow" value="yellow" />
              <ToggleButton icon="square" color="green" value="green" />
              <ToggleButton icon="square" color="orange" value="orange" />
              <ToggleButton icon="square" color="brown" value="dark" />
            </ToggleButton.Row>
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
          <Text style={{ fontWeight: "bold", fontSize: 22, marginBottom: 50 }}>
            Build with 💙 by Ritik Malviya
          </Text>
        </View>
      </View>
    );
  }
}
