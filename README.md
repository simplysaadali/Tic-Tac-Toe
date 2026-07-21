# Tic Tac Toe · vs Unbeatable Bot

A modern, visually polished Tic Tac Toe game where you face an unbeatable AI opponent powered by the Minimax algorithm. The game features a clean UI with SVG icons, real-time scoring, and smooth animations.


## Why This Game?

This project was created to demonstrate:

1.  **Unbeatable AI** – The bot uses the Minimax algorithm to make optimal moves, ensuring it never loses. This provides a challenging experience for players who want to test their skills against a perfect opponent.

2.  **Clean Visual Design** – Instead of using emojis or text characters, the game uses SVG icons for the 'X' and 'O' symbols. This gives the game a professional, scalable, and crisp appearance on any screen size.

3.  **Smooth User Experience** – The game includes subtle animations, hover effects, and a polished overlay for game-over states, making the experience feel responsive and engaging.

4.  **Educational Value** – The Minimax implementation serves as a great example of how game AI works, making this project useful for learning about recursive algorithms and decision trees.


## Features

### Unbeatable Bot
- The bot uses the Minimax algorithm with depth evaluation.
- It always makes the optimal move – either blocking your win or creating its own.
- You can never win – the best outcome is a draw.

### Modern UI
- SVG-based X and O icons – no emojis or text characters.
- Gradient backgrounds and glassmorphism effects.
- Smooth animations on moves and game-over overlay.
- Responsive design – works on both desktop and mobile devices.

### Score Tracking
- Keeps track of wins for both You (X) and Bot (O).
- Scores persist across multiple games until you reset.

### Game Controls
- Reset Game – clears the board and resets scores.
- New Game – starts a fresh match without resetting scores.

### Turn Indicator
- Shows whose turn it is with a dynamic SVG icon.
- Clear visual feedback for the current player.

### Game Over Overlay
- Displays the winner (You, Bot, or Draw) with an animated pop-up.
- Includes a "New Game" button for quick restart.



## How to Play

1.  Start the game – You are always X and go first.
2.  Click any empty cell to place your 'X'.
3.  Watch the bot – After a short delay, the bot (O) will make its move.
4.  Continue playing until someone wins or the board fills (draw).
5.  Use the buttons:
    - Reset Game – starts a completely new game and resets scores.
    - New Game (on overlay) – starts a new round without resetting scores.


## How the Bot Works (Minimax Algorithm)

The bot uses the Minimax algorithm with depth scoring to evaluate every possible move:

- Maximizing player – Bot (O) tries to maximize its score.
- Minimizing player – You (X) tries to minimize the bot's score.
- Scoring:
  - +10 - depth – Bot wins.
  - -10 + depth – You wins.
  - 0 – Draw.
- The bot recursively explores all possible game states and chooses the move with the highest score.

This ensures the bot never loses – it will either win or force a draw.



## Technologies Used

- HTML5 – Structure of the game.
- CSS3 – Styling, animations, and responsive design.
- JavaScript (ES6) – Game logic, Minimax algorithm, and DOM manipulation.
- SVG – Vector graphics for X, O, and UI elements.

---

## Responsive Design

The game is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices

The board size adapts to different screen sizes using vmin units and media queries.

---

## Why No Friend Mode?

The game focuses entirely on single-player vs AI to showcase the power of the Minimax algorithm. Removing the friend mode keeps the experience focused and challenging.

---

## Future Improvements

- Difficulty levels – Add easy, medium, and hard modes.
- Sound effects – Add audio feedback for moves and wins.
- Animations – Add more elaborate animations for winning lines.
- Online multiplayer – Play against friends over the internet.

---

## Credits

Designed and developed as a demonstration of game AI and modern web design principles.

---

## License

This project is open-source and available for learning and modification.

---

Enjoy the challenge!
