import * as React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { MaterialCommunityIcons as Icon } from "react-native-vector-icons";
import { Entypo as Icon2 } from "react-native-vector-icons";
import { colors } from "../constants/Color";

export default class multiplayerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      currentPlayer: 1,
      player1Points: 0,
      player2Points: 0,
      round: 0,
      gamePlayed: 1,
      computer: "Mr. Tic Tac",
      player: "Player",
      playerTile: "x",
      computerTile: "o",
      isSwitchable: true,
    };
  }
  componentDidMount() {
    this.initializaGame();
    this.getPlayerName();
  }

  toggleTiles() {
    let isSwitchable = this.state.isSwitchable;
    if (isSwitchable !== false) {
      let playerTile = this.state.playerTile;
      let computerTile = this.state.computerTile;
      this.setState({
        playerTile: computerTile,
        computerTile: playerTile,
      });
    } else {
      alert("You Can't toggle tiles while Playing!");
    }
  }

  getPlayerName() {
    let playerName = this.props.route.params.player;
    // let playerName = "Start";
    this.setState({ player: playerName });
  }
  initializaGame = () => {
    this.setState({
      gameState: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      currentPlayer: 1,
      round: 0,
      isSwitchable: true,
    });
  };

  newGame = () => {
    this.initializaGame();
    this.setState({
      player1Points: 0,
      player2Points: 0,
    });
  };

  //Returns 1 if player1  won, -1 if player2 won,or a 0 if no one has won
  getWinner = () => {
    const NUM_TILES = 3;
    const arr = this.state.gameState;
    let sum;
    const round = this.state.roundCount;
    // Check rows
    for (let i = 0; i < NUM_TILES; i++) {
      sum = arr[i][0] + arr[i][1] + arr[i][2];
      if (sum == 3) {
        return 1;
      } else if (sum == -3) {
        return -1;
      }
    }
    // Check columns
    for (let i = 0; i < NUM_TILES; i++) {
      sum = arr[0][i] + arr[1][i] + arr[2][i];
      if (sum == 3) {
        return 1;
      } else if (sum == -3) {
        return -1;
      }
    }
    //Check the diagonals
    sum = arr[0][0] + arr[1][1] + arr[2][2];
    if (sum == 3) {
      return 1;
    } else if (sum == -3) {
      return -1;
    }

    sum = arr[2][0] + arr[1][1] + arr[0][2];
    if (sum == 3) {
      return 1;
    } else if (sum == -3) {
      return -1;
    }

    //There are no winners
    return 0;
  };

  getRandomMove() {
    let arr = this.state.gameState;
    let poss = [];
    for (let x = 0; x < arr.length; x++) {
      for (let y = 0; y < arr.length; y++) {
        if (arr[x][y] == 0) {
          poss.push([x, y]);
        }
      }
    }
    let mov = poss[Math.floor(Math.random() * poss.length)];
    this.otherPlayerMove(mov[0], mov[1]);
  }

  checkForPos() {
    this.getRandomMove();
  }

  otherPlayerMove(row, col) {
    const value = this.state.gameState[row][col];
    if (value !== 0) {
      this.getRandomMove();
      return;
    }
    let roundCount = this.state.round;
    let gameNumber = this.state.gamePlayed;
    // Grab current player
    const currentPlayer = this.state.currentPlayer;
    let p1Points = this.state.player1Points;
    let p2Points = this.state.player2Points;
    //Set the correct tile
    const arr = this.state.gameState.slice();
    arr[row][col] = -1;
    roundCount++;
    this.setState({
      gameState: arr,
      round: roundCount,
    });
    //Switch to other player
    const nextPlayer = currentPlayer == 1 ? -1 : 1;
    this.setState({ currentPlayer: nextPlayer });

    //Get player names
    let player = this.state.player;
    let computer = this.state.computer;

    //Check for winners
    let winner = this.getWinner();
    if (winner == 1) {
      Alert.alert(
        "playerWon",
        " ",
        [
          {
            text: "playAgain",
          },
        ],
        { cancelable: false }
      );
      p1Points++;
      gameNumber++;
      this.setState({ player1Points: p1Points, gamePlayed: gameNumber });
      this.initializaGame();
    } else if (winner == -1) {
      Alert.alert(
        computer + " " + "won",
        "",
        [
          {
            text: "playAgain",
          },
        ],
        { cancelable: false }
      );
      p2Points++;
      gameNumber++;
      this.setState({ player2Points: p2Points, gamePlayed: gameNumber });
      this.initializaGame();
    } else if (roundCount == 5) {
      Alert.alert(
        "draw",
        "",
        [
          {
            text: "playAgain",
          },
        ],
        { cancelable: false }
      );
      gameNumber++;
      this.setState({ gamePlayed: gameNumber });
      this.initializaGame();
    }
  }

  onTilePress = (row, col) => {
    //Don't allow tiles to change..
    const value = this.state.gameState[row][col];
    if (value !== 0) {
      return;
    }

    let roundCount = this.state.round;

    // Grab current player
    const currentPlayer = this.state.currentPlayer;
    let p1Points = this.state.player1Points;
    let p2Points = this.state.player2Points;

    //Set the correct tile
    const arr = this.state.gameState.slice();
    arr[row][col] = 1;
    roundCount++;
    this.setState({
      gameState: arr,
      round: roundCount,
      isSwitchable: false,
    });

    //Switch to other player
    const nextPlayer = currentPlayer == 1 ? -1 : 1;
    this.setState({ currentPlayer: nextPlayer });

    //Get player names
    let player = this.state.player;
    let computer = this.state.computer;

    //Check for winners
    let gameNumber = this.state.gamePlayed;
    let winner = this.getWinner();
    if (winner == 1) {
      Alert.alert(
        "You Won",
        " ",
        [
          {
            text: "playAgain",
          },
        ],
        { cancelable: false }
      );
      p1Points++;
      gameNumber++;
      this.setState({ player1Points: p1Points, gamePlayed: gameNumber });
      this.initializaGame();
    } else if (winner == -1) {
      Alert.alert(
        "You Lost",
        " ",
        [
          {
            text: "playAgain",
          },
        ],
        { cancelable: false }
      );
      p2Points++;
      gameNumber++;
      this.setState({ player2Points: p2Points, gamePlayed: gameNumber });
      this.initializaGame();
    } else if (roundCount == 5) {
      Alert.alert(
        "Draw",
        " ",
        [
          {
            text: "playAgain",
          },
        ],
        { cancelable: false }
      );
      gameNumber++;
      this.setState({ gamePlayed: gameNumber });
      this.initializaGame();
    } else {
      this.checkForPos();
    }
  };

  renderIconByState = (row, col) => {
    const value = this.state.gameState[row][col];
    switch (value) {
      case 1:
        return (
          <Icon2
            name="cross"
            style={{
              color: colors[this.props.route.params.clr].primaryColor,
              fontSize: 65,
            }}
          />
        );
      case -1:
        return (
          <Icon2
            name="circle"
            style={{
              color: colors[this.props.route.params.clr].primaryColor,
              fontSize: 45,
            }}
          />
        );
      case 0:
        return <View />;
    }
  };

  showPointsOfPlayer = (player) => {
    const player1Points = this.state.player1Points;
    const player2Points = this.state.player2Points;
    switch (player) {
      case 1:
        return <Text>{player1Points}</Text>;
      case 2:
        return <Text style={{ marginLeft: 20 }}>{player2Points}</Text>;
    }
  };

  render() {
    return (
      <View
        style={{
          ...styles.container,
          backgroundColor: colors[this.props.route.params.clr].backgroundColor,
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
                color: colors[this.props.route.params.clr].primaryColor,
                fontSize: 45,
              }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5 }}>
              {this.state.player}
            </Text>
            <View>{this.showPointsOfPlayer(1)}</View>
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TouchableOpacity onPress={() => this.toggleTiles()}>
              <Icon
                name="swap-horizontal"
                style={{ fontSize: 35, marginLeft: 15 }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Icon2
              name="circle"
              style={{
                color: colors[this.props.route.params.clr].primaryColor,
                fontSize: 25,
                marginLeft: 20,
              }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 5,
                marginLeft: 20,
              }}
            >
              {this.state.computer}
            </Text>
            <View>{this.showPointsOfPlayer(2)}</View>
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => this.onTilePress(0, 0)}
              style={[styles.tile, { borderTopWidth: 0, borderLeftWidth: 0 }]}
            >
              {this.renderIconByState(0, 0)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onTilePress(0, 1)}
              style={[styles.tile, { borderTopWidth: 0 }]}
            >
              {this.renderIconByState(0, 1)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onTilePress(0, 2)}
              style={[styles.tile, { borderTopWidth: 0, borderRightWidth: 0 }]}
            >
              {this.renderIconByState(0, 2)}
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => this.onTilePress(1, 0)}
              style={[styles.tile, { borderLeftWidth: 0 }]}
            >
              {this.renderIconByState(1, 0)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onTilePress(1, 1)}
              style={[styles.tile, {}]}
            >
              {this.renderIconByState(1, 1)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onTilePress(1, 2)}
              style={[styles.tile, { borderRightWidth: 0 }]}
            >
              {this.renderIconByState(1, 2)}
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => this.onTilePress(2, 0)}
              style={[
                styles.tile,
                { borderBottomWidth: 0, borderLeftWidth: 0 },
              ]}
            >
              {this.renderIconByState(2, 0)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onTilePress(2, 1)}
              style={[styles.tile, { borderBottomWidth: 0 }]}
            >
              {this.renderIconByState(2, 1)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onTilePress(2, 2)}
              style={[
                styles.tile,
                { borderBottomWidth: 0, borderRightWidth: 0 },
              ]}
            >
              {this.renderIconByState(2, 2)}
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
                marginLeft: 5,
                backgroundColor: colors[this.props.route.params.clr].otherColor,
              },
            ]}
            onPress={() => {
              this.newGame();
            }}
          >
            <Icon
              name="restore"
              style={{
                color: colors[this.props.route.params.clr].primaryColor,
                fontSize: 30,
              }}
            />
            <Text>Reset Game</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Build with Expo
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E1F5FE",
  },
  tile: {
    borderWidth: 1,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 180,
    backgroundColor: "#FAFAFA",
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
