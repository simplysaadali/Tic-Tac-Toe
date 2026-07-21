(function() {
    "use strict";

    const startPage = document.getElementById('startPage');
    const modeBot = document.getElementById('modeBot');
    const winOverlay = document.getElementById('winOverlay');
    const winMsg = document.getElementById('winMsg');
    const winNewBtn = document.getElementById('winNewBtn');
    const resetBtn = document.getElementById('resetBtn');
    const board = document.getElementById('board');
    const winLineSvg = document.getElementById('winLineSvg');
    const turnIndicator = document.getElementById('turnIndicator');
    const turnDisplay = document.getElementById('turnDisplay');
    const turnSvg = document.getElementById('turnSvg');
    const scoreXEl = document.getElementById('scoreX');
    const scoreOEl = document.getElementById('scoreO');
    const historyList = document.getElementById('historyList');
    const historyEmpty = document.getElementById('historyEmpty');

    // ----- mark templates (drawn with stroke animation) -----
    function xMarkSvg() {
        return `<svg viewBox="0 0 24 24" class="mark-svg">
                <line class="mark-path" pathLength="1" x1="18" y1="6" x2="6" y2="18"/>
                <line class="mark-path mark-path-2" pathLength="1" x1="6" y1="6" x2="18" y2="18"/>
            </svg>`;
    }

    function oMarkSvg() {
        return `<svg viewBox="0 0 24 24" class="mark-svg">
                <circle class="mark-path" pathLength="1" cx="12" cy="12" r="9"/>
            </svg>`;
    }
    const xIconStatic = `<svg viewBox="0 0 24 24" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    const oIconStatic = `<svg viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9"/></svg>`;
    const drawIconStatic = `<svg viewBox="0 0 24 24" stroke="#f2dc5d"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>`;

    // ----- state -----
    let boardState = Array(9).fill(null);
    let turn = 'X';
    let gameActive = false;
    let mode = 'bot';
    let scoreX = 0,
        scoreO = 0;
    let botTimeout = null;
    let botThinking = false;
    let history = [];
    let gameNumber = 0;

    // ----- win patterns -----
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // ----- render board -----
    function renderBoard() {
        board.innerHTML = '';
        winLineSvg.innerHTML = '';
        boardState.forEach((val, idx) => {
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.dataset.index = idx;
            cell.disabled = !!val;
            if (val) {
                cell.innerHTML = val === 'X' ? xMarkSvg() : oMarkSvg();
                cell.dataset.symbol = val;
            }
            cell.addEventListener('click', () => handleCellClick(idx));
            board.appendChild(cell);
            setTimeout(() => {
                cell.classList.add('cell-show');
                if (val) revealMark(cell);
            }, idx * 35);
        });
        updateTurnDisplay();
    }

    function revealMark(cell) {
        const svg = cell.querySelector('.mark-svg');
        if (svg) svg.classList.add('show');
        cell.querySelectorAll('.mark-path').forEach(p => p.classList.add('drawn'));
    }

    function updateTurnDisplay(thinking) {
        turnSvg.innerHTML = turn === 'X' ?
            `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>` :
            `<circle cx="12" cy="12" r="9"/>`;
        turnSvg.style.stroke = turn === 'X' ? '#f5b45a' : '#7fc9f5';

        const label = turn === 'X' ? 'Your turn' : (thinking ? 'Opponent is thinking' : "Opponent's turn");
        turnDisplay.textContent = label;
        turnDisplay.classList.toggle('thinking', !!thinking);
        turnIndicator.classList.toggle('pulse', !!thinking);
    }

    function bumpScore(el) {
        el.classList.remove('bump');
        void el.offsetWidth;
        el.classList.add('bump');
    }

    // ----- match history -----
    function logHistory(winner) {
        gameNumber++;
        const movesTaken = boardState.filter(v => v !== null).length;
        let kind, resultText, icon;
        if (winner === 'X') {
            kind = 'win';
            resultText = 'You won';
            icon = `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        } else if (winner === 'O') {
            kind = 'lose';
            resultText = 'Opponent won';
            icon = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>`;
        } else {
            kind = 'draw';
            resultText = "It's a draw";
            icon = `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`;
        }
        history.unshift({ kind, resultText, icon, movesTaken, gameNumber });
        renderHistory();
    }

    function renderHistory() {
        historyEmpty.classList.toggle('hidden', history.length > 0);
        historyList.innerHTML = '';
        history.slice(0, 25).forEach((entry, i) => {
            const li = document.createElement('li');
            li.className = `history-item ${entry.kind}`;
            li.innerHTML = `
                    <span class="h-icon">${entry.icon}</span>
                    <span class="h-text">
                        <span class="h-result">${entry.resultText}</span>
                        <span class="h-meta">Game ${entry.gameNumber} · ${entry.movesTaken} moves</span>
                    </span>
                `;
            historyList.appendChild(li);
            setTimeout(() => li.classList.add('show'), i === 0 ? 20 : 0);
        });
    }

    function updateScore() {
        scoreXEl.textContent = scoreX;
        scoreOEl.textContent = scoreO;
    }

    // ----- check win / draw (works on any board array, defaults to live board) -----
    function checkWinner(bd = boardState) {
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
                return { winner: bd[a], pattern };
            }
        }
        return null;
    }

    function isBoardFull(bd = boardState) { return bd.every(v => v !== null); }

    // ----- winning line overlay -----
    function drawWinLine(pattern, winner) {
        const cellCenter = (idx) => ({ x: (idx % 3) + 0.5, y: Math.floor(idx / 3) + 0.5 });
        const p1 = cellCenter(pattern[0]);
        const p2 = cellCenter(pattern[2]);
        const color = winner === 'X' ? '#f5b45a' : '#7fc9f5';
        winLineSvg.innerHTML = `<line class="win-line-path" pathLength="1"
                x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
                stroke="${color}" stroke-width="0.11" style="color:${color}"/>`;
        const lineEl = winLineSvg.querySelector('.win-line-path');
        requestAnimationFrame(() => requestAnimationFrame(() => lineEl.classList.add('drawn')));
    }

    // ----- end game -----
    function endGame(winner) {
        gameActive = false;
        botThinking = false;
        if (botTimeout) { clearTimeout(botTimeout);
            botTimeout = null; }
        document.querySelectorAll('.cell').forEach(c => c.disabled = true);

        let message, svgIcon;
        if (winner) {
            if (winner === 'X') { scoreX++;
                bumpScore(scoreXEl); } else { scoreO++;
                bumpScore(scoreOEl); }
            message = winner === 'X' ? 'You win' : 'Opponent wins';
            svgIcon = winner === 'X' ? xIconStatic : oIconStatic;
            document.body.classList.add(winner === 'X' ? 'flash-x' : 'flash-o');
            setTimeout(() => document.body.classList.remove('flash-x', 'flash-o'), 900);
        } else {
            message = "It's a draw";
            svgIcon = drawIconStatic;
        }
        updateScore();
        logHistory(winner);

        const result = checkWinner();
        if (result) drawWinLine(result.pattern, result.winner);

        winMsg.innerHTML = `${svgIcon}${message}`;
        setTimeout(() => winOverlay.classList.add('show'), winner ? 450 : 120);
    }

    // ----- handle cell click -----
    function handleCellClick(idx) {
        if (!gameActive || botThinking) return;
        if (boardState[idx] !== null) return;
        if (turn !== 'X') return; // human is always X

        makeMove(idx, 'X');
        if (gameActive && mode === 'bot' && turn === 'O') {
            botThinking = true;
            updateTurnDisplay(true);
            if (botTimeout) clearTimeout(botTimeout);
            botTimeout = setTimeout(botMove, 420 + Math.random() * 260);
        }
    }

    // ----- make a move -----
    function makeMove(idx, player) {
        boardState[idx] = player;
        const cell = document.querySelector(`.cell[data-index="${idx}"]`);
        if (cell) {
            cell.innerHTML = player === 'X' ? xMarkSvg() : oMarkSvg();
            cell.dataset.symbol = player;
            cell.disabled = true;
            requestAnimationFrame(() => requestAnimationFrame(() => revealMark(cell)));
        }

        const result = checkWinner();
        if (result) { endGame(result.winner); return; }
        if (isBoardFull()) { endGame(null); return; }

        turn = (player === 'X') ? 'O' : 'X';
        botThinking = false;
        updateTurnDisplay();
        gameActive = true;
    }

    // ----- bot brain (minimax: bot 'O' maximizes, human 'X' minimizes) -----
    function minimax(bd, depth, isBotTurn) {
        const result = checkWinner(bd);
        if (result) return result.winner === 'O' ? 10 - depth : depth - 10;
        if (isBoardFull(bd)) return 0;

        const empties = [];
        for (let i = 0; i < 9; i++) if (bd[i] === null) empties.push(i);

        if (isBotTurn) {
            let best = -Infinity;
            for (const i of empties) {
                bd[i] = 'O';
                best = Math.max(best, minimax(bd, depth + 1, false));
                bd[i] = null;
            }
            return best;
        } else {
            let best = Infinity;
            for (const i of empties) {
                bd[i] = 'X';
                best = Math.min(best, minimax(bd, depth + 1, true));
                bd[i] = null;
            }
            return best;
        }
    }

    function bestBotMove() {
        const empties = [];
        for (let i = 0; i < 9; i++) if (boardState[i] === null) empties.push(i);

        let bestScore = -Infinity;
        let candidates = [];
        for (const i of empties) {
            boardState[i] = 'O';
            const score = minimax(boardState, 0, false);
            boardState[i] = null;
            if (score > bestScore) { bestScore = score;
                candidates = [i]; } else if (score === bestScore) { candidates.push(i); }
        }
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // ----- bot move -----
    function botMove() {
        botTimeout = null;
        botThinking = false;
        if (!gameActive || turn !== 'O') return;
        const idx = bestBotMove();
        makeMove(idx, 'O');
    }

    // ----- reset game -----
    function resetGame() {
        if (botTimeout) { clearTimeout(botTimeout);
            botTimeout = null; }
        botThinking = false;
        boardState = Array(9).fill(null);
        turn = 'X';
        gameActive = true;
        winOverlay.classList.remove('show');
        renderBoard();
    }

    // ----- start game -----
    function startGame() {
        scoreX = 0;
        scoreO = 0;
        updateScore();
        startPage.classList.add('hide');
        resetGame();
    }

    // ----- event listeners -----
    modeBot.addEventListener('click', startGame);
    winNewBtn.addEventListener('click', resetGame);
    resetBtn.addEventListener('click', resetGame);

    // init
    renderBoard();
    document.querySelectorAll('.cell').forEach(c => c.disabled = true);
    gameActive = false;
    updateScore();
    startPage.classList.remove('hide');
})();