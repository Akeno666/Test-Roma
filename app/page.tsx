"use client";

import { useMemo, useState } from "react";

type QuizStage = "intro" | "quiz" | "scanning" | "result";

type ChoiceQuestion = {
  id: string;
  type: "choice";
  eyebrow: string;
  question: string;
  options: string[];
  correct: string;
};

type ImageQuestion = {
  id: string;
  type: "image";
  eyebrow: string;
  question: string;
  images: string[];
  correct: string;
  imageClass: "characters" | "stickers";
};

type TextQuestion = {
  id: string;
  type: "text";
  eyebrow: string;
  question: string;
  image: string;
};

type Question = ChoiceQuestion | ImageQuestion | TextQuestion;

const questions: Question[] = [
  {
    id: "person",
    type: "choice",
    eyebrow: "Моральный компас",
    question: "Самый отвратительный человек в мире:",
    options: ["Александер", "Руслан", "Адриан", "Антон", "Кирилл"],
    correct: "Антон",
  },
  {
    id: "best",
    type: "choice",
    eyebrow: "Вопрос вкуса",
    question: "Выберите лучший из вариантов:",
    options: ["Vindicta", "Haze", "Mina", "Celeste"],
    correct: "Mina",
  },
  {
    id: "character",
    type: "image",
    eyebrow: "Визуальная экспертиза",
    question: "Выберите картинку:",
    images: [
      "character-1.png",
      "character-2.png",
      "character-3.png",
      "character-4.png",
    ],
    correct: "character-4.png",
    imageClass: "characters",
  },
  {
    id: "description",
    type: "text",
    eyebrow: "Свободное мышление",
    question: "Опишите своими словами, что вы видите на фото?",
    image: "mystery-photo.png",
  },
  {
    id: "sticker",
    type: "image",
    eyebrow: "Стикерный интеллект",
    question: "Выберите стикер:",
    images: [
      "sticker-1.webp",
      "sticker-2.webp",
      "sticker-3.webp",
      "sticker-4.webp",
    ],
    correct: "sticker-4.webp",
    imageClass: "stickers",
  },
  {
    id: "greatest",
    type: "choice",
    eyebrow: "Высшая материя",
    question: "Самая лучшая в мире, великая, невероятная:",
    options: ["Ангелиночка", "Кариночка", "Аминочка", "Асламбекочка"],
    correct: "Аминочка",
  },
  {
    id: "anime",
    type: "choice",
    eyebrow: "Контрольная память",
    question: "Какое последнее аниме мы смотрели?",
    options: [
      "Евангелион",
      "Коносуба",
      "Лимонные девочки",
      "Клинок, рассекающий демонов",
    ],
    correct: "Клинок, рассекающий демонов",
  },
];

const scoredQuestions = questions.filter(
  (question): question is ChoiceQuestion | ImageQuestion =>
    question.type !== "text",
);

function getVerdict(score: number) {
  if (score === 6) {
    return {
      title: "Рома высшей пробы",
      copy: "Совпадение личности — 100%. Отпираться уже бессмысленно.",
      mark: "ЭТАЛОН",
    };
  }

  if (score >= 4) {
    return {
      title: "Подозрительно настоящий Рома",
      copy: "Почти всё сошлось. Пара ответов вызывает вопросы у комиссии.",
      mark: "ЗАЧЁТ",
    };
  }

  if (score >= 2) {
    return {
      title: "Рома на минималках",
      copy: "Некоторые признаки есть, но система пока держит тебя под наблюдением.",
      mark: "50 / 50",
    };
  }

  return {
    title: "Самозванец обнаружен",
    copy: "Ты точно тот, за кого себя выдаёшь? Ромометр сильно сомневается.",
    mark: "ОТКАЗ",
  };
}

export default function Home() {
  const [stage, setStage] = useState<QuizStage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [description, setDescription] = useState("");

  const score = useMemo(
    () =>
      scoredQuestions.reduce(
        (total, question) =>
          total + (answers[question.id] === question.correct ? 1 : 0),
        0,
      ),
    [answers],
  );

  const verdict = getVerdict(score);
  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  function finishQuiz() {
    setStage("scanning");
    window.setTimeout(() => setStage("result"), 1900);
  }

  function selectAnswer(questionId: string, value: string) {
    const nextAnswers = {
      ...answers,
      [questionId]: value,
    };

    setAnswers(nextAnswers);
    window.setTimeout(() => {
      if (current === questions.length - 1) {
        finishQuiz();
      } else {
        setCurrent((currentQuestion) => currentQuestion + 1);
      }
    }, 230);
  }

  function submitDescription() {
    const cleanDescription = description.trim();
    if (!cleanDescription) return;

    const nextAnswers = {
      ...answers,
      description: cleanDescription,
    };

    setAnswers(nextAnswers);
    if (current === questions.length - 1) {
      finishQuiz();
    } else {
      setCurrent((currentQuestion) => currentQuestion + 1);
    }
  }

  function restart() {
    setAnswers({});
    setDescription("");
    setCurrent(0);
    setStage("intro");
  }

  return (
    <main className="site-shell">
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <div className="brand">
          РОМО<span>МЕТР</span>
        </div>
        <div className="status-dot">
          <i aria-hidden="true" />
          система онлайн
        </div>
      </header>

      {stage === "intro" && (
        <section className="intro panel-enter">
          <div className="intro-copy">
            <p className="kicker">Сверхсекретная проверка личности</p>
            <h1>
              Докажи, что ты
              <span>настоящий Рома.</span>
            </h1>
            <p className="lead">
              Семь вопросов. Одна попытка. Система видит ложь, сомнения и
              неправильные аниме.
            </p>
            <button
              className="primary-button"
              onClick={() => setStage("quiz")}
            >
              Начать проверку
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <div className="intro-meter" aria-hidden="true">
            <div className="meter-orbit">
              <div className="meter-number">07</div>
              <div className="meter-label">контрольных вопросов</div>
            </div>
            <div className="stamp">ОБМАНУТЬ НЕЛЬЗЯ*</div>
            <div className="fine-print">* почти</div>
          </div>
        </section>
      )}

      {stage === "quiz" && (
        <section className="quiz-wrap panel-enter" key={question.id}>
          <div className="quiz-meta">
            <span>
              Вопрос {String(current + 1).padStart(2, "0")} /{" "}
              {String(questions.length).padStart(2, "0")}
            </span>
            <span>{question.eyebrow}</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Прогресс теста"
            aria-valuemin={1}
            aria-valuemax={questions.length}
            aria-valuenow={current + 1}
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <article className="question-card">
            <div className="question-number" aria-hidden="true">
              {String(current + 1).padStart(2, "0")}
            </div>
            <p className="question-tag">Выбери честно</p>
            <h2>{question.question}</h2>

            {question.type === "choice" && (
              <div className="answer-list">
                {question.options.map((option, index) => (
                  <button
                    className="answer-button"
                    key={option}
                    onClick={() => selectAnswer(question.id, option)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                    <i aria-hidden="true">→</i>
                  </button>
                ))}
              </div>
            )}

            {question.type === "image" && (
              <div className={`image-grid ${question.imageClass}`}>
                {question.images.map((image, index) => (
                  <button
                    className="image-option"
                    key={image}
                    onClick={() => selectAnswer(question.id, image)}
                    aria-label={`Выбрать вариант ${index + 1}`}
                  >
                    <img src={image} alt={`Вариант ${index + 1}`} />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </button>
                ))}
              </div>
            )}

            {question.type === "text" && (
              <div className="text-answer">
                <img
                  className="mystery-image"
                  src={question.image}
                  alt="Фотография для описания"
                />
                <label htmlFor="description">Твоя экспертная версия</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Я вижу..."
                  rows={4}
                  maxLength={280}
                />
                <div className="text-controls">
                  <span>{description.length} / 280</span>
                  <button
                    className="primary-button compact"
                    onClick={submitDescription}
                    disabled={!description.trim()}
                  >
                    Зафиксировать
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            )}
          </article>
        </section>
      )}

      {stage === "scanning" && (
        <section className="scanning panel-enter" aria-live="polite">
          <div className="scanner">
            <div className="scanner-ring" />
            <div className="scanner-core">Р</div>
          </div>
          <p className="kicker">Анализ личности</p>
          <h2>Сверяем уровень Ромы…</h2>
          <div className="scan-line">
            <span />
          </div>
          <div className="scan-codes">
            <span>ВКУС</span>
            <span>ПАМЯТЬ</span>
            <span>СТИКЕРЫ</span>
          </div>
        </section>
      )}

      {stage === "result" && (
        <section className="result panel-enter" aria-live="polite">
          <div className="result-score">
            <span>Итоговый коэффициент</span>
            <strong>
              {score}
              <i>/{scoredQuestions.length}</i>
            </strong>
          </div>

          <div className="result-copy">
            <p className="kicker">Вердикт системы</p>
            <h1>{verdict.title}</h1>
            <p>{verdict.copy}</p>
            {answers.description && (
              <blockquote>
                <span>Экспертное описание:</span>
                «{answers.description}»
              </blockquote>
            )}
            <div className="screenshot-note" role="status">
              <span aria-hidden="true">📸</span>
              <div>
                <strong>Результат готов</strong>
                <p>Сделайте скриншот этой страницы и отправьте Кириллу.</p>
              </div>
            </div>
            <button className="restart-button" onClick={restart}>
              Пройти ещё раз
            </button>
          </div>

          <div className="result-stamp" aria-hidden="true">
            {verdict.mark}
          </div>
        </section>
      )}

      <footer>
        <span>ROMA AUTHENTICATION SYSTEM</span>
        <span>v.7.0 · доверяй, но проверяй</span>
      </footer>
    </main>
  );
}
