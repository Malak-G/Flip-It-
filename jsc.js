var possibleCardFaces = [
    '<img src="bow.png" alt="Image 1" style="height:150px;">',
    '<img src="in-love.png" alt="Image 2" style="height:150px;">',
    '<img src="hearts.png" alt="Image 3" style="height:150px;">',
    '<img src="bread.png" alt="Image 4" style="height:150px;">',
    '<img src="whale.png" alt="Image 5" style="height:150px;">',
    '<img src="moon-and-stars.png" alt="Image 6" style="height:150px;">',
    
    '<img src="bow.png" alt="Image 1" style="height:150px;">',
    '<img src="in-love.png" alt="Image 2" style="height:150px;">',
    '<img src="hearts.png" alt="Image 3" style="height:150px;">',
    '<img src="bread.png" alt="Image 4" style="height:150px;">',
    '<img src="whale.png" alt="Image 5" style="height:150px;">',
    '<img src="moon-and-stars.png" alt="Image 6" style="height:150px;">',
];

var lowScore = localStorage.getItem("lowScore") || "N/A";
var score = 0;
var flippedCards = [];
var matchedCards = [];
var locked = false;
var flipTimeout = 700;

function assignLowScore($lowScoreOutput) {
    $lowScoreOutput.text("Low Score: " + lowScore);
}

function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
}

function getRandomFace(availableCardFaces) {
    var randomIndex = getRandomIndex(availableCardFaces.length);
    var face = availableCardFaces[randomIndex];
    availableCardFaces.splice(randomIndex, 1);
    return face;
}

function assignCardFaces($cardFaces) {
    var availableCardFaces = possibleCardFaces.slice(); // Create a copy
    for (var i = 0; i < $cardFaces.length; i++) {
        if (availableCardFaces.length > 0) {
            $($cardFaces[i]).html(getRandomFace(availableCardFaces));
        }
    }
}

function isNotFlipped($card) {
    return !$card.hasClass("flipped");
}

function areMatching(flippedCards) {
    return (flippedCards[0].html() === flippedCards[1].html());
}

function hideCards(flippedCards) {
    setTimeout(function() {
        $(flippedCards[0]).removeClass("flipped");
        $(flippedCards[1]).removeClass("flipped");
        locked = false;
    }, flipTimeout);
}

function hideScoreBoard($scoreBoard) {
    $scoreBoard.addClass("hidden");
}

function checkForLowScore(score, $lowScoreOutput) {
    if (lowScore === "N/A") {
        lowScore = Infinity;
    }
    if (score < lowScore) {
        localStorage.setItem("lowScore", score);
        lowScore = score;
        $lowScoreOutput.html("<em>*new*</em> Best Score: " + score);
    }
}

function renderWinScreen($winScreen) {
    setTimeout(function() {
        $winScreen.addClass("visible");
    }, 400);
}

function reset($lowScoreOutput, $cardFaces, $gameClicks, $gameCardElements, $winScreen, $scoreBoard) {
    assignCardFaces($cardFaces);
    matchedCards = [];
    score = 0;
    $lowScoreOutput.text("Best Score: " + lowScore);
    $gameClicks.text("Total Clicks: " + score);
    $winScreen.removeClass("visible");
    $scoreBoard.removeClass("hidden");
    $gameCardElements.removeClass("flipped");
}

$(document).ready(function() {
    var $newGameButton = $("#new-game-button");
    var $gameContainer = $("#game-container");
    var $gameCardElements = $(".game-card");
    var $cardFaces = $(".game-card .back");
    var $scoreBoard = $("#score-board");
    var $gameClicks = $(".click-count");
    var $lowScoreOutput = $(".low-score");
    var $winScreen = $("#win-screen");
    var $replay = $("#replay-button");
    var $footer = $("footer");

    assignLowScore($lowScoreOutput);
    assignCardFaces($cardFaces);

    $newGameButton.on("click", function() {
        $gameContainer.removeClass("hidden");
        $footer.removeClass("hidden");
    });

    $gameContainer.on("click", ".front, .front h2", function(event) {
        if (event.target !== this || locked) { return; }

        var $card = $(event.target).closest(".game-card");

        if (isNotFlipped($card)) {
            $card.addClass("flipped");
            flippedCards.push($card);
            score++;
            $gameClicks.text("Total Clicks: " + score);
        }

        if (flippedCards.length === 2) {
            if (areMatching(flippedCards)) {
                matchedCards.push(flippedCards[0], flippedCards[1]);
            } else {
                locked = true;
                hideCards(flippedCards);
            }
            flippedCards = [];
        }

        if (matchedCards.length === $gameCardElements.length) {
            checkForLowScore(score, $lowScoreOutput);
            hideScoreBoard($scoreBoard);
            renderWinScreen($winScreen);
        }
    });

    $replay.on("click", function() {
        reset($lowScoreOutput, $cardFaces, $gameClicks, $gameCardElements, $winScreen, $scoreBoard);
    });

    $("a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 600);
        }
    });
});
