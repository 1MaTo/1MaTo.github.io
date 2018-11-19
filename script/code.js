//Main Constants

var snakeBodyColor = "black";
var foodColor = "url(\"sprites/apple.svg\")";
var fieldColor = "#009933";
var portalColor = "url(\"sprites/portal.svg\")";;
var cellsCount = 26;
var isPortalActive = false;
var tailsLeft = 0;
var direction = ["right", "right"];
var portalsConnection;
var snakeSpeed = 300;
var scorePoints = 0;
var ingameTime = 0;
var timeInPortals = 0;
var gameField = new Array(String);
var foodCount = 0;
var BestScore = 0;
var windowHeight = screen.height;

//Global

var Time = document.getElementById('time');
var Score = document.getElementById('score');
addEventListener("keydown", Controls);
var cellsArr = new Array(HTMLDivElement);
var CurrentLoc = [GetRandom(4,9),GetRandom(4,9)];
var tail = [[CurrentLoc[0],CurrentLoc[1],],[CurrentLoc[0],CurrentLoc[1]-1],[CurrentLoc[0],CurrentLoc[1]-2]];
var LastLoc = [tail[2][0],tail[2][1]];
FirstInitial();
CreateFood();
var TimerKey = 0;
var SnakeTimeKey = setInterval(MovSnake,snakeSpeed);
var PortalTimeKey = setInterval(() => {
PortalEvent()
}, 12000);
TimeScore();
StabilizeWindow();


//Methods-main

function NewGame(loseWindow)
{
    loseWindow.remove();
    document.getElementById('bestscore').innerHTML = BestScore;

    TimerKey = 0;
    isPortalActive = false;
    tailsLeft = 0;
    direction = ["right", "right"];
    snakeSpeed = 300;
    scorePoints = 0;
    ingameTime = 0;
    timeInPortals = 0;
    foodCount = 0;
    CurrentLoc = [GetRandom(4,9),GetRandom(4,9)];
    tail = [[CurrentLoc[0],CurrentLoc[1],],[CurrentLoc[0],CurrentLoc[1]-1],[CurrentLoc[0],CurrentLoc[1]-2]];
    LastLoc = [tail[2][0],tail[2][1]];

    for(var i = 1; i <= cellsCount; i++)
    {
        for(var j = 1; j <= cellsCount; j++)
        {
            gameField[i][j] = "empty";
        }
    }
    gameField[CurrentLoc[0]][CurrentLoc[1]] = "snake";
    gameField[CurrentLoc[0]][CurrentLoc[1]-1] = "snake";
    gameField[CurrentLoc[0]][CurrentLoc[1]-2] = "snake";

    CreateFood();
    SnakeTimeKey = setInterval(MovSnake,snakeSpeed);
    PortalTimeKey = setInterval(() => { PortalEvent() }, 12000);
    TimeScore();
    StabilizeWindow();
}

function FirstInitial()
{
    var field = document.getElementById('field');
    for(var i = 1; i <= cellsCount; i++)
    {
        gameField[i] = Array(String);
        cellsArr[i] = new Array(HTMLDivElement);
        for(var j = 1; j <= cellsCount; j++)
        {
            var cell = document.createElement('div');
            cell.classList.add("cell",i+"_"+j);
            cellsArr[i][j] = cell;
            gameField[i][j] = "empty";
            field.appendChild(cell);
        }
    }
    gameField[CurrentLoc[0]][CurrentLoc[1]] = "snake";
    gameField[CurrentLoc[0]][CurrentLoc[1]-1] = "snake";
    gameField[CurrentLoc[0]][CurrentLoc[1]-2] = "snake";
}

function StabilizeWindow()
{
    var area = document.getElementById('field');
    var isLowHeight = windowHeight < 1080;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
    if (isLowHeight && !isMobile)
    {
        area.style.transform = 'scale(0.85,0.85)';
        area.style.marginTop = '-30px';
    }
    else if (isMobile)
    {
        area.style.margin = '100px auto 0 auto';
        area.style.transform = 'scale(1.2,1.2)';
    }
}

function CreateLoseWindow()
{
    var mainWindow = document.getElementById('mainarea');

    var loseWindow = document.createElement('div');
    loseWindow.classList.add("statistic");

    var loseLabel = document.createElement('div');
    loseLabel.classList.add("lose");
    loseLabel.innerHTML = 'You lose';

    var totalLabel = document.createElement('div');
    totalLabel.classList.add('label_total');
    totalLabel.innerHTML = 'Total score:';

    var scoreField = document.createElement('div');
    scoreField.classList.add('total');
    if (BestScore < TotalScore()) BestScore = TotalScore();
    scoreField.innerHTML = TotalScore();

    var button = document.createElement('input');
    button.type = "button";
    button.classList.add('tryAgain');
    button.onclick = function() { NewGame(loseWindow) };
    button.value = 'Try again';

    loseWindow.appendChild(loseLabel);
    loseWindow.appendChild(totalLabel);
    loseWindow.appendChild(scoreField);
    loseWindow.appendChild(button);
    mainWindow.appendChild(loseWindow);
    return loseWindow;
}

function GameEnd()
{
    clearInterval(SnakeTimeKey);
    clearInterval(PortalTimeKey);
    CreateLoseWindow();
}

function SelectCurrent()
{
    if (gameField[CurrentLoc[0]][CurrentLoc[1]] == "food"/*cellsArr[CurrentLoc[0]][CurrentLoc[1]].style.background == foodColor*/) //FoodCheck
    {
        foodCount++;
        tail.push([tail[tail.length-1][0],tail[tail.length-1][1]]);
        tailsLeft++;
        CreateFood();
        if (snakeSpeed > 100)
        {
            snakeSpeed -= 25;
            clearInterval(SnakeTimeKey);
            SnakeTimeKey = setInterval(MovSnake,snakeSpeed);
        }
    }
    else
    {
        gameField[LastLoc[0]][LastLoc[1]] = "empty";
        //cellsArr[LastLoc[0]][LastLoc[1]].style.background = fieldColor;
    }
    if (gameField[CurrentLoc[0]][CurrentLoc[1]] == "snake"/*cellsArr[CurrentLoc[0]][CurrentLoc[1]].style.background == snakeBodyColor*/) //SnakeEatCheck
    {
        GameEnd();
    }
    if (gameField[CurrentLoc[0]][CurrentLoc[1]] == "portal")
    {
        Teleport();
        isPortalActive = true;
        tailsLeft = tail.length;
    }

    gameField[CurrentLoc[0]][CurrentLoc[1]] = "snake";
    //cellsArr[CurrentLoc[0]][CurrentLoc[1]].style.background = snakeBodyColor;
    for (var i = tail.length - 1; i > 0; i--)
    {
        tail[i][0] = tail[i-1][0];
        tail[i][1] = tail[i-1][1];
    }
    tail[0][0] = CurrentLoc[0];
    tail[0][1] = CurrentLoc[1];
    LastLoc[0] = tail[tail.length - 1][0];
    LastLoc[1] = tail[tail.length - 1][1];
}

function TotalScore()
{
    clearInterval(TimerKey);
    return Math.round((foodCount / ingameTime) * 100 + (10 * timeInPortals)/ingameTime*0.5);
}

function TimeScore()
{
    ingameTime++;
    Time.innerHTML = ingameTime;
    Score.innerHTML = foodCount;
    if (isPortalActive) timeInPortals++
    TimerKey = setTimeout(function() {
        TimeScore();
    },1000);
}


function CreateFood()
{
    var foodLoc = [GetRandom(1,cellsCount),GetRandom(1,cellsCount)];
    while (gameField[foodLoc[0]][foodLoc[1]] /*window.getComputedStyle(cellsArr[foodLoc[0]][foodLoc[1]]).background*/ != "empty"/*+" none repeat scroll 0% 0% / auto padding-box border-box"*/)
    {
        foodLoc = [GetRandom(1,cellsCount),GetRandom(1,cellsCount)];
    }
    gameField[foodLoc[0]][foodLoc[1]] = "food";
    //cellsArr[foodLoc[0]][foodLoc[1]].style.background = foodColor;
}

function Controls(e,direct)
{ 
    if (direct != "undefined") e.keyCode = direct;
    
    switch(e.keyCode)
    {
        case 37:  // если нажата клавиша влево
            if (direction[0] != "left" & direction[0] != "right")
            {
                direction[1] = "left";
            }
            break;
        case 38:   // если нажата клавиша вверх
            if (direction[0] != "up" & direction[0] != "down")
            {
                direction[1] = "up";
            }
            break;
        case 39:   // если нажата клавиша вправо
            if (direction[0] != "right" & direction[0] != "left")
            {
                direction[1] = "right";
            }
            break;
        case 40:   // если нажата клавиша вниз
            if (direction[0] != "up" & direction[0] != "down")
            {
                direction[1] = "down";
            }
            break;
        case 27:
            GameEnd();
            break;
    }
}

function MovSnake()
{
    switch(direction[1])
    {
        case "left":  // если нажата клавиша влево
            if (CurrentLoc[1] != 1)
            {
                CurrentLoc[1]--;
            }
            else
            {
                CurrentLoc[1] = cellsCount;
            }
            break;
        case "up":   // если нажата клавиша вверх
            if (CurrentLoc[0] != 1)
            {
                CurrentLoc[0]--;
            }
            else
            {
                CurrentLoc[0] = cellsCount;
            }
            break;
        case "right":   // если нажата клавиша вправо
            if (CurrentLoc[1] != cellsCount)
            {
                CurrentLoc[1]++;
            }
            else
            {
                CurrentLoc[1] = 1;
            }
            break;
        case "down":   // если нажата клавиша вниз
            if (CurrentLoc[0] != cellsCount)
            {
                CurrentLoc[0]++;
            }
            else
            {
                CurrentLoc[0] = 1;
            }
            break;
    }
    direction[0] = direction[1];
    SelectCurrent();
    if (tailsLeft > 0) tailsLeft--;
    RenderField();
}

function GetRandom(min,max)
{
    return Math.round(Math.random() * (max - min) + min);
}

//Actions

function CreatePortal()
{
    var portalLoc = [GetRandom(2,cellsCount - 1),GetRandom(2,cellsCount - 1)];
    while (gameField[portalLoc[0]][portalLoc[1]] != "empty"/*window.getComputedStyle(cellsArr[portalLoc[0]][portalLoc[1]]).background != fieldColor+" none repeat scroll 0% 0% / auto padding-box border-box"*/)
    {
        portalLoc = [GetRandom(1,cellsCount),GetRandom(1,cellsCount)];
    }
    //cellsArr[portalLoc[0]][portalLoc[1]].style.background = portalColor;
    gameField[portalLoc[0]][portalLoc[1]] = "portal";
    return portalLoc;
}

function Teleport()
{
    var selectedPortal;
    if (CurrentLoc[0] == portalsConnection[0][0] && CurrentLoc[1] == portalsConnection[0][1])
    {
        selectedPortal = [portalsConnection[1][0],portalsConnection[1][1]];
    }
    else
    {
        selectedPortal = [portalsConnection[0][0],portalsConnection[0][1]];
    }

    switch(direction[1])
    {
        case "left":  // если нажата клавиша влево
            CurrentLoc[0] = selectedPortal[0];
            CurrentLoc[1] = --selectedPortal[1];
            break;
        case "up":   // если нажата клавиша вверх
            CurrentLoc[0] = --selectedPortal[0];
            CurrentLoc[1] = selectedPortal[1];
            break;
        case "right":   // если нажата клавиша вправо
            CurrentLoc[0] = selectedPortal[0];
            CurrentLoc[1] = ++selectedPortal[1];
            break;
        case "down":   // если нажата клавиша вниз
            CurrentLoc[0] = ++selectedPortal[0];
            CurrentLoc[1] = selectedPortal[1];
            break;
    }
}

function PortalAction()
{
    portalsConnection = [CreatePortal(),CreatePortal()];
}

function DeletePortal()
{
    if (tailsLeft == 0)
    {
        gameField[portalsConnection[0][0]][portalsConnection[0][1]] = "empty";
        gameField[portalsConnection[1][0]][portalsConnection[1][1]] = "empty";
        cellsArr[portalsConnection[0][0]][portalsConnection[0][1]].classList.remove('portal');
        cellsArr[portalsConnection[1][0]][portalsConnection[1][1]].classList.remove('portal');
        //cellsArr[portalsConnection[0][0]][portalsConnection[0][1]].style.background = fieldColor;
        //cellsArr[portalsConnection[1][0]][portalsConnection[1][1]].style.background = fieldColor;
        isPortalActive = false;
    }
    else
    {
        setTimeout(function() {
            DeletePortal();
        },snakeSpeed);
    }
}

function PortalEvent()
{
    if (GetRandom(1,100) < 50 && !isPortalActive)
    {    
        PortalAction();
        setTimeout(function() {
            DeletePortal();
        },10000);
    }
}

function RenderField()
{
    for (i = 1; i <= cellsCount; i++)
    {
        for (j = 1; j <= cellsCount; j++)
        {
            switch(gameField[i][j])
            {
                case "empty": 
                    cellsArr[i][j].style.background = fieldColor;
                    break;

                case "snake": 
                    cellsArr[i][j].style.background = snakeBodyColor;
                    break; 

                case "food":
                    cellsArr[i][j].style.background = foodColor;
                    break;    
                
                case "portal": 
                    cellsArr[i][j].classList.add('portal');
                    cellsArr[i][j].style.background = portalColor;
                    break;
            }
        }
    }
}
