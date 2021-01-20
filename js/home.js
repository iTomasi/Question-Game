const $select = document.querySelector(".select");
const $btnStart = document.getElementById("btnStart");
const $form = document.querySelector(".form");
const $content = document.querySelector(".content");
const $inputName = document.getElementById("inputName");

// CONTENT ELEMENT

const $name = document.querySelector(".dashboard__name");
const $recentQuestion = document.getElementById("recentQuestion");
const $quantityQuestion = document.getElementById("quantityQuestion");
const $question = document.querySelector(".game__question");
const $alter_a = document.querySelector(".alter-a");
const $alter_b = document.querySelector(".alter-b");
const $alter_c = document.querySelector(".alter-c");
const $alter_d = document.querySelector(".alter-d");

//

let questionNumber = 0;
let allQuestion = []
let score = {
    corrects: 0,
    wrongs: 0
}


fetch("../question.json")
    .then(res => res.json())
    .then(res => {
        for (let i = 0; i < res.length; i++) {
            const generatingOption = document.createElement("OPTION");
            generatingOption.value = res[i].title;
            generatingOption.textContent = res[i].title;

            $select.appendChild(generatingOption)
        }
    })

const game = () => {

    if (allQuestion[questionNumber] !== undefined) {

        document.querySelectorAll(".alter").forEach(e => {
            e.style.background = "#0B0C10"
        })

        $alter_a.setAttribute("id", `alter-${allQuestion[questionNumber].alternatives[0].replace(/ |, |-/g, "-")}`)
        $alter_b.setAttribute("id", `alter-${allQuestion[questionNumber].alternatives[1].replace(/ |, |-/g, "-")}`)
        $alter_c.setAttribute("id", `alter-${allQuestion[questionNumber].alternatives[2].replace(/ |, |-/g, "-")}`)
        $alter_d.setAttribute("id", `alter-${allQuestion[questionNumber].alternatives[3].replace(/ |, |-/g, "-")}`)

        document.querySelector(".nextQuestion").setAttribute("id", `nextQuestion-${questionNumber}`)

        $recentQuestion.textContent = questionNumber + 1;
        $quantityQuestion.textContent = allQuestion.length;
        $question.textContent = allQuestion[questionNumber].question;

        $alter_a.textContent = `A) ${allQuestion[questionNumber].alternatives[0]}`
        $alter_b.textContent = `B) ${allQuestion[questionNumber].alternatives[1]}`
        $alter_c.textContent = `C) ${allQuestion[questionNumber].alternatives[2]}`
        $alter_d.textContent = `D) ${allQuestion[questionNumber].alternatives[3]}`
    }

    else {
        $content.innerHTML = `
        <div class="ended">
            <h2>${$inputName.value}</h2>
            <span>Corrects: ${score.corrects}</span>
            <span>Wrongs: ${score.wrongs}</span>
        </div>`
    }
}

const nextBtn = () => {
    const btn = document.querySelector(".nextQuestion");

    if (btn.getAttribute("disabled") === "") {
        btn.style.background = "#B54040"
    }

    else {
        btn.style.background = "transparent"

        btn.addEventListener("mouseenter", () => {
            btn.style.background = "#66FCF1"
        })

        btn.addEventListener("mouseleave", () => {
            btn.style.background = "transparent"
        })
    }
}

$btnStart.addEventListener("click", async () => {
    if ($inputName.value !== "" && $select.value !== "Select...") {
        $name.textContent = $inputName.value
        await fetch("../question.json")
            .then(res => res.json())
            .then(async res => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].title === $select.value) {
                        for (let a = 0; a < res[i].questions.length; a++) {
                        allQuestion[a] = await res[i].questions[a]

                        allQuestion[a].alternatives.sort(() => {
                            return Math.random() - 0.5
                        })
                        }
                    }
                }

                allQuestion.sort(() => {
                    return Math.random() - 0.5
                })
            })

        setTimeout(() => {
            $form.style.display = "none"
            $content.style.display = "flex";
        }, 500)

        $form.style.removeProperty("animation-name");
        $form.style.removeProperty("animation-duration");
        $form.style.animationName = "hiddenForm";
        $form.style.animationDuration = "0.5s";

        $content.style.animationName = "showForm";
        $content.style.animationDuration = "0.5s"

        game()
    }
})

$content.addEventListener("click", e => {

    if (e.target.classList.contains("alter")) {

        document.querySelectorAll(".alter").forEach(element => {
            element.style.boxShadow = "none";
        })

        const theAnswer = e.target.textContent.substring(3);

        answerInput.value = theAnswer
        e.target.style.boxShadow = "0 0 2pt 3pt #66FCF1"

        document.getElementById(`nextQuestion-${questionNumber}`).removeAttribute("disabled")
        nextBtn()
    }

    if (e.target.classList.contains("nextQuestion")) {
        const answerInput = document.getElementById("answerInput");

        if (allQuestion[questionNumber].correct === answerInput.value) {
            score.corrects++
            document.getElementById(`alter-${allQuestion[questionNumber].correct.replace(/ |, |-/g, "-")}`).style.background = "#79E152"
        }

        else {
            score.wrongs++
            document.getElementById(`alter-${answerInput.value.replace(/ |, |-/g, "-")}`).style.background = "#E15252";
            document.getElementById(`alter-${allQuestion[questionNumber].correct.replace(/ |, |-/g, "-")}`).style.background = "#79E152"
        }

        document.querySelectorAll(".alter").forEach(element => {
            element.style.boxShadow = "none"
        })
        
        document.getElementById(`nextQuestion-${questionNumber}`).setAttribute("disabled", "");

        ++questionNumber
        setTimeout(() => {
            nextBtn()
            game()
        }, 1500)
    }
})