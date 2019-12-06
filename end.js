//select all required elements
const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
//get highscores from local storage
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;
//Display the most recent score
finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});
//grab the event from clicking the save button
saveHighScore = e => {
  console.log("clicked the save button!");
  //prevent default action by the browser
  e.preventDefault();
//get score and username value
  const score = {
    score: Math.floor(Math.random() * 100),
    name: username.value
  };
  //add new score
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);
//convert highscores to string
  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("./highscores.html");
};
