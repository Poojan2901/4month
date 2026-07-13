import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import "./Quiz.css";

const quizQuestions = [
  {
    id: 1,
    question: "where did we first speak or meet?",
    options: [
      "in that cozy little coffee shop",
      "through a mutual friend's party",
      "online, with a simple 'happy birthday' message",
      "at the library, hiding behind books"
    ],
    correctIdx: 2,
    successMsg: "yes! a single 'happy birthday' message that changed everything.",
    failMsg: "not quite! remember our digital start? ❤️"
  },
  {
    id: 2,
    question: "who is most likely to steal the blanket at night?",
    options: [
      "definitely Kira",
      "Pinu, without a doubt",
      "both of us, in a chaotic tug of war",
      "neither, we share perfectly"
    ],
    correctIdx: 0,
    successMsg: "haha absolutely, you wrap yourself up like a cute burrito! 🌯",
    failMsg: "are you sure? let's be real here... 😜"
  },
  {
    id: 3,
    question: "what is our ultimate comfort activity?",
    options: [
      "fancy dining at expensive restaurants",
      "ordering takeout and watching cozy movies",
      "going on long intense workouts",
      "arguing over which directions to go"
    ],
    correctIdx: 1,
    successMsg: "spot on! pizza, pajamas, and a good movie is our happy place.",
    failMsg: "sounds fun, but you know we love cozying up inside way more!"
  }
];

export default function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answerLog, setAnswerLog] = useState([]);
  const [saving, setSaving] = useState(false);

  function handleOptionClick(optIdx) {
    if (answered) return;
    setSelectedOpt(optIdx);
    setAnswered(true);

    const currentQ = quizQuestions[currentIdx];
    const isCorrect = optIdx === currentQ.correctIdx;
    if (isCorrect) setScore((prev) => prev + 1);

    setAnswerLog((prev) => [
      ...prev,
      {
        question: currentQ.question,
        selected: currentQ.options[optIdx],
        correct: isCorrect
      }
    ]);
  }

  async function handleNext() {
    setSelectedOpt(null);
    setAnswered(false);

    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setFinished(true);
      await saveResult();
    }
  }

  async function saveResult() {
    setSaving(true);
    const { error } = await supabase.from("quiz_results").insert([
      {
        score,
        total: quizQuestions.length,
        answers: answerLog
      }
    ]);
    setSaving(false);
    if (error) console.error("save quiz_results error:", error);
  }

  function handleRestart() {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswerLog([]);
  }

  const currentQ = quizQuestions[currentIdx];

  return (
    <section className="quiz-section">
      <div className="quiz-container">
        <motion.p className="quiz-subtitle" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          how well do you know us?
        </motion.p>
        <motion.h2 className="quiz-title" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          the love trivia
        </motion.h2>

        <div className="quiz-card-wrapper">
          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={currentIdx}
                className="quiz-card"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <div className="quiz-progress">
                  question {currentIdx + 1} of {quizQuestions.length}
                </div>
                <h3 className="quiz-question">{currentQ.question}</h3>

                <div className="quiz-options">
                  {currentQ.options.map((opt, oIdx) => {
                    let btnClass = "";
                    if (answered) {
                      if (oIdx === currentQ.correctIdx) btnClass = "correct";
                      else if (selectedOpt === oIdx) btnClass = "incorrect";
                      else btnClass = "disabled";
                    } else {
                      btnClass = "interactive";
                    }

                    return (
                      <button
                        key={oIdx}
                        className={`quiz-option-btn ${btnClass}`}
                        onClick={() => handleOptionClick(oIdx)}
                        disabled={answered}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {answered && (
                    <motion.div className="quiz-feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="feedback-text">
                        {selectedOpt === currentQ.correctIdx ? currentQ.successMsg : currentQ.failMsg}
                      </p>
                      <button className="quiz-next-btn" onClick={handleNext}>
                        {currentIdx === quizQuestions.length - 1 ? "finish" : "next"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="finished" className="quiz-finished-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="celebration-emoji">✨❤️✨</span>
                <h3>quiz completed!</h3>
                <p className="score-display">
                  your score: <strong>{score} / {quizQuestions.length}</strong>
                </p>
                <p className="score-desc">
                  {score === quizQuestions.length
                    ? "perfect! we really are in sync in everything we do. i love you!"
                    : "almost perfect! a good excuse to reminisce and make more memories together."}
                </p>
                {saving && <p className="score-desc">saving your result...</p>}
                <button className="quiz-restart-btn" onClick={handleRestart}>
                  play again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}