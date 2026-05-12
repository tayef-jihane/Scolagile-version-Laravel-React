import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const quizData = {
  1: {
    title: 'Quiz 1 Javascript',
    subtitle: 'Tester vos Connaissances en JavaScript',
    questions: [
      {
        id: 1,
        question: 'Dans quel élément on met le code JavaScript ?',
        options: ['a. <script>', 'b. <js>', 'c. <body>', 'd. <link>'],
        answer: 0,
      },
      {
        id: 2,
        question: 'Quel attribut utiliser pour faire référence à un script javascript externe ?',
        options: ['a. src', 'b. rel', 'c. type', 'd. href'],
        answer: 0,
      },
      {
        id: 3,
        question: 'Comment afficher "hello" sur un message alert ?',
        options: ['a. msg("hello")', 'b. alertbox("hello")', 'c. documentwrite("hello")', 'd. alert("hello")'],
        answer: 3,
      },
      {
        id: 4,
        question: 'Quelle est la bonne syntaxe pour créer une fonction en JavaScript ?',
        options: ['a. function = myFunc()', 'b. function myFunc()', 'c. def myFunc()', 'd. func myFunc()'],
        answer: 1,
      },
      {
        id: 5,
        question: 'Comment déclarer une variable en JavaScript (ES6+) ?',
        options: ['a. var x = 5', 'b. let x = 5', 'c. const x = 5', 'd. Toutes les réponses sont correctes'],
        answer: 3,
      },
    ],
  },
  2: {
    title: 'Quiz 2 PHP',
    subtitle: 'Tester vos Connaissances en PHP',
    questions: [
      {
        id: 1,
        question: 'Que signifie PHP ?',
        options: ['a. Page Helper Process', 'b. Programming Home Pages', 'c. PHP: Hypertext Preprocessor', 'd. Personal Home Process'],
        answer: 2,
      },
      {
        id: 2,
        question: 'Quelle fonction retourne la longueur d\'une chaine de texte ?',
        options: ['a. strlen', 'b. strlength', 'c. length', 'd. substr'],
        answer: 0,
      },
      {
        id: 3,
        question: 'Sachant que $num = 6. Quelle est la valeur de : $num += 2 ?',
        options: ['a. 3', 'b. 8', 'c. 10', 'd. 12'],
        answer: 1,
      },
      {
        id: 4,
        question: 'Comment commence un bloc PHP ?',
        options: ['a. <php>', 'b. <?php', 'c. <%php', 'd. [php]'],
        answer: 1,
      },
      {
        id: 5,
        question: 'Quelle superglobale contient les données d\'un formulaire POST ?',
        options: ['a. $_GET', 'b. $_POST', 'c. $_FORM', 'd. $_DATA'],
        answer: 1,
      },
    ],
  },
};

function QuizRunner({ quizNum, onBack }) {
  const { user, updateUser } = useAuth();
  const quiz = quizData[quizNum];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAnswer = (qId, optIdx) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: optIdx });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('Veuillez répondre à toutes les questions.');
      return;
    }
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    const note = parseFloat(((correct / quiz.questions.length) * 20).toFixed(2));
    setScore(note);
    setSubmitted(true);
    alert(`Votre note : ${note} / 20 (${correct}/${quiz.questions.length} bonnes réponses)`);

    // Send to backend
    setSaving(true);
    try {
      const res = await api.post('/etudiants/quiz-score', {
        quiz_num: quizNum,
        score: note,
      });
      updateUser(res.data.data);
      setSaved(true);
    } catch {
      // Silent fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>{quiz.title}</h1>
        <p>{quiz.subtitle}</p>
      </div>

      {submitted && (
        <div className="alert alert-success">
          Score : {score} / 20{saved && ' — Note enregistrée dans la base de données ✓'}
          {saving && ' — Enregistrement en cours...'}
        </div>
      )}

      {quiz.questions.map((q) => (
        <div className="quiz-question" key={q.id}>
          <h3>{q.id}. {q.question}</h3>
          <div className="quiz-options">
            {q.options.map((opt, idx) => {
              let cls = 'quiz-option';
              if (submitted) {
                if (idx === q.answer) cls += ' correct';
                else if (answers[q.id] === idx && idx !== q.answer) cls += ' incorrect';
              }
              return (
                <div className={cls} key={idx} onClick={() => handleAnswer(q.id, idx)}>
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    checked={answers[q.id] === idx}
                    onChange={() => handleAnswer(q.id, idx)}
                    disabled={submitted}
                    id={`q${q.id}_${idx}`}
                  />
                  <label htmlFor={`q${q.id}_${idx}`}>{opt}</label>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {!submitted && (
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit result
          </button>
        )}
        <button className="btn btn-outline" onClick={onBack}>← Retour</button>
      </div>
    </div>
  );
}

export default function QuizPage() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div className="page-content">
        <QuizRunner quizNum={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-title">QUIZ <span>RSI</span></div>
      <div className="page-subtitle">Projet 4 — Testez vos connaissances</div>

      <div className="quiz-selection">
        <div className="quiz-card" onClick={() => setSelected(1)}>
          <div className="quiz-card-num">N°1</div>
          <div className="quiz-card-title">Quiz JavaScript</div>
          <div className="quiz-card-sub">5 questions • Développement Web</div>
          <div style={{ marginTop: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gray)' }}>
            Cliquez pour commencer →
          </div>
        </div>
        <div className="quiz-card" onClick={() => setSelected(2)}>
          <div className="quiz-card-num">N°2</div>
          <div className="quiz-card-title">Quiz PHP</div>
          <div className="quiz-card-sub">5 questions • Programmation Serveur</div>
          <div style={{ marginTop: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--gray)' }}>
            Cliquez pour commencer →
          </div>
        </div>
      </div>
    </div>
  );
}
