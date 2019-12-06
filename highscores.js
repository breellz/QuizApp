//Select the element where the highscore list will be displayed
const highScoresList = document.getElementById("highScoresList");

//get highscores from local storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
//change the inner html of highscores selected above to the value gotten from the local storage
highScoresList.innerHTML = highScores
//for each score, display the username and the score
  .map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");
