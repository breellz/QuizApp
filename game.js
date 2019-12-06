
//select all required element from the html
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

//declare the needed variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

//set questions to an empty array
let questions = [];

//fetch questions from a public api
fetch(
  "https://opentdb.com/api.php?amount=20&category=9&difficulty=easy&type=multiple"
)
//parse the response to Json
  .then(res => {
    return res.json();
  })
  //store response in LoadedQuestions
  .then(loadedQuestions => {
    /*log questions
    console.log(loadedQuestions.results);
    get questions from the array*/
    questions = loadedQuestions.results.map(loadedQuestion => {
      const formattedQuestion = {
        question: loadedQuestion.question
      };
      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
    //adds correct answer to the answer choices
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      return formattedQuestion;
    });
//Stats game
    startGame();
  })
  //catch any error that occurs while fetching
  .catch(err => {
    //logs error to the console
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
  questionCounter = 0;
  score = 0;
  //get questions
  availableQuesions = [...questions];
  getNewQuestion();
  //shows loading aniamation while question is being gotten
  game.classList.remove("hidden");
  //hidesas soon as questions are loaded
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  //if there are no questions or questions are maxed out
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    //shows recent score
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("./end.html");
  }
  //else, increase counter
  questionCounter++;
  //displays question number against total question
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
//show current question
  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerHTML = currentQuestion.question;
//display options to each question
  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};
//listen for a click on each option
choices.forEach(choice => {
  choice.addEventListener("click", e => {
    //if acceptinganswer is false terminate the function
    if (!acceptingAnswers) return;
//else grab the event from this action
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
//is selected answer is equivalent to correct answer? if yes assign "correct" else "incorrect"
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
//if selected choice is correct, increase score and add classtoapply ie "correct"
    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);
//in a second,remove the added class and get a new question
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});
//define score increase
incrementScore = num => {
  score += num;
  //update current score
  scoreText.innerText = score;
};
