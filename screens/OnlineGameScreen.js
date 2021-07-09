import { useEffect, useState } from "react";
import { GameBoard } from "../functions/game";
import { database } from "../.firebase/index";
import { leaveRoom, sendData } from "../functions/index";
import { View, TouchableOpacity, Text, StyleSheet, Button } from "react-native";
import { Entypo as Icon2 } from "react-native-vector-icons";
import { colors } from "../constants/Color";
import Clipboard from "expo-clipboard";

import React from "react";

const OnlineGameScreen = (props) => {
  const state = props.route.params;
  const [remoteData, setRemoteData] = useState(null);
  const [wins, setWins] = useState({ me: 0, other: 0 });

  const roomID = props.route.params.roomId;
  useEffect(() => {
    // get live data from remote server and update it in state
    database.ref(props.route.params.roomId).on("value", (snap) => {
      setRemoteData(snap.val());
    });
  }, [props.route.params.roomId]);

  useEffect(() => {
    if (remoteData?.winner) {
      if (remoteData.winner === state.name)
        setWins({ ...wins, me: wins.me + 1 });
      else setWins({ ...wins, other: wins.other + 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteData?.winner, state.name]);

  useEffect(() => {
    if (remoteData?.winner)
      setTimeout(
        () =>
          alert(
            `${
              remoteData.winner === state.name
                ? "You are doing good. Keep up the game, champ!"
                : "You lost. Try better next time!"
            }`
          ),
        1000
      );

    if (remoteData?.draw) {
      setTimeout(() => {
        alert("It is a draw! You gave oponent a tough time!");
      }, 1000);
    }
  }, [remoteData?.draw, remoteData?.winner, state.name]);

  const mark = async (index) => {
    if (remoteData._turn !== state.name) {
      return;
    }

    const { PLAYER_ONE, PLAYER_TWO } = remoteData;

    let game = new GameBoard(PLAYER_ONE, PLAYER_TWO);
    game.board = remoteData.board;
    game._turn = remoteData._turn;
    game.winner = remoteData.winner ? remoteData.winner : null;

    game.mark(index);

    const data = JSON.parse(JSON.stringify(game));
    try {
      await sendData(roomID, data);
    } catch (error) {
      console.log(error);
    }
  };

  const restart = async () => {
    const data = {
      ...remoteData,
      board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      winner: null,
      draw: false,
    };

    try {
      await sendData(roomID, data);
    } catch (error) {
      console.log(error);
    }
  };

  const leave = async () => {
    try {
      await leaveRoom(roomID, state.name);
      props.navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

  const copyRoomID = () => {
    Clipboard.setString("" + roomID);
  };

  const onTilePress = (row, col) => {
    let val = 3 * row + col;
    mark(val + 1);
  };

  const renderIconByState = (row, col) => {
    let val = 3 * row + col;
    const value = remoteData?.board[val];
    switch (value) {
      case "x":
        return (
          <Icon2
            name="cross"
            style={{
              color: colors[props.route.params.clr].primaryColor,
              fontSize: 65,
            }}
          />
        );
      case "o":
        return (
          <Icon2
            name="circle"
            style={{
              color: colors[props.route.params.clr].primaryColor,
              fontSize: 45,
            }}
          />
        );
      case 0:
        return <View />;
    }
  };

  const showPointsOfPlayer = (player) => {
    const player1Points = state.player1Points;
    const player2Points = state.player2Points;
    const roundCount = state.round;
    switch (player) {
      case 1:
        return <Text>{player1Points}</Text>;
      case 2:
        return <Text>{player2Points}</Text>;
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors[props.route.params.clr].backgroundColor,
      }}
    >
      <View
        style={{
          flex: 0.75,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Icon2
            name="cross"
            style={{
              color: colors[props.route.params.clr].primaryColor,
              fontSize: 45,
            }}
          />
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5 }}>
            {remoteData?.PLAYER_ONE}
          </Text>
          <Text>
            {state.name === remoteData?.PLAYER_ONE ? wins.me : wins.other}
          </Text>
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Icon2
            name="circle"
            style={{
              color: colors[props.route.params.clr].primaryColor,
              fontSize: 45,
              marginLeft: 20,
            }}
          />
          <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5 }}>
            {remoteData?.PLAYER_TWO ? remoteData?.PLAYER_TWO : "Waiting..."}
          </Text>
          <Text>
            {state.name === remoteData?.PLAYER_TWO ? wins.me : wins.other}
          </Text>
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
        {remoteData?.winner || remoteData?.draw ? (
          <Button onPress={restart} title="Restart" />
        ) : null}
        {remoteData ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {remoteData._turn &&
            !remoteData.winner &&
            !remoteData.draw &&
            remoteData.PLAYER_ONE &&
            remoteData.PLAYER_TWO ? (
              <Text>
                {remoteData._turn === state.name
                  ? "Your"
                  : `${remoteData._turn} ' s `}{" "}
                turn!
              </Text>
            ) : null}

            {remoteData.PLAYER_ONE && remoteData.PLAYER_TWO ? null : (
              <Text style={{ marginLeft: 5 }}>
                You are only one in this room. Share your room ID with someone
                to play! Your room ID is {roomID}
              </Text>
            )}
            {remoteData.PLAYER_ONE && remoteData.PLAYER_TWO ? null : (
              // <Button
              //   onPress={copyRoomID}
              //   title="Copy Room ID"
              //   color={colors[props.route.params.clr].otherColor}
              // />
              <TouchableOpacity
                style={[
                  styles.button2,
                  {
                    backgroundColor: colors[props.route.params.clr].otherColor,
                  },
                ]}
                onPress={() => {
                  copyRoomID();
                }}
              >
                <Text>Copy Room Code</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>
      <View style={{ flex: 2 }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => onTilePress(0, 0)}
            style={[styles.tile, { borderTopWidth: 0, borderLeftWidth: 0 }]}
          >
            {renderIconByState(0, 0)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTilePress(0, 1)}
            style={[styles.tile, { borderTopWidth: 0 }]}
          >
            {renderIconByState(0, 1)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTilePress(0, 2)}
            style={[styles.tile, { borderTopWidth: 0, borderRightWidth: 0 }]}
          >
            {renderIconByState(0, 2)}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => onTilePress(1, 0)}
            style={[styles.tile, { borderLeftWidth: 0 }]}
          >
            {renderIconByState(1, 0)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTilePress(1, 1)}
            style={[styles.tile, {}]}
          >
            {renderIconByState(1, 1)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTilePress(1, 2)}
            style={[styles.tile, { borderRightWidth: 0 }]}
          >
            {renderIconByState(1, 2)}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => onTilePress(2, 0)}
            style={[styles.tile, { borderBottomWidth: 0, borderLeftWidth: 0 }]}
          >
            {renderIconByState(2, 0)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTilePress(2, 1)}
            style={[styles.tile, { borderBottomWidth: 0 }]}
          >
            {renderIconByState(2, 1)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTilePress(2, 2)}
            style={[styles.tile, { borderBottomWidth: 0, borderRightWidth: 0 }]}
          >
            {renderIconByState(2, 2)}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flex: 0.5,
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            {
              marginTop: 5,
              marginLeft: 5,
              backgroundColor: colors[props.route.params.clr].otherColor,
            },
          ]}
          onPress={() => {
            leave();
          }}
        >
          <Text>Leave Room</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tile: {
    borderWidth: 1,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 150,
    height: 30,
    borderWidth: 2,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  button2: {
    width: 150,
    height: 30,
    borderWidth: 2,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
});

export default OnlineGameScreen;
