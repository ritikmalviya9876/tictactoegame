import React from "react";
import { View, Text, Button } from "react-native";
import { useEffect, useContext, useState } from "react";
import { GameBoard } from "../functions/game";
import { database } from "../.firebase/index";
import { leaveRoom, sendData } from "../functions/index";
const OnlineGameScreen = (props) => {
  console.log(props);
  console.log(props.route.params.roomId);
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
    console.log("marku ");
    console.log(remoteData);
    if (remoteData._turn !== state.name) {
      console.log("It is not your turn");
      return;
    }

    const { PLAYER_ONE, PLAYER_TWO } = remoteData;

    let game = new GameBoard(PLAYER_ONE, PLAYER_TWO);
    game.board = remoteData.board;
    game._turn = remoteData._turn;
    game.winner = remoteData.winner ? remoteData.winner : null;

    game.mark(index);

    const data = JSON.parse(JSON.stringify(game));
    console.log(data);
    try {
      await sendData(roomID, data);
    } catch (error) {
      console.log(error);
    }
  };

  const restart = async () => {
    console.log("Restra");
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
    navigator.clipboard
      .writeText(roomID)
      .then((res) => alert("ID copied!"))
      .catch((e) => alert("Could not copy ID. Please copy it manually"));
  };

  return (
    <View>
      <View>
        <Button onPress={leave} title="Leave" />

        {remoteData?.winner || remoteData?.draw ? (
          <Button onPress={restart} title="Restart" />
        ) : null}

        <View>
          <View>
            <Text>{remoteData?.PLAYER_ONE}</Text>
            <View>
              {state.name === remoteData?.PLAYER_ONE ? wins.me : wins.other}
            </View>
          </View>
          <View className="game__players--box">
            <Text>
              {remoteData?.PLAYER_TWO ? remoteData?.PLAYER_TWO : "Waiting..."}
            </Text>
            <View>
              {state.name === remoteData?.PLAYER_TWO ? wins.me : wins.other}
            </View>
          </View>
        </View>

        {remoteData ? (
          <View>
            {remoteData._turn &&
            !remoteData.winner &&
            !remoteData.draw &&
            remoteData.PLAYER_ONE &&
            remoteData.PLAYER_TWO ? (
              <Text>
                {remoteData._turn === state.name
                  ? "Your"
                  : `${remoteData._turn}'s`}{" "}
                turn!
              </Text>
            ) : null}

            {/* Statement for winner */}
            {remoteData.winner ? (
              <Text>
                {remoteData.winner === state.name ? "You won!" : "You lost!"}
              </Text>
            ) : null}

            {/* Statement for draw */}
            {remoteData.draw ? <Text>It's a draw!</Text> : null}

            {/* Statement for room ID */}
            {remoteData.PLAYER_ONE && remoteData.PLAYER_TWO ? null : (
              <>
                <View>
                  <Text>
                    You are only one in this room. Share your room ID with
                    someone to play! Your room ID is {roomID}
                  </Text>
                </View>
                <Button onPress={copyRoomID} title="Copy Room ID" />
              </>
            )}
          </View>
        ) : null}

        <View className="game__board">
          {remoteData?.board.map((e, index) => (
            <View key={index} onClick={() => mark(index + 1)}>
              <Text>{index}</Text>
              <Text>{e}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default OnlineGameScreen;
