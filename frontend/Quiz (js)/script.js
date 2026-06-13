const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        answer: "Hyper Text Markup Language"
    },

    {
        question: "Which language is used for styling web pages?",
        options: [
            "HTML",
            "CSS",
            "Java",
            "Python"
        ],
        answer: "CSS"
    },

    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: [
            "int",
            "var",
            "string",
            "define"
        ],
        answer: "var"
    },

    {
        question: "Which company developed JavaScript?",
        options: [
            "Microsoft",
            "Google",
            "Netscape",
            "Apple"
        ],
        answer: "Netscape"
    }
];
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
let currentQuestionIndex = 0;
let score = 0;

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach(option => {

        const optionElement = document.createElement("button");

        optionElement.textContent = option;
        optionElement.classList.add("option-btn");

        optionElement.addEventListener("click", () => {

            const allButtons =
                optionsElement.querySelectorAll("button");

            allButtons.forEach(btn => btn.disabled = true);

            if (option === currentQuestion.answer) {
                optionElement.classList.add("correct");
                score++;
            } else {
                optionElement.classList.add("wrong");

                allButtons.forEach(btn => {
                    if (
                        btn.textContent === currentQuestion.answer
                    ) {
                        btn.classList.add("correct");
                    }
                });
            }

        });

        optionsElement.appendChild(optionElement);
    });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionElement.innerHTML = `
        Quiz Completed! <br><br>
        Score: ${score} / ${questions.length}
    `;
    optionsElement.innerHTML = "";
    nextBtn.textContent = "Restart";
    nextBtn.onclick = function () {
        currentQuestionIndex = 0;
        score = 0;
        nextBtn.textContent = "Next";
        nextBtn.onclick = null;
        loadQuestion();
    };
}
nextBtn.addEventListener("click", nextQuestion);
loadQuestion();

