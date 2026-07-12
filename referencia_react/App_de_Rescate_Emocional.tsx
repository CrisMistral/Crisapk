import React, { useState, useEffect } from 'react';
import { Heart, Brain, Eye, Wind, Hand, Clock, Zap, ArrowLeft, Play, Pause } from 'lucide-react';

export default function RescueApp() {
  const [view, setView] = useState('home');
  const [current, setCurrent] = useState(null);
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [used, setUsed] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepTimer, setStepTimer] = useState(0);
  const [speed, setSpeed] = useState('normal');
  
  // Estados para Matriz de Eisenhower
  const [tasks, setTasks] = useState({
    urgent_important: [],
    not_urgent_important: [],
    urgent_not_important: [],
    not_urgent_not_important: []
  });
  const [newTask, setNewTask] = useState('');
  const [eisenhowerStep, setEisenhowerStep] = useState('intro'); // intro, questions, matrix
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  const rescues = [
    { 
      id: 1, 
      name: "5-4-3-2-1 Grounding", 
      icon: <Eye className="w-6 h-6" />, 
      color: "bg-blue-500", 
      category: "Anclaje al Presente",
      steps: ["5 cosas que VES", "4 que TOCAS", "3 que ESCUCHAS", "2 que HUELES", "1 que SABOREAS"],
      neuroscience: "Activa corteza prefrontal y reduce amígdala"
    },
    { 
      id: 2, 
      name: "Respiración 4-7-8", 
      icon: <Wind className="w-6 h-6" />, 
      color: "bg-green-500",
      category: "Regulación Bioquímica",
      pattern: "Inhala 4 seg → Mantén 7 seg → Exhala 8 seg",
      neuroscience: "Estimula nervio vago y sistema parasimpático"
    },
    { 
      id: 3, 
      name: "Reset Cognitivo Express", 
      icon: <Brain className="w-6 h-6" />, 
      color: "bg-purple-500",
      category: "Frenar Sobrecarga",
      steps: [
        "Mirá un punto fijo 30 segundos y soltá aire por la boca",
        "Cerrá ojos y apoyá palmas en tu frente",
        "Escribí SOLO 3 pendientes (resto a 'lista parking')",
        "Decí en voz alta: 'No todo es urgente'",
        "Desactivá notificaciones 15 minutos",
        "O cuenta regresiva: 700, 693, 686, 679... (de 7 en 7)"
      ],
      neuroscience: "Reordena jerarquías cerebrales, recalibra sistema reticular"
    },
    { 
      id: 4, 
      name: "Regulación 90 Segundos", 
      icon: <Clock className="w-6 h-6" />, 
      color: "bg-amber-500",
      category: "Bioquímica Rápida",
      steps: [
        "Respiración cuadrada 4-4-4-4 (inhala-sostén-exhala-sostén)",
        "Mové hombros hacia atrás y bostezá exageradamente",
        "Tomá agua fría para estimular nervio vago",
        "Sonreí (aunque sea forzado) - cerebro lo lee como calma"
      ],
      neuroscience: "Libera tensión cervical, activa nervio vago, regula cortisol"
    },
    { 
      id: 5, 
      name: "Anclaje Sensorial", 
      icon: <Hand className="w-6 h-6" />, 
      color: "bg-teal-500",
      category: "Detener la Tormenta",
      steps: [
        "Observá 5 objetos: describí color y forma mentalmente",
        "Apoyá ambos pies y sentí el peso corporal",
        "Dibujá un 8 acostado en tu pierna con el dedo",
        "Tocá texturas distintas: metal, madera, tela",
        "Decí: 'Estoy presente. En este lugar. Ahora.'"
      ],
      neuroscience: "Grounding sensorial inmediato, cambio de canal perceptivo"
    },
    { 
      id: 6, 
      name: "Depuración Mental RAM", 
      icon: <Brain className="w-6 h-6" />, 
      color: "bg-indigo-500",
      category: "Liberar Espacio Mental",
      steps: [
        "Escribí sin filtro 3 min: TODO lo que ocupa tu mente",
        "Marcá con círculo solo lo que depende de vos",
        "Tachá o eliminá una tarea simbólicamente",
        "Ordená visualmente tu escritorio",
        "Apagá pantallas 10 min y mirá el cielo"
      ],
      neuroscience: "Libera energía de procesamiento prefrontal, menos interferencia"
    },
    { 
      id: 7, 
      name: "Shots de Micro-Placer", 
      icon: <Zap className="w-6 h-6" />, 
      color: "bg-pink-500",
      category: "Reequilibrio Neuroquímico",
      steps: [
        "Respirá profundo un aroma que te guste (cítricos, menta, lavanda)",
        "Escuchá una canción que te haga sonreír y movete",
        "Mandale mensaje de agradecimiento o humor a alguien",
        "Estirate bostezando - activa endorfinas",
        "Imaginá tu cerebro reiniciando: pantalla en blanco"
      ],
      neuroscience: "Reequilibra neurotransmisores, devuelve perspectiva, activa endorfinas"
    },
    { 
      id: 8, 
      name: "Música 60 BPM", 
      icon: <Heart className="w-6 h-6" />, 
      color: "bg-rose-500",
      category: "Sincronización Cardíaca",
      instruction: "Buscá en YouTube: 'Música Barroca y Clásica a 60 BPM'",
      detail: "Escuchá por 2 minutos - sincroniza con ritmo cardíaco en reposo",
      neuroscience: "Sincroniza frecuencia cardíaca, induce estado de calma profunda"
    }
  ];

  const guidedMeditations = [
    {
      id: 1,
      name: "Respiración 8min",
      instructor: "Ana",
      steps: [
        { text: "Hola, soy Ana. Ponte cómodo", instruction: "Cierra los ojos suavemente", time: 15 },
        { text: "Respira naturalmente", instruction: "Solo observa tu respiración", time: 20 },
        { text: "Inhala profundamente", instruction: "Siente el aire entrando", time: 10 },
        { text: "Exhala lentamente", instruction: "Suelta toda tensión", time: 12 },
        { text: "Continuemos este ritmo", instruction: "Inhala 4, exhala 6", time: 60 },
        { text: "Si divaga tu mente, vuelve", instruction: "Gentilmente a respirar", time: 30 },
        { text: "Siente la calma", instruction: "Cada respiración trae paz", time: 45 },
        { text: "Abre los ojos lentamente", instruction: "Lleva esta calma contigo", time: 15 }
      ]
    },
    {
      id: 2,
      name: "Autocompasión 10min",
      instructor: "María",
      steps: [
        { text: "Hola, soy María", instruction: "Pon una mano en tu corazón", time: 15 },
        { text: "Este es un momento de dolor", instruction: "Reconócelo con gentileza", time: 25 },
        { text: "Tu dolor es válido", instruction: "No necesitas cambiarlo", time: 30 },
        { text: "No estás solo en esto", instruction: "Miles sienten este dolor", time: 25 },
        { text: "Sé gentil contigo", instruction: "Repite: Que pueda ser bueno conmigo", time: 40 },
        { text: "Mereces compasión", instruction: "Especialmente ahora", time: 35 },
        { text: "Siente tu mano como consuelo", instruction: "Ese calor es tu amor", time: 30 },
        { text: "Eres valioso", instruction: "Tal como eres", time: 35 },
        { text: "Lleva esta compasión contigo", instruction: "Siempre puedes volver", time: 30 },
        { text: "Abre los ojos con amor", instruction: "Has hecho algo hermoso", time: 15 }
      ]
    },
    {
      id: 3,
      name: "Sanación 30min",
      instructor: "Sofía",
      steps: [
        { text: "Bienvenido, soy Sofía", instruction: "Este tiempo es para ti", time: 20 },
        { text: "Cierra los ojos profundo", instruction: "Conecta con tu cuerpo", time: 25 },
        { text: "Inhala paz, exhala tensión", instruction: "Establece tu respiración", time: 40 },
        { text: "Reconoce tu dolor", instruction: "Permítelo estar presente", time: 60 },
        { text: "Tu dolor es real", instruction: "Te veo, te acepto", time: 70 },
        { text: "Envía amor a tu corazón", instruction: "Imagina luz dorada", time: 80 },
        { text: "Esta luz te sana", instruction: "Disuelve el dolor", time: 90 },
        { text: "Eres fuerte", instruction: "Puedes sanar", time: 60 },
        { text: "Relaja tus pies", instruction: "Siéntelos aflojarse", time: 40 },
        { text: "Relaja tus piernas", instruction: "Pantorrillas, muslos", time: 50 },
        { text: "Tu abdomen descansa", instruction: "Respira hacia tu centro", time: 50 },
        { text: "Tu espalda se suelta", instruction: "Desde lumbar a hombros", time: 60 },
        { text: "Tu corazón late en paz", instruction: "Siente su ritmo calmado", time: 70 },
        { text: "Tus hombros caen", instruction: "Sueltas todo peso", time: 60 },
        { text: "Tus brazos descansan", instruction: "Completamente relajados", time: 50 },
        { text: "Tu rostro se suaviza", instruction: "Frente, ojos, mandíbula", time: 60 },
        { text: "Tu mente descansa", instruction: "Los pensamientos pasan", time: 80 },
        { text: "Agradece a tu cuerpo", instruction: "Por todo su trabajo", time: 70 },
        { text: "Agradece a tu corazón", instruction: "Por su resistencia", time: 60 },
        { text: "Visualiza días mejores", instruction: "Tu futuro lleno de paz", time: 90 },
        { text: "Esta calma es tuya", instruction: "Nadie puede quitártela", time: 70 },
        { text: "Respiraciones finales", instruction: "Inhala paz, exhala lo viejo", time: 50 },
        { text: "Has sanado hoy", instruction: "Abre los ojos lentamente", time: 30 }
      ]
    },
    {
      id: 4,
      name: "Mindfulness Budista 15min",
      instructor: "Venerable Tenzin",
      steps: [
        { text: "Que la paz sea contigo", instruction: "Siéntate con espalda recta", time: 20 },
        { text: "Refugio en Buda, Dharma, Sangha", instruction: "Conecta con la sabiduría", time: 30 },
        { text: "Observa tu respiración", instruction: "Sin cambiarla, solo observa", time: 60 },
        { text: "Los pensamientos surgen y pasan", instruction: "Etiqueta: pensamiento", time: 90 },
        { text: "Todo es impermanente", instruction: "El dolor también pasará", time: 75 },
        { text: "Cultiva metta - amor bondadoso", instruction: "Que sea feliz", time: 90 },
        { text: "Amor a seres queridos", instruction: "Que todos sean felices", time: 75 },
        { text: "Amor incluso a quien te lastimó", instruction: "Que todos sean libres", time: 90 },
        { text: "Practica el desapego", instruction: "Suelta lo que no controlas", time: 75 },
        { text: "Regresa a respirar", instruction: "Inhala compasión, exhala paz", time: 60 },
        { text: "Dedica los méritos", instruction: "Para todos los seres", time: 45 },
        { text: "Om Mani Padme Hum", instruction: "Abre los ojos en paz", time: 30 }
      ]
    },
    {
      id: 5,
      name: "Tonglen Tibetano 18min",
      instructor: "Lama Pema",
      steps: [
        { text: "Tashi Delek, soy Lama Pema", instruction: "Abre tu corazón", time: 25 },
        { text: "Tonglen transforma sufrimiento", instruction: "Tu dolor se vuelve medicina", time: 40 },
        { text: "Reconoce tu dolor", instruction: "Acógelo con gentileza", time: 60 },
        { text: "Inhala sufrimiento como humo", instruction: "Acepta tu dolor", time: 75 },
        { text: "Exhala alivio como luz dorada", instruction: "Envíate amor", time: 75 },
        { text: "Piensa en alguien que sufre", instruction: "Conecta con su dolor", time: 60 },
        { text: "Inhala su sufrimiento también", instruction: "Tu corazón puede contenerlo", time: 90 },
        { text: "Exhala sanación para ambos", instruction: "Luz dorada para todos", time: 90 },
        { text: "Expande a todos los que sufren", instruction: "Millones sienten esto", time: 90 },
        { text: "Inhala todo el sufrimiento", instruction: "Tu compasión es infinita", time: 90 },
        { text: "Exhala sanación universal", instruction: "Que todos sean libres", time: 120 },
        { text: "Este es el corazón Bodhisattva", instruction: "Despertar para todos", time: 75 },
        { text: "Tu dolor tiene propósito", instruction: "Es portal a la compasión", time: 90 },
        { text: "Om Tare Tuttare Ture Soha", instruction: "Que Tara proteja a todos", time: 45 },
        { text: "Mantén el corazón abierto", instruction: "Abre los ojos renovado", time: 30 }
      ]
    }
  ];

  const speedSettings = {
    lento: { multiplier: 1.5, name: "Lento" },
    normal: { multiplier: 1, name: "Normal" },
    rápido: { multiplier: 0.7, name: "Rápido" }
  };

  const beep = (freq = 600, dur = 200) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur/1000);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur/1000);
      console.log(`🔊 BEEP: ${freq}Hz`);
    } catch(e) { console.log('❌ Audio bloqueado'); }
  };

  const beepStart = () => beep(400, 300);
  const beepTransition = () => beep(600, 200);
  const beepSuccess = () => beep(900, 150);

  useEffect(() => {
    let interval;
    if (view === 'guided' && playing && stepTimer > 0) {
      interval = setInterval(() => setStepTimer(t => t - 1), 1000);
    } else if (view === 'guided' && stepTimer === 0 && playing && current) {
      if (currentStep < current.steps.length - 1) {
        console.log(`🔄 Cambiando paso ${currentStep + 1} → ${currentStep + 2}`);
        beepTransition();
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        const duration = Math.floor(current.steps[nextStep].time * speedSettings[speed].multiplier);
        setStepTimer(duration);
      } else {
        console.log('✅ Meditación terminada');
        setPlaying(false);
        beepSuccess();
        setTimeout(() => setView('home'), 2000);
      }
    }
    return () => clearInterval(interval);
  }, [view, playing, stepTimer, currentStep, current, speed]);

  const getRandom = () => {
    const available = rescues.filter(r => !used.includes(r.id));
    if (available.length === 0) setUsed([]);
    const list = available.length ? available : rescues;
    const random = list[Math.floor(Math.random() * list.length)];
    setUsed([...used, random.id]);
    return random;
  };

  const startRescue = () => {
    beepStart();
    setCurrent(getRandom());
    setView('rescue');
  };

  const startGuided = (meditation) => {
    beepStart();
    setCurrent(meditation);
    setCurrentStep(0);
    const duration = Math.floor(meditation.steps[0].time * speedSettings[speed].multiplier);
    setStepTimer(duration);
    setPlaying(false);
    setView('guided');
  };

  const addTask = (quadrant) => {
    if (newTask.trim()) {
      setTasks({
        ...tasks,
        [quadrant]: [...tasks[quadrant], { id: Date.now(), text: newTask, done: false }]
      });
      setNewTask('');
      beepSuccess();
    }
  };

  const toggleTask = (quadrant, taskId) => {
    setTasks({
      ...tasks,
      [quadrant]: tasks[quadrant].map(task => 
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    });
    beepTransition();
  };

  const deleteTask = (quadrant, taskId) => {
    setTasks({
      ...tasks,
      [quadrant]: tasks[quadrant].filter(task => task.id !== taskId)
    });
    beepTransition();
  };

  const eisenhowerQuestions = [
    {
      title: "🔥 CUADRANTE 1: Hacer AHORA",
      subtitle: "Urgente E Importante",
      question: "¿Qué necesitas hacer HOY sí o sí que es realmente importante?",
      examples: ["Pagar la renta antes de la fecha límite", "Llamar al doctor por síntomas preocupantes", "Entregar proyecto urgente del trabajo"],
      placeholder: "Ej: Resolver problema urgente del trabajo",
      helpText: "Estas son crisis o emergencias. Si no lo haces hoy, habrá consecuencias serias.",
      quadrant: "urgent_important"
    },
    {
      title: "📅 CUADRANTE 2: Planificar",
      subtitle: "NO Urgente PERO Importante",
      question: "¿Qué es importante para tu bienestar pero no tiene prisa inmediata?",
      examples: ["Buscar terapeuta", "Empezar a hacer ejercicio", "Reconectar con amigos", "Aprender algo nuevo"],
      placeholder: "Ej: Empezar terapia para procesar el duelo",
      helpText: "Estas cosas mejoran tu vida a largo plazo. Deberías agendar tiempo para ellas.",
      quadrant: "not_urgent_important"
    },
    {
      title: "👥 CUADRANTE 3: Delegar o Minimizar",
      subtitle: "Urgente PERO NO Importante",
      question: "¿Qué cosas urgentes te interrumpen pero no son realmente importantes?",
      examples: ["Responder mensajes de grupo", "Llamadas no esenciales", "Favores que te piden", "Notificaciones constantes"],
      placeholder: "Ej: Contestar mensajes de WhatsApp de grupos",
      helpText: "Estas cosas parecen urgentes pero no te acercan a tus metas. Delega o minimiza.",
      quadrant: "urgent_not_important"
    },
    {
      title: "🗑️ CUADRANTE 4: Eliminar",
      subtitle: "NI Urgente NI Importante",
      question: "¿En qué pierdes tiempo que no te aporta nada?",
      examples: ["Ver historias de tu ex en redes", "Scroll infinito sin propósito", "Ver series solo por verlas", "Chismorreo innecesario"],
      placeholder: "Ej: Stalkear a mi ex en Instagram",
      helpText: "Estas son distracciones puras. Identificarlas es el primer paso para eliminarlas.",
      quadrant: "not_urgent_not_important"
    }
  ];

  const analyzeAnswer = (answer, questionIndex) => {
    const question = eisenhowerQuestions[questionIndex];
    
    if (answer.trim()) {
      const newTaskObj = { 
        id: Date.now() + questionIndex, 
        text: answer, 
        done: false 
      };
      
      setTasks(prev => ({
        ...prev,
        [question.quadrant]: [...prev[question.quadrant], newTaskObj]
      }));
    }
  };

  const handleQuestionAnswer = (answer) => {
    analyzeAnswer(answer, currentQuestion);
    setUserAnswers([...userAnswers, answer]);
    
    if (currentQuestion < eisenhowerQuestions.length - 1) {
      beepTransition();
      setCurrentQuestion(currentQuestion + 1);
      setNewTask('');
    } else {
      beepSuccess();
      setEisenhowerStep('matrix');
    }
  };

  const formatTime = (secs) => `${Math.floor(secs/60)}:${(secs%60).toString().padStart(2,'0')}`;

  if (view === 'eisenhower') {
    // Pantalla de introducción
    if (eisenhowerStep === 'intro') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-lg mx-auto">
            <button onClick={() => {beepSuccess(); setView('home');}} className="flex items-center text-gray-600 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </button>
            
            <div className="text-center mb-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <div className="text-amber-600 text-3xl">📊</div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Matriz de Eisenhower</h1>
              <p className="text-gray-600">Organiza tu mente y reduce el estrés</p>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-900 mb-3">¿Cómo funciona?</h3>
              <p className="text-sm text-amber-800 mb-3">
                Te haré <strong>4 preguntas específicas</strong>, una por cada cuadrante de la matriz. Así sabrás exactamente dónde va cada cosa.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start">
                  <span className="mr-2">1️⃣</span>
                  <p className="text-amber-800"><strong>Hacer AHORA:</strong> Urgente + Importante</p>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">2️⃣</span>
                  <p className="text-amber-800"><strong>Planificar:</strong> Importante pero no urgente</p>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">3️⃣</span>
                  <p className="text-amber-800"><strong>Delegar:</strong> Urgente pero no importante</p>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">4️⃣</span>
                  <p className="text-amber-800"><strong>Eliminar:</strong> Ni urgente ni importante</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">¿Por qué es útil?</h3>
              <p className="text-sm text-blue-800">
                Verás claramente qué merece tu energía y qué debes soltar. Perfecto para cuando el duelo te hace sentir abrumado.
              </p>
            </div>

            <button 
              onClick={() => {
                beepStart();
                setEisenhowerStep('questions');
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600"
            >
              Comenzar Cuestionario
            </button>
          </div>
        </div>
      );
    }

    // Pantalla de preguntas
    if (eisenhowerStep === 'questions') {
      const question = eisenhowerQuestions[currentQuestion];
      const progress = ((currentQuestion + 1) / eisenhowerQuestions.length) * 100;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-lg mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => {
                beepTransition();
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                } else {
                  setEisenhowerStep('intro');
                }
              }} className="flex items-center text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
              </button>
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} de {eisenhowerQuestions.length} cuadrantes
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="mb-8">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold text-amber-900 mb-1">
                  {question.title}
                </h2>
                <p className="text-sm text-amber-700">
                  {question.subtitle}
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {question.question}
              </h3>

              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 mb-2">
                  💡 <strong>Ejemplos:</strong>
                </p>
                <ul className="text-xs text-blue-700 space-y-1">
                  {question.examples.map((example, idx) => (
                    <li key={idx}>• {example}</li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                ℹ️ {question.helpText}
              </p>
              
              <textarea
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder={question.placeholder}
                className="w-full p-4 rounded-lg border-2 border-gray-300 focus:border-amber-500 outline-none resize-none h-32"
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  handleQuestionAnswer('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400"
              >
                Saltar
              </button>
              <button
                onClick={() => {
                  handleQuestionAnswer(newTask);
                }}
                disabled={!newTask.trim()}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion < eisenhowerQuestions.length - 1 ? 'Siguiente' : 'Ver Mi Matriz'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Pantalla de matriz (tu código original pero con botón para reiniciar)
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => {beepSuccess(); setView('home');}} className="flex items-center text-gray-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </button>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Matriz de Eisenhower</h1>
            <p className="text-gray-600 text-sm">Organiza tus prioridades y reduce el estrés</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Cuadrante 1: Urgente e Importante */}
            <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4">
              <h3 className="font-bold text-red-800 mb-2">🔥 Hacer AHORA</h3>
              <p className="text-xs text-red-600 mb-3">Urgente e Importante</p>
              <div className="space-y-2 mb-3">
                {tasks.urgent_important.map(task => (
                  <div key={task.id} className="bg-white rounded p-2 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <input 
                        type="checkbox" 
                        checked={task.done}
                        onChange={() => toggleTask('urgent_important', task.id)}
                        className="mr-2"
                      />
                      <span className={task.done ? 'line-through text-gray-400' : 'text-gray-800 text-sm'}>
                        {task.text}
                      </span>
                    </div>
                    <button onClick={() => deleteTask('urgent_important', task.id)} className="text-red-500 ml-2">✕</button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask('urgent_important')}
                placeholder="Nueva tarea..."
                className="w-full p-2 rounded border text-sm"
              />
              <button onClick={() => addTask('urgent_important')} className="w-full bg-red-500 text-white py-1 rounded mt-2 text-sm">
                + Agregar
              </button>
            </div>

            {/* Cuadrante 2: No Urgente pero Importante */}
            <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4">
              <h3 className="font-bold text-green-800 mb-2">📅 Planificar</h3>
              <p className="text-xs text-green-600 mb-3">Importante pero No Urgente</p>
              <div className="space-y-2 mb-3">
                {tasks.not_urgent_important.map(task => (
                  <div key={task.id} className="bg-white rounded p-2 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <input 
                        type="checkbox" 
                        checked={task.done}
                        onChange={() => toggleTask('not_urgent_important', task.id)}
                        className="mr-2"
                      />
                      <span className={task.done ? 'line-through text-gray-400' : 'text-gray-800 text-sm'}>
                        {task.text}
                      </span>
                    </div>
                    <button onClick={() => deleteTask('not_urgent_important', task.id)} className="text-red-500 ml-2">✕</button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask('not_urgent_important')}
                placeholder="Nueva tarea..."
                className="w-full p-2 rounded border text-sm"
              />
              <button onClick={() => addTask('not_urgent_important')} className="w-full bg-green-500 text-white py-1 rounded mt-2 text-sm">
                + Agregar
              </button>
            </div>

            {/* Cuadrante 3: Urgente pero No Importante */}
            <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4">
              <h3 className="font-bold text-yellow-800 mb-2">👥 Delegar</h3>
              <p className="text-xs text-yellow-600 mb-3">Urgente pero No Importante</p>
              <div className="space-y-2 mb-3">
                {tasks.urgent_not_important.map(task => (
                  <div key={task.id} className="bg-white rounded p-2 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <input 
                        type="checkbox" 
                        checked={task.done}
                        onChange={() => toggleTask('urgent_not_important', task.id)}
                        className="mr-2"
                      />
                      <span className={task.done ? 'line-through text-gray-400' : 'text-gray-800 text-sm'}>
                        {task.text}
                      </span>
                    </div>
                    <button onClick={() => deleteTask('urgent_not_important', task.id)} className="text-red-500 ml-2">✕</button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask('urgent_not_important')}
                placeholder="Nueva tarea..."
                className="w-full p-2 rounded border text-sm"
              />
              <button onClick={() => addTask('urgent_not_important')} className="w-full bg-yellow-500 text-white py-1 rounded mt-2 text-sm">
                + Agregar
              </button>
            </div>

            {/* Cuadrante 4: Ni Urgente Ni Importante */}
            <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">🗑️ Eliminar</h3>
              <p className="text-xs text-gray-600 mb-3">Ni Urgente Ni Importante</p>
              <div className="space-y-2 mb-3">
                {tasks.not_urgent_not_important.map(task => (
                  <div key={task.id} className="bg-white rounded p-2 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <input 
                        type="checkbox" 
                        checked={task.done}
                        onChange={() => toggleTask('not_urgent_not_important', task.id)}
                        className="mr-2"
                      />
                      <span className={task.done ? 'line-through text-gray-400' : 'text-gray-800 text-sm'}>
                        {task.text}
                      </span>
                    </div>
                    <button onClick={() => deleteTask('not_urgent_not_important', task.id)} className="text-red-500 ml-2">✕</button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask('not_urgent_not_important')}
                placeholder="Nueva tarea..."
                className="w-full p-2 rounded border text-sm"
              />
              <button onClick={() => addTask('not_urgent_not_important')} className="w-full bg-gray-500 text-white py-1 rounded mt-2 text-sm">
                + Agregar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-2">💡 Cómo usar esta matriz:</h3>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>🔥 <strong>Hacer AHORA:</strong> Crisis, deadlines, problemas urgentes</li>
              <li>📅 <strong>Planificar:</strong> Metas, relaciones, crecimiento personal</li>
              <li>👥 <strong>Delegar:</strong> Interrupciones, llamadas, emails</li>
              <li>🗑️ <strong>Eliminar:</strong> Distracciones, tiempo perdido, trivialidades</li>
            </ul>
            <button
              onClick={() => {
                beepStart();
                setEisenhowerStep('intro');
                setCurrentQuestion(0);
                setUserAnswers([]);
                setTasks({
                  urgent_important: [],
                  not_urgent_important: [],
                  urgent_not_important: [],
                  not_urgent_not_important: []
                });
              }}
              className="w-full bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600"
            >
              🔄 Hacer Cuestionario de Nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'rescue') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm mx-auto">
          <button onClick={() => {beepSuccess(); setView('home');}} className="flex items-center text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </button>
          
          <div className={`${current.color} rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-white`}>
            {current.icon}
          </div>
          
          <h2 className="text-xl font-bold text-center mb-2">{current.name}</h2>
          
          {current.category && (
            <div className="text-center mb-4">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                {current.category}
              </span>
            </div>
          )}

          {current.neuroscience && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                <strong>🧠 Neurociencia:</strong> {current.neuroscience}
              </p>
            </div>
          )}
          
          {current.steps && current.steps.map((step, i) => (
            <div key={i} className="flex items-start space-x-2 mb-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0 mt-0.5">
                {i+1}
              </div>
              <p className="text-gray-700 text-sm">{step}</p>
            </div>
          ))}
          
          {current.pattern && (
            <div className="bg-green-100 rounded-lg p-4 mb-4 text-center">
              <p className="text-green-800 font-medium mb-2">{current.pattern}</p>
              {current.neuroscience && (
                <p className="text-xs text-green-700">{current.neuroscience}</p>
              )}
            </div>
          )}
          
          {current.instruction && (
            <div className="bg-rose-100 rounded-lg p-4 mb-4">
              <p className="text-rose-800 font-medium mb-2">{current.instruction}</p>
              {current.detail && (
                <p className="text-sm text-rose-700 mb-2">{current.detail}</p>
              )}
              {current.neuroscience && (
                <p className="text-xs text-rose-600 mt-2">🧠 {current.neuroscience}</p>
              )}
            </div>
          )}
          
          <button onClick={() => {beepSuccess(); startRescue();}} className="w-full bg-red-500 text-white py-3 rounded-lg font-medium">
            Otra Técnica
          </button>
        </div>
      </div>
    );
  }

  if (view === 'guided') {
    const progress = ((currentStep + 1) / current.steps.length) * 100;
    const currentStepData = current.steps[currentStep];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 p-4">
        <div className="max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => {beepSuccess(); setView('home');}} className="flex items-center text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Salir
            </button>
            <div className="flex space-x-2">
              {Object.entries(speedSettings).map(([key, setting]) => (
                <button
                  key={key}
                  onClick={() => {beepTransition(); setSpeed(key);}}
                  className={`px-2 py-1 rounded text-xs ${
                    speed === key ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {setting.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">{current.name}</h2>
              <p className="text-slate-400 text-sm">con {current.instructor}</p>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-3 mb-8">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-slate-300 mb-4">
                {formatTime(stepTimer)}
              </div>
              <p className="text-slate-400 text-sm">
                Paso {currentStep + 1} de {current.steps.length}
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-center">
                <p className="text-white text-xl font-semibold mb-2">
                  {currentStepData?.text}
                </p>
              </div>
              
              <div className="bg-slate-700 rounded-2xl p-6 text-center border-2 border-slate-600">
                <p className="text-slate-200 text-lg font-medium">
                  {currentStepData?.instruction}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (playing) {
                  beepTransition();
                  setPlaying(false);
                } else {
                  beepStart();
                  setPlaying(true);
                }
              }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-3 ${
                playing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              <span>{playing ? 'Pausar Sesión' : 'Iniciar Sesión'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tu App de Bienestar</h1>
          <p className="text-gray-600 text-sm">Rescate, meditación y prácticas budistas</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Rescate Emocional</h2>
                <p className="text-gray-600 text-xs">Para momentos de crisis</p>
              </div>
            </div>
            <button onClick={startRescue} className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-bold">
              🚨 RESCÁTAME AHORA
            </button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <div className="text-indigo-600 text-xl">🧘‍♀️</div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Meditaciones Guiadas</h2>
                <p className="text-gray-600 text-xs">Occidentales y budistas</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {guidedMeditations.map(med => (
                <button 
                  key={med.id}
                  onClick={() => startGuided(med)}
                  className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 text-left px-4"
                >
                  <div className="font-medium">{med.name}</div>
                  <div className="text-indigo-200 text-sm">con {med.instructor}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <div className="text-amber-600 text-xl">📊</div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Matriz de Eisenhower</h2>
                <p className="text-gray-600 text-xs">Organiza tus prioridades</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Clasifica tus tareas en 4 cuadrantes y reduce el estrés organizando lo que realmente importa.
            </p>
            <button 
              onClick={() => {beepStart(); setView('eisenhower');}} 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-bold"
            >
              📊 ORGANIZAR AHORA
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500 text-xs">
          <p>Tu camino de sanación con sabiduría milenaria 🙏</p>
        </div>
      </div>
    </div>
  );
}