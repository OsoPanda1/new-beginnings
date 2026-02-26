import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Trophy,
  RotateCcw,
  ChevronRight,
  BookOpen,
  Shield
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  text: string;
  is_correct: boolean;
}

interface QuizSystemProps {
  quizId: string;
  quizTitle: string;
  questions: Question[];
  passingScore: number;
  onComplete: (score: number, passed: boolean) => void;
  isFinalExam?: boolean;
}

const QuizSystem = ({
  quizId,
  quizTitle,
  questions,
  passingScore,
  onComplete,
  isFinalExam = false
}: QuizSystemProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(isFinalExam ? 60 * 60 : 30 * 60); // 60 min for final, 30 for regular
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anti-plagiarism: Disable copy/paste
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Timer
  useEffect(() => {
    if (showResults || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResults, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate score
    let correct = 0;
    questions.forEach(q => {
      const selectedId = selectedAnswers[q.id];
      const correctAnswer = q.answers.find(a => a.is_correct);
      if (selectedId === correctAnswer?.id) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / questions.length) * 100);
    const passed = finalScore >= passingScore;

    setScore(finalScore);
    setShowResults(true);
    setIsSubmitting(false);

    onComplete(finalScore, passed);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(isFinalExam ? 60 * 60 : 30 * 60);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  if (questions.length === 0) {
    return (
      <div className="card-elite p-8 text-center">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No hay preguntas disponibles para este examen.</p>
      </div>
    );
  }

  if (showResults) {
    const passed = score >= passingScore;
    
    return (
      <div className="card-elite p-8">
        <div className="text-center mb-8">
          {passed ? (
            <>
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gradient-gold mb-2">
                ¡Felicitaciones!
              </h2>
              <p className="text-muted-foreground">
                Has aprobado el examen con éxito
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                Sigue Intentando
              </h2>
              <p className="text-muted-foreground">
                Necesitas {passingScore}% para aprobar
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card-elite p-6 text-center">
            <p className="text-4xl font-bold text-gradient-gold">{score}%</p>
            <p className="text-sm text-muted-foreground mt-1">Tu puntuación</p>
          </div>
          <div className="card-elite p-6 text-center">
            <p className="text-4xl font-bold text-foreground">{passingScore}%</p>
            <p className="text-sm text-muted-foreground mt-1">Mínimo requerido</p>
          </div>
        </div>

        {/* Answer Review */}
        <div className="space-y-4 mb-8">
          <h3 className="font-display font-semibold text-foreground">Revisión de respuestas</h3>
          {questions.map((q, index) => {
            const selectedId = selectedAnswers[q.id];
            const correctAnswer = q.answers.find(a => a.is_correct);
            const isCorrect = selectedId === correctAnswer?.id;
            
            return (
              <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-primary/50 bg-primary/5' : 'border-destructive/50 bg-destructive/5'}`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {index + 1}. {q.text}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Respuesta correcta: {correctAnswer?.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          {!passed && (
            <Button variant="elite" onClick={restartQuiz} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Intentar de nuevo
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="card-elite overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-card p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              {quizTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isFinalExam ? 'Examen Final' : 'Examen de Módulo'}
            </p>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-destructive/20 text-destructive' : 'bg-muted'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Progress value={progress} className="flex-1 h-2" />
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>

        {/* Anti-plagiarism warning */}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <Shield className="w-4 h-4" />
          <span>Sistema anti-plagio activo. Copiar y pegar está deshabilitado.</span>
        </div>
      </div>

      {/* Question */}
      <div className="p-8">
        <div className="mb-6">
          <span className="text-sm text-primary font-medium">Pregunta {currentQuestion + 1}</span>
          <h3 className="text-xl font-display font-semibold text-foreground mt-2">
            {currentQ.text}
          </h3>
        </div>

        {/* Answers */}
        <div className="space-y-3">
          {currentQ.answers.map((answer, index) => {
            const isSelected = selectedAnswers[currentQ.id] === answer.id;
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            
            return (
              <button
                key={answer.id}
                onClick={() => selectAnswer(currentQ.id, answer.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
                  isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {letter}
                </span>
                <span className={`flex-1 ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {answer.text}
                </span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {/* Question indicators */}
            <div className="hidden md:flex gap-1">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    i === currentQuestion
                      ? 'bg-primary text-primary-foreground'
                      : selectedAnswers[q.id]
                      ? 'bg-secondary/50 text-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              variant="elite"
              onClick={handleSubmit}
              disabled={answeredCount < questions.length || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                'Enviando...'
              ) : (
                <>
                  Enviar Examen
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleNext} className="gap-2">
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {answeredCount < questions.length && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            {questions.length - answeredCount} pregunta(s) sin responder
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizSystem;
