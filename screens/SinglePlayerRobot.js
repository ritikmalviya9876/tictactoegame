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
      computer: "Computer",
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
    let r = Math.floor(Math.random() * 2) + 1;
    let c = Math.floor(Math.random() * 2) + 1;
    let arr = this.state.gameState;
    if (arr[r][c] == 0) {
      this.otherPlayerMove(r, c);
    } else {
      this.getRandomMove();
    }
  }

  isMovesLeft(board) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) if (board[i][j] == 0) return true;
    return false;
  }

  evaluate(b) {
    for (let row = 0; row < 3; row++) {
      if (b[row][0] == b[row][1] && b[row][1] == b[row][2]) {
        if (b[row][0] == -1) return +10;
        else if (b[row][0] == 1) return -10;
      }
    }

    for (let col = 0; col < 3; col++) {
      if (b[0][col] == b[1][col] && b[1][col] == b[2][col]) {
        if (b[0][col] == -1) return +10;
        else if (b[0][col] == 1) return -10;
      }
    }
    if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
      if (b[0][0] == -1) return +10;
      else if (b[0][0] == 1) return -10;
    }

    if (b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
      if (b[0][2] == -1) return +10;
      else if (b[0][2] == 1) return -10;
    }

    return 0;
  }

  minimax(board, depth, isMax) {
    let score = this.evaluate(board);
    if (score == 10) return score;
    if (score == -10) return score;
    if (this.isMovesLeft(board) == false) return 0;

    if (isMax) {
      let best = -1000;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == 0) {
            board[i][j] = -1;
            best = Math.max(best, this.minimax(board, depth + 1, !isMax));
            board[i][j] = 0;
          }
        }
      }
      return best;
    } else {
      let best = 1000;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == 0) {
            board[i][j] = 1;

            best = Math.min(best, this.minimax(board, depth + 1, !isMax));
            board[i][j] = 0;
          }
        }
      }
      return best;
    }
  }

  findBestMove(board) {
    let bestVal = -1000;
    let bestMove = {};
    bestMove.row = -1;
    bestMove.col = -1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === 0) {
          board[i][j] = -1;
          let moveVal = this.minimax(board, 0, false);
          board[i][j] = 0;
          if (moveVal > bestVal) {
            bestMove.row = i;
            bestMove.col = j;
            bestVal = moveVal;
          }
        }
      }
    }
    return bestMove;
  }

  checkForFinishInOneMove() {
    let Positions = new Object();
    const arr = this.state.gameState;
    let sum = 0;
    sum = arr[0][0] + arr[0][1] + arr[0][2];
    if (sum == -2) {
      for (let i = 0; i < 3; i++) {
        if (arr[0][i] == 0) {
          Positions[0] = 1;
          Positions[1] = 0;
          Positions[2] = i;
          return Positions;
        }
      }
    }
    sum = arr[1][0] + arr[1][1] + arr[1][2];
    if (sum == -2) {
      for (let i = 0; i < 3; i++) {
        if (arr[1][i] == 0) {
          Positions[0] = 1;
          Positions[1] = 1;
          Positions[2] = i;
          return Positions;
        }
      }
    }
    sum = arr[2][0] + arr[2][1] + arr[2][2];
    if (sum == -2) {
      for (let i = 0; i < 3; i++) {
        if (arr[2][i] == 0) {
          Positions[0] = 1;
          Positions[1] = 2;
          Positions[2] = i;
          return Positions;
        }
      }
    }
    sum = arr[0][0] + arr[1][0] + arr[2][0];
    if (sum == -2) {
      for (let i = 0; i < 3; i++) {
        if (arr[i][0] == 0) {
          Positions[0] = 1;
          Positions[1] = i;
          Positions[2] = 0;
          return Positions;
        }
      }
    }
    sum = arr[0][1] + arr[1][1] + arr[2][1];
    if (sum == -2) {
      if (arr[0][1] == 0) {
        Positions[0] = 1;
        Positions[1] = 0;
        Positions[2] = 1;
        return Positions;
      } else if (arr[1][1] == 0) {
        Positions[0] = 1;
        Positions[1] = 1;
        Positions[2] = 1;
        return Positions;
      } else {
        Positions[0] = 1;
        Positions[1] = 2;
        Positions[2] = 1;
        return Positions;
      }
    }
    sum = arr[0][2] + arr[1][2] + arr[2][2];
    if (sum == -2) {
      for (let i = 0; i < 3; i++) {
        if (arr[i][2] == 0) {
          Positions[0] = 1;
          Positions[1] = i;
          Positions[2] = 2;
          return Positions;
        }
      }
    }
    sum = arr[0][0] + arr[1][1] + arr[2][2];
    if (sum == -2) {
      for (let i = 0; i < 3; i++) {
        if (arr[i][i] == 0) {
          Positions[0] = 1;
          Positions[1] = i;
          Positions[2] = i;
          return Positions;
        }
      }
    }
    sum = arr[0][2] + arr[1][1] + arr[2][0];
    if (sum == -2) {
      if (arr[0][2] == 0) {
        Positions[0] = 1;
        Positions[1] = 0;
        Positions[2] = 2;
        return Positions;
      } else if (arr[1][1] == 0) {
        Positions[0] = 1;
        Positions[1] = 0;
        Positions[2] = 1;
        return Positions;
      } else {
        Positions[0] = 1;
        Positions[1] = 2;
        Positions[2] = 0;
        return Positions;
      }
    } else {
      Positions[0] = 0;
      return Positions;
    }
  }
  checkForBlockingOther() {
    let Positions = new Object();
    const arr = this.state.gameState;
    let sum = 0;
    sum = arr[0][0] + arr[0][1] + arr[0][2];
    if (sum == 2) {
      for (let i = 0; i < 3; i++) {
        if (arr[0][i] == 0) {
          Positions[0] = 1;
          Positions[1] = 0;
          Positions[2] = i;
          return Positions;
        }
      }
    }
    sum = arr[1][0] + arr[1][1] + arr[1][2];
    if (sum == 2) {
      for (let i = 0; i < 3; i++) {
        if (arr[1][i] == 0) {
          Positions[0] = 1;
          Positions[1] = 1;
          Positions[2] = i;
          return Positions;
        }
      }
    }
    sum = arr[2][0] + arr[2][1] + arr[2][2];
    if (sum == 2) {
      for (let i = 0; i < 3; i++) {
        if (arr[2][i] == 0) {
          Positions[0] = 1;
          Positions[1] = 2;
          Positions[2] = i;
          return Positions;
        }
      }
    }
    sum = arr[0][0] + arr[1][0] + arr[2][0];
    if (sum == 2) {
      for (let i = 0; i < 3; i++) {
        if (arr[i][0] == 0) {
          Positions[0] = 1;
          Positions[1] = i;
          Positions[2] = 0;
          return Positions;
        }
      }
    }
    sum = arr[0][1] + arr[1][1] + arr[2][1];
    if (sum == 2) {
      if (arr[0][1] == 0) {
        Positions[0] = 1;
        Positions[1] = 0;
        Positions[2] = 1;
        return Positions;
      } else if (arr[1][1] == 0) {
        Positions[0] = 1;
        Positions[1] = 1;
        Positions[2] = 1;
        return Positions;
      } else {
        Positions[0] = 1;
        Positions[1] = 2;
        Positions[2] = 1;
        return Positions;
      }
    }
    sum = arr[0][2] + arr[1][2] + arr[2][2];
    if (sum == 2) {
      for (let i = 0; i < 3; i++) {
        if (arr[i][2] == 0) {
          Positions[0] = 1;
          Positions[1] = i;
          Positions[2] = 2;
          return Positions;
        }
      }
    }
    sum = arr[0][0] + arr[1][1] + arr[2][2];
    if (sum == 2) {
      for (let i = 0; i < 3; i++) {
        if (arr[i][i] == 0) {
          Positions[0] = 1;
          Positions[1] = i;
          Positions[2] = i;
          return Positions;
        }
      }
    }
    sum = arr[0][2] + arr[1][1] + arr[2][0];
    if (sum == 2) {
      if (arr[0][2] == 0) {
        Positions[0] = 1;
        Positions[1] = 0;
        Positions[2] = 2;
        return Positions;
      } else if (arr[1][1] == 0) {
        Positions[0] = 1;
        Positions[1] = 0;
        Positions[2] = 1;
        return Positions;
      } else {
        Positions[0] = 1;
        Positions[1] = 2;
        Positions[2] = 0;
        return Positions;
      }
    } else {
      Positions[0] = 0;
      Positions[1] = 5;
      Positions[2] = 6;
      return Positions;
    }
  }
  checkForPos() {
    // let Positions = this.checkForFinishInOneMove();
    // if (Positions[0] == 1) {
    //   this.otherPlayerMove(Positions[1], Positions[2]);
    // } else {
    //   let Positions = this.checkForBlockingOther();
    //   if (Positions[0] == 1) {
    //     this.otherPlayerMove(Positions[1], Positions[2]);
    //   } else {
    //     this.getRandomMove();
    //   }
    // }
    let bestMove = this.findBestMove(this.state.gameState);
    this.otherPlayerMove(bestMove.row, bestMove.col);
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
        // return <Emoji name={this.state.playerTile} style={{ fontSize: 45 }} />;
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
