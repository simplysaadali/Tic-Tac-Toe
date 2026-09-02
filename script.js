const btns = document.querySelectorAll(".btn");
const resetBtn = document.querySelector(".reset-btn");
const newBtn = document.querySelector(".new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");

let turn0 = true //for plaer x and player 0

let winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const disableBtns = () => {
    for(let btn of btns){
        btn.disabled = true;
    }
};

const enableBtns = () => {
    for(let btn of btns){
        btn.disabled = false;
        btn.innerText = "";
        msgContainer.classList.add("hide");
    }
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations! Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBtns();
};

const checkWinner = () => {
    for(pattern of winPatterns){
        let post1Val = btns[pattern[0]].innerText;
        let post2Val = btns[pattern[1]].innerText;
        let post3Val = btns[pattern[2]].innerText;

        if(post1Val != "" && post2Val != "" && post3Val != ""){
            if(post1Val === post2Val && post2Val === post3Val){
                console.log("winner", post1Val);
                showWinner(post1Val);
            }
        }
    }
};

let count = 0;
const checkDraw = () => {
        msg.innerText = "Draw! Start New Game";
        msgContainer.classList.remove("hide");
        disableBtns();
};
 
const resetGame = () => {
    turn0 = true;
    count = 0;
    enableBtns();
}

btns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if(turn0){
            btn.innerText = "0";
            turn0 = false;
        }else{
            btn.innerText = "X";
            turn0 = true;
        }
        btn.disabled = true;
        count++;

        let isWinner = checkWinner();
        if(count === 9 && !isWinner){
            checkDraw();
        }
    });
});

resetBtn.addEventListener("click", resetGame);
newBtn.addEventListener("click", resetGame);