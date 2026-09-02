# Tic Tac Toe

A simple, local two-player Tic Tac Toe game built with vanilla HTML, CSS, and JavaScript. Two players take turns clicking cells on a 3×3 grid on the same screen — no bot, no backend, just a lightweight browser game.

## Features

- **3×3 clickable grid** – 9 buttons laid out with CSS flexbox.
- **Two-player, same-device play** – players alternate turns; the game automatically switches between `0` and `X` after each move (X plays first).
- **Win detection** – checks all 8 possible winning lines (3 rows, 3 columns, 2 diagonals) after every move.
- **Draw detection** – if all 9 cells are filled with no winner, the game announces a draw.
- **Win/draw overlay** – a message box appears announcing the winner (or a draw) and disables the board.
- **Reset / New Game controls** – a "Reset Game!" button and a "New Game" button (shown on the overlay) both clear the board and let you start over.

## How to Play

1. Open `index.html` in a browser.
2. Player 1 clicks a cell to place `0`.
3. Player 2 clicks a cell to place `X`.
4. Turns keep alternating until either:
   - a player lines up 3 of their symbol in a row, column, or diagonal (win), or
   - all 9 cells are filled with no winner (draw).
5. Click **Reset Game!** or **New Game** to start again.

## Project Structure

```
.
├── index.html   # Page structure — the 3×3 button grid, win/draw message box, reset/new game buttons
├── style.css    # Styling — dark purple background, yellow grid buttons, red action buttons
└── script.js    # Game logic — turn switching, win checking, draw checking, reset handling
```

## How It Works

- `script.js` keeps a `turn0` boolean to track whose turn it is, toggling between `0` and `X` on every click.
- Each click writes the current symbol into the button's text and disables that button so it can't be clicked again.
- After every move, `checkWinner()` loops through 8 hardcoded winning patterns (index combinations on the 3×3 grid) and compares the three cells in each pattern.
- If all 9 cells are filled (`count === 9`) and no winner was found, the game reports a draw.
- Resetting re-enables every button, clears their text, hides the message box, and resets the turn counter.

## Technologies Used

- HTML5
- CSS3 (flexbox layout, hover effects)
- Vanilla JavaScript (DOM manipulation, no frameworks or libraries)

## Running Locally

No build step or dependencies required — just clone the repo and open `index.html` in any browser:

```bash
git clone https://github.com/simplysaadali/Tic-Tac-Toe.git
cd Tic-Tac-Toe
open index.html   # or double-click the file
```

## Possible Improvements

- Score tracking across rounds
- A single-player mode against a bot (e.g. minimax)
- Highlighting the winning line
- Sound effects / animations

## License

No license file is currently included in this repository.
