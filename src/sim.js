export const startState = {
  board: [
    [ // black
      0, // empty spot
      2, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 5,
      0, 0, 0, 0, 3, 0,
      5, 0, 0, 0, 0, 0
    ],
    [ // white
      0, // empty spot 
      0, 0, 0, 0, 0, 5,
      0, 3, 0, 0, 0, 0,
      5, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 2
    ],
  ],
  inGame: [15, 15], // [black, white]
  out: [0, 0], // [black, white]
  allInHouse: [false, false], // [black, white]
};

function movePiece(state, from, step, color) {
  const forbidden = {};
  for (let i = 1; i < state.board[1 - color].length; i++) {
    const cnt = state.board[1 - color][i];

    if (cnt > 1) {
      forbidden[i] = true;
    }
  }

  let to;
  if (from === 0 || from === 25) {
    to = color ? step : 25 - step;
  } else {
    to = color ? from - step : from + step;
  }

  const newState = {
    board: [[...state.board[0]], [...state.board[1]]],
    out: [...state.out],
    inGame: [...state.inGame],
    allInHouse: [...state.allInHouse],
  };

  const my = newState.board[color];
  const op = newState.board[1 - color];

  if (from === 0 || from === 25) {
    if (newState.out[color] <= 0) {
      return [state, false];
    }
    newState.out[color] -= 1;
  } else {
    if (my[from] <= 0) {
      return [state, false];
    }
    my[from] -= 1;
  }

  if (to < 1 || to > 24) {
    if (!newState.allInHouse[color]) {
      return [state, false];
    }
    newState.inGame[color] -= 1;
  } else {
    if (op[to] > 1) {
      return [state, false]
    }

    if (op[to] === 1) {
      newState.out[1 - color] += 1;
      op[to] = 0;
    }

    my[to] += 1;
  }

  newState.allInHouse[color] = newState.out[color] === 0 && newState.board[color]
    .slice(color ? 1 : 19, color ? 7 : 25)
    .reduce((acc, val) => acc + val, 0) === 0;
  newState.allInHouse[1 - color] = newState.out[1 - color] === 0 && newState.allInHouse[1 - color];

  return [newState, true];
}

function* move(
  state,
  color,
  diceArr // [dice1, dice2] or [dice, dice, dice, dice]
) {
  if (state.inGame[color] === 0 || state.inGame[1 - color] === 0) {
    // game over
    return state;
  }

  const partialOut = state.out[color] === 1;
  const allOut = state.out[color] >= diceArr.length;

  if (allOut) {
    let nextState = state;
    let ok = true;
    for (let i = 0; i < diceArr.length; i++) {
      [nextState, ok] = movePiece(nextState, 0, diceArr[i], color);

      if (!ok) {
        return nextState;
      }
    }

    return nextState;
  }

  if (diceArr.length === 2) {
    if (partialOut) {
      for (let i = 0; i < 2; i++) {
        const [midState, ok] = movePiece(state, 0, diceArr[i], color);

        if (!ok) {
          continue;
        }

        for (let j = 0; j < 2; j++) {
          if (i === j) {
            continue;
          }

          for (let k = 1; k < state.board[color].length; k++) {
            const [finalState, ok] = movePiece(midState, k, diceArr[j], color);

            if (ok) {
              yield finalState;
            }
          }
        }
      }
    } else {
      for (let i = 1; i < state.board[color].length; i++) {
        let [nextState, ok] = movePiece(state, i, diceArr[0], color);

        if (ok) {
          for (let j = 1; j < state.board[color].length; j++) {
            const [finalState, ok] = movePiece(nextState, j, diceArr[1], color);

            if (ok) {
              yield finalState;
            }
          }
        }

        [nextState, ok] = movePiece(state, i, diceArr[1], color);

        if (ok) {
          for (let j = 1; j < state.board[color].length; j++) {
            const [finalState, ok] = movePiece(nextState, j, diceArr[0], color);

            if (ok) {
              yield finalState;
            }
          }
        }
      }
    }
  } else {
    if (partialOut && state.board[1 - color][diceArr[0]] > 1) {
      return;
    }

    let nextState = state, ok = true;
    for (let i = 0; i < state.out[color].length; i++) {
      [nextState, ok] = movePiece(nextState, 0, diceArr[0], color);
    }

    const limit = 4 - state.out[color];

    if (limit === 0) {
      return nextState;
    }

    for (let i = 1; i < state.board[color].length; i++) {
      const [state1, ok] = movePiece(nextState, i, diceArr[0], color);

      if (!ok) {
        continue;
      }

      if (limit === 1) {
        yield state1;
        continue;
      }

      for (let j = 1; j < state.board[color].length; j++) {
        const [state2, ok] = movePiece(state1, j, diceArr[1], color);

        if (!ok) {
          continue;
        }

        if (limit === 2) {
          yield state2;
          continue;
        }

        for (let k = 1; k < state.board[color].length; k++) {
          const [state3, ok] = movePiece(state2, k, diceArr[2], color);

          if (!ok) {
            continue;
          }

          if (limit === 3) {
            yield state3;
            continue;
          }

          for (let l = 1; l < state.board[color].length; l++) {
            const [state4, ok] = movePiece(state3, l, diceArr[3], color);

            if (ok) {
              yield state4;
            }
          }
        }
      }
    }
  }
}

export const playDice = (states, color, dice) => {
  const map = {};
  for (const state of states) {
    for (const val of move(state, color, dice[0] == dice[1] ? dice.concat(dice) : dice)) {
      const key = JSON.stringify(val);

      if (!map[key]) {
        map[key] = val;
      }
    }
  }

  return Object.values(map);
}

export function stateScore(state, q) {
  return {
    b: blackScore(state, q),
    w: whiteScore(state, q),
  };
}

export function whiteScore(state, q) {
  if (state.inGame[1] === 0) {
    return 0;
  }

  let score = (q + 3) * state.out[1];

  return state.board[1].reduce((acc, val, idx) => {
    return acc + val * idx * (val === 1 ? q + 1 : q)
  }, score);
}

export function blackScore(state, q) {
  if (state.inGame[0] === 0) {
    return 0;
  }

  let score = (q + 3) * state.out[0];

  return state.board[0].reduce((acc, val, idx) => {
    return acc + val * (25 - idx) * (val === 1 ? q + 1 : q)
  }, score);
}

export function calcStats(scores) {
  return scores.reduce((acc, score) => {
    if (score.b < score.w) {
      acc[0]++;
    } else if (score.b > score.w) {
      acc[1]++;
    } else {
      acc[2]++;
    }

    return acc;
  }, [0, 0, 0]); // [black, white, draw]
}

export function calcWins(scores) {
  return scores.reduce((acc, state) => {
    if (state.b === 0) {
      acc[0]++;
    }

    if (state.w === 0) {
      acc[1]++;
    }

    return acc;
  }, [0, 0]);
}