
import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Snackbar from 'react-native-snackbar'
import Icons from './components/Icons'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Sound from 'react-native-sound';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

const winBuzz = new Sound('win.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load the sound', error);
  }
});

const errorBuzz = new Sound('error.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load the sound', error);
  }
});


function App(): React.JSX.Element {

  const [isCross, setIsCross] = useState<boolean>(false);
  const [gameWinner, setGameWinner] = useState<string>('')
  const [gameState, setGameState] = useState(new Array(9).fill('empty', 0, 9))

  const reloadGame = () => {
    setIsCross(false)
    setGameWinner('')
    setGameState(new Array(9).fill('empty', 0, 9))
    ReactNativeHapticFeedback.trigger("impactHeavy", options);
  }

  const checkIsWinner = () => {
    //  checking  winner of the game
    if (
      gameState[0] === gameState[1] &&
      gameState[0] === gameState[2] &&
      gameState[0] !== 'empty'
    ) {
      winBuzz.play()
      setGameWinner(`${gameState[0]} won the game! 🥳`);
    } else if (
      gameState[3] !== 'empty' &&
      gameState[3] === gameState[4] &&
      gameState[4] === gameState[5]
    ) {
      winBuzz.play()
      setGameWinner(`${gameState[3]} won the game! 🥳`);
    } else if (
      gameState[6] !== 'empty' &&
      gameState[6] === gameState[7] &&
      gameState[7] === gameState[8]
    ) {
      winBuzz.play()
      setGameWinner(`${gameState[6]} won the game! 🥳`);
    } else if (
      gameState[0] !== 'empty' &&
      gameState[0] === gameState[3] &&
      gameState[3] === gameState[6]
    ) {
      winBuzz.play()
      setGameWinner(`${gameState[0]} won the game! 🥳`);
    } else if (
      gameState[1] !== 'empty' &&
      gameState[1] === gameState[4] &&
      gameState[4] === gameState[7]
    ) {
      winBuzz.play()
      setGameWinner(`${gameState[1]} won the game! 🥳`);
    } else if (
      gameState[2] !== 'empty' &&
      gameState[2] === gameState[5] &&
      gameState[5] === gameState[8]
    ) {
      winBuzz.play()
      setGameWinner(`${gameState[2]} won the game! 🥳`);
    } else if (
      gameState[0] !== 'empty' &&
      gameState[0] === gameState[4] &&
      gameState[4] === gameState[8]
    ) {
      winBuzz.play()
      setGameWinner(`${gameState[0]} won the game! 🥳`);
    } else if (
      gameState[2] !== 'empty' &&
      gameState[2] === gameState[4] &&
      gameState[4] === gameState[6]
    ) {
      winBuzz.play()
      setGameWinner(`${gameState[2]} won the game! 🥳`);
    } else if (!gameState.includes('empty', 0)) {
      errorBuzz.play()
      setGameWinner('Draw game... ⌛️');
    }
  }
  const onChangeItem = (itemNumber: number) => {
    if (gameWinner) {
      errorBuzz.play()
      return Snackbar.show({
        text: gameWinner,
        backgroundColor: "#000000",
        textColor: "#FFFFFF"
      })
    }
    if (gameState[itemNumber] === 'empty') {
      gameState[itemNumber] = isCross ? 'cross' : 'circle'
      setIsCross(!isCross)
    } else {
      errorBuzz.play()
      return Snackbar.show({
        text: "Position is already filled",
        backgroundColor: "red",
        textColor: "#FFF"
      })
    }
    ReactNativeHapticFeedback.trigger("impactHeavy", options);
    checkIsWinner()
  }

  return (
    <SafeAreaView>
      <StatusBar />
      {/* Player's Info */}
      {
        gameWinner ? (
          <View style={[styles.playerInfo, styles.winnerInfo]}>
            <Text style={styles.winnerTxt}>{gameWinner}</Text>
          </View>
        ) : (
          <View
            style={[
              styles.playerInfo,
              isCross ? styles.playerX : styles.playerO
            ]}
          >
            <Text style={styles.gameTurnTxt}>
              Player {isCross ? 'X' : 'O'}'s Turn
            </Text>
          </View>
        )
      }
      {/* Game grid? */}
      <FlatList
        numColumns={3}
        data={gameState}
        style={styles.grid}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            style={styles.card}
            onPress={() => onChangeItem(index)}
          >
            <Icons name={item} />
          </Pressable>
        )}
      />
      {/* Reload Button */}
      <Pressable
        style={styles.gameBtn}
        onPress={reloadGame}
      >
        <Text style={styles.gameBtnText}>
          {gameWinner ? 'Start new game' : 'reLoad the game'}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  playerInfo: {
    height: 56,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 4,
    paddingVertical: 8,
    marginVertical: 12,
    marginHorizontal: 14,

    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  gameTurnTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playerX: {
    backgroundColor: '#38CC77',
  },
  playerO: {
    backgroundColor: '#F7CD2E',
  },
  grid: {
    margin: 12,
  },
  card: {
    height: 100,
    width: '33.33%',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#333',
  },
  winnerInfo: {
    borderRadius: 8,
    backgroundColor: '#38CC77',

    shadowOpacity: 0.1,
  },
  winnerTxt: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  gameBtn: {
    alignItems: 'center',

    padding: 10,
    borderRadius: 8,
    marginHorizontal: 36,
    backgroundColor: '#8D3DAF',
  },
  gameBtnText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default App;
