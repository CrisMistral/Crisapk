import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Home, Sun, Sunset, Moon, Heart, CheckCircle, Dumbbell, Utensils, Brain, Sparkles, User, Gamepad2 } from 'lucide-react';

const CrisApp = () => {
  const [view, setView] = useState('welcome');
  const [timeOfDay, setTimeOfDay] = useState('mañana');
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [audio, setAudio] = useState(true);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [audioText, setAudioText] = useState('');
  const [step, setStep] = useState(0);
  const [meal, setMeal] = useState('comida');
  const [sleepPhase, setSleepPhase] = useState('skincare');
  const [emotion, setEmotion] = useState('');
  const [interest, setInterest] = useState('violin');
  const [sudoku, setSudoku] = useState([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
  const [solved, setSolved] = useState(false);
  const timerRef = useRef(null);

  const speak = (text) => {
    if (audio && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'es-ES';
      u.rate = 0.9;
      speechSynthesis.speak(u);
    }
  };

  const exercises = [
    { name: "Puente de glúteos", dur: 60, inst: "Acuéstate boca arriba, flexiona rodillas y eleva cadera", 
      audio: [{t:0,txt:"Comenzamos puente de glúteos. Acuéstate boca arriba"},{t:10,txt:"Eleva la cadera, aprieta glúteos"},{t:25,txt:"Baja y sube controlado"},{t:55,txt:"Muy bien, siguiente ejercicio"}]},
    { name: "Almeja", dur: 60, inst: "De lado, abre y cierra rodilla superior",
      audio: [{t:0,txt:"Almeja. Túmbate de lado"},{t:10,txt:"Abre rodilla como almeja"},{t:25,txt:"Controla el movimiento"},{t:55,txt:"Perfecto, cambiamos"}]},
    { name: "Arrastre en pared", dur: 60, inst: "Desliza brazos por pared arriba y abajo",
      audio: [{t:0,txt:"Movilidad. Frente a la pared"},{t:10,txt:"Desliza brazos arriba"},{t:25,txt:"Baja despacio"},{t:55,txt:"Último movimiento"}]},
    { name: "Monster walk", dur: 60, inst: "Con banda, camina lateral",
      audio: [{t:0,txt:"Monster walk. Banda en pies"},{t:10,txt:"Da paso lateral con tensión"},{t:25,txt:"Mantén postura"},{t:55,txt:"Excelente trabajo"}]},
    { name: "Rotadores 90/90", dur: 60, inst: "Sentada, rota piernas manteniendo 90°",
      audio: [{t:0,txt:"Último. Siéntate en L"},{t:10,txt:"Rota piernas a un lado"},{t:25,txt:"Cambia al otro lado"},{t:55,txt:"Completaste la rutina"}]}
  ];

  const recipes = {
    lunes: {
      comida: { name: "Ensalada pollo aguacate", time: "15min", ing: ["pollo","aguacate","lechuga","aceite"], 
        steps: ["Cocina pollo en sartén","Corta aguacate","Corta lechuga y tomates","Corta pollo en tiras","Mezcla todo con aceite","¡Listo! Rico en triptófano"]},
      cena: { name: "Salmón arroz integral", time: "18min", ing: ["salmón","arroz","espinacas","limón"],
        steps: ["Hierve arroz 15min","Sazona salmón con limón","Cocina salmón 4min/lado","Saltea espinacas con ajo","Sirve todo junto","Cena perfecta para descansar"]}
    }
  };

  const cleaning = {
    lunes: { zone: "Cocina", min: 15, tasks: ["Encimeras","Platos","Fogones","Suelo"],
      facts: ["Limpiar libera endorfinas","Espacio ordenado = calma cerebral","Limpiar purifica el alma - filosofía japonesa"]},
    martes: { zone: "Baño", min: 12, tasks: ["Espejo","Lavabo","Ducha","Suelo"],
      facts: ["Limpiar activa la corteza prefrontal","Espejos limpios mejoran ánimo","Tareas pequeñas liberan dopamina"]}
  };

  const sleepData = {
    skincare: { name: "Cuidado facial", dur: 300, audio: [{t:0,txt:"Cuidado facial. Respira y concéntrate"},{t:30,txt:"Limpia suavemente con círculos"},{t:90,txt:"Aplica crema hidratante"},{t:210,txt:"Masajea entrecejo en sentido horario - glándula pituitaria"},{t:270,txt:"Respiraciones profundas"}]},
    movement: { name: "Movimiento suave", dur: 480, audio: [{t:0,txt:"Movimientos suaves para descanso"},{t:30,txt:"Estira brazos arriba"},{t:90,txt:"Gira cabeza suave"},{t:150,txt:"Rota hombros atrás"},{t:270,txt:"Estira piernas"},{t:420,txt:"Cuerpo listo para dormir"}]},
    meditation: { name: "Meditación", dur: 600, audio: [{t:0,txt:"Hora de soltar el día. Posición cómoda"},{t:90,txt:"Cada exhalación suelta preocupaciones"},{t:210,txt:"Tu cuerpo se hunde en calma"},{t:330,txt:"Has sido suficiente hoy"},{t:450,txt:"Con amor dejo atrás el día y me sumerjo en un sueño tranquilo"},{t:540,txt:"En la seguridad de que el mañana cuidará de sí mismo"}]}
  };

  const emotions = {
    ansiedad: { tech: "Respiración 4-7-8", inst: "Inhala 4s, mantén 7s, exhala 8s. Repite 3 veces", col: "bg-blue-100"},
    bloqueo: { tech: "Técnica 5-4-3-2-1", inst: "5 cosas que ves, 4 tocas, 3 escuchas, 2 hueles, 1 saboreas", col: "bg-green-100"},
    hiper: { tech: "Presión sensorial", inst: "Presiona sienes suavemente y respira 10 veces", col: "bg-purple-100"}
  };

  const interests = {
    violin: {
      name: "Violín",
      lessons: [
        { title: "Postura correcta", dur: 300, audio: [{t:0,txt:"Hoy aprendemos la postura. Coloca el violín en tu hombro izquierdo"},{t:30,txt:"La barbilla descansa suavemente sobre la mentonera"},{t:90,txt:"El brazo izquierdo sostiene el mástil sin tensión"},{t:150,txt:"El arco se sujeta con el pulgar y dedos relajados"},{t:240,txt:"Practica mantener esta postura unos segundos"}]},
        { title: "Cuerdas al aire", dur: 300, audio: [{t:0,txt:"Vamos a tocar las cuerdas al aire. Empezamos con la cuerda Sol"},{t:60,txt:"Desliza el arco suavemente de arriba a abajo"},{t:120,txt:"Ahora la cuerda Re, mantén el mismo movimiento"},{t:180,txt:"Continúa con La y Mi"},{t:240,txt:"Excelente, siente el sonido de cada cuerda"}]},
        { title: "Primera escala", dur: 300, audio: [{t:0,txt:"Hoy tu primera escala. Coloca el primer dedo en la cuerda Re"},{t:60,txt:"Toca Re, Mi, Fa sostenido"},{t:150,txt:"Ahora en la cuerda La: La, Si, Do sostenido"},{t:240,txt:"Has tocado tu primera escala. Respira y siente el logro"}]}
      ]
    },
    neuro: {
      name: "Neurociencia",
      lessons: [
        { title: "El cerebro TDAH", dur: 300, audio: [{t:0,txt:"El cerebro con TDAH tiene diferencias hermosas. No es un defecto"},{t:60,txt:"La dopamina funciona diferente, buscamos novedad"},{t:150,txt:"La corteza prefrontal madura más despacio, pero madura"},{t:240,txt:"Tu cerebro es único y tiene superpoderes creativos"}]},
        { title: "La dopamina", dur: 300, audio: [{t:0,txt:"La dopamina es el neurotransmisor de la motivación"},{t:60,txt:"En TDAH hay menos receptores de dopamina disponibles"},{t:150,txt:"Por eso buscamos estímulos que nos den ese chispazo"},{t:240,txt:"Entender esto te ayuda a ser más amable contigo"}]},
        { title: "Neuroplasticidad", dur: 300, audio: [{t:0,txt:"Tu cerebro puede cambiar toda la vida. Se llama neuroplasticidad"},{t:90,txt:"Cada vez que practicas algo, creas nuevas conexiones"},{t:180,txt:"La repetición con amabilidad crea autopistas neuronales"},{t:270,txt:"Eres capaz de entrenar tu atención poco a poco"}]}
      ]
    },
    history: {
      name: "Historia",
      lessons: [
        { title: "Antigua Roma", dur: 300, audio: [{t:0,txt:"Roma no se construyó en un día, literalmente. Tardó 8 siglos"},{t:90,txt:"Los romanos inventaron el concreto, por eso sus edificios duran"},{t:180,txt:"Tenían calefacción por suelo radiante hace 2000 años"},{t:270,txt:"La ingeniería romana sigue asombrándonos hoy"}]},
        { title: "Renacimiento", dur: 300, audio: [{t:0,txt:"El Renacimiento fue cuando Europa redescubrió el arte y ciencia"},{t:90,txt:"Leonardo da Vinci era disléxico y posiblemente tenía TDAH"},{t:180,txt:"Su mente dispersa le permitía conectar ideas únicas"},{t:270,txt:"Las mentes diferentes han cambiado el mundo"}]},
        { title: "Era Vikinga", dur: 300, audio: [{t:0,txt:"Los vikingos no solo eran guerreros, eran exploradores"},{t:90,txt:"Llegaron a América 500 años antes que Colón"},{t:180,txt:"Tenían democracia y las mujeres podían divorciarse"},{t:270,txt:"Eran más avanzados de lo que nos cuentan"}]}
      ]
    }
  };

  const initSudoku = () => {
    const puzzle = [
      [1,0,0,4],
      [0,4,1,0],
      [0,1,4,0],
      [4,0,0,1]
    ];
    setSudoku(puzzle);
    setSolved(false);
  };

  const checkSudoku = () => {
    const solution = [
      [1,2,3,4],
      [3,4,1,2],
      [2,1,4,3],
      [4,3,2,1]
    ];
    const correct = sudoku.every((row, i) => row.every((cell, j) => cell === solution[i][j]));
    if (correct) {
      setSolved(true);
      if (audio) speak("¡Perfecto! Has resuelto el sudoku. Tu mente lógica está activa");
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('mañana');
    else if (hour < 20) setTimeOfDay('tarde');
    else setTimeOfDay('noche');
    initSudoku();
  }, []);

  useEffect(() => {
    if (isRunning && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
        
        if (view === 'exercise') {
          const elapsed = exercises[exerciseIdx].dur - timer;
          const inst = exercises[exerciseIdx].audio.find(a => a.t === elapsed);
          if (inst) { setAudioText(inst.txt); speak(inst.txt); }
        }
        
        if (view === 'sleep') {
          const elapsed = sleepData[sleepPhase].dur - timer;
          const inst = sleepData[sleepPhase].audio.find(a => a.t === elapsed);
          if (inst) { setAudioText(inst.txt); speak(inst.txt); }
        }
        
        if (view === 'cleaning') {
          const elapsed = cleaning.lunes.min * 60 - timer;
          if (elapsed > 0 && elapsed % 180 === 0) {
            const fact = cleaning.lunes.facts[Math.floor(elapsed/180) % 3];
            setAudioText(fact); speak(fact);
          }
        }

        if (view === 'interests') {
          const lesson = interests[interest].lessons[0];
          const elapsed = lesson.dur - timer;
          const inst = lesson.audio.find(a => a.t === elapsed);
          if (inst) { setAudioText(inst.txt); speak(inst.txt); }
        }
      }, 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      setAudioText('');
      if (navigator.vibrate) navigator.vibrate([200,100,200]);
      if (audio) speak("Completado. ¡Muy bien!");
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, isRunning, view, audio, exerciseIdx, sleepPhase]);

  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const Quokka = () => <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-3xl">🦘</div>;

  const ModCard = ({icon,title,sub,color,onClick}) => (
    <button onClick={onClick} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className={`${color} text-white p-3 rounded-lg mb-3 mx-auto w-fit`}>{icon}</div>
      <h3 className="font-medium text-gray-800 text-sm">{title}</h3>
      <p className="text-xs text-gray-500">{sub}</p>
    </button>
  );

  if (view === 'welcome') return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-white p-6">
      <Quokka />
      <h1 className="text-3xl font-light text-teal-700 mb-2">Hola, soy Cris</h1>
      <p className="text-lg text-gray-600 text-center mb-8 max-w-sm">Hoy puedes avanzar suave, sin exigencia</p>
      <div className="w-full max-w-sm space-y-3 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-1 text-sm">💫 Historia</h3>
          <p className="text-xs text-gray-600">Los japoneses reparan con oro (kintsugi) haciendo objetos más bellos</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-1 text-sm">🧠 Filosofía</h3>
          <p className="text-xs text-gray-600">Ikigai: hacer lo que amas, necesitas y puedes ofrecer</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-700 mb-1 text-sm">🌿 Naturaleza</h3>
          <p className="text-xs text-gray-600">Los quokkas sonríen y viven en comunidades donde se cuidan</p>
        </div>
      </div>
      <button onClick={() => setView('main')} className="w-full max-w-sm bg-teal-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-teal-600">
        Comenzar el día
      </button>
    </div>
  );

  if (view === 'main') return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Quokka />
          <div className="flex space-x-2">
            {['mañana','tarde','noche'].map(t => (
              <button key={t} onClick={() => setTimeOfDay(t)} className={`p-3 rounded-lg ${timeOfDay===t?'bg-teal-500 text-white':'bg-gray-100'}`}>
                {t==='mañana'?<Sun className="w-5 h-5"/>:t==='tarde'?<Sunset className="w-5 h-5"/>:<Moon className="w-5 h-5"/>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-2 gap-4">
        <ModCard icon={<Dumbbell className="w-8 h-8"/>} title="Ejercicio" sub="30 min" color="bg-teal-500" onClick={() => setView('exercise')}/>
        <ModCard icon={<Utensils className="w-8 h-8"/>} title="Comida" sub="Recetas" color="bg-green-500" onClick={() => setView('food')}/>
        <ModCard icon={<Brain className="w-8 h-8"/>} title="Estudio" sub="Pomodoro" color="bg-blue-500" onClick={() => setView('study')}/>
        <ModCard icon={<Heart className="w-8 h-8"/>} title="Regulación" sub="Check-in" color="bg-pink-500" onClick={() => setView('emotion')}/>
        <ModCard icon={<Sparkles className="w-8 h-8"/>} title="Limpieza" sub="15 min" color="bg-yellow-500" onClick={() => setView('cleaning')}/>
        <ModCard icon={<Moon className="w-8 h-8"/>} title="Sueño" sub="Rutina" color="bg-purple-500" onClick={() => setView('sleep')}/>
        <ModCard icon={<User className="w-8 h-8"/>} title="Intereses" sub="Aprende" color="bg-indigo-500" onClick={() => setView('interests')}/>
        <ModCard icon={<Gamepad2 className="w-8 h-8"/>} title="Lógica" sub="Juego" color="bg-orange-500" onClick={() => setView('logic')}/>
      </div>
    </div>
  );

  if (view === 'exercise') {
    const ex = exercises[exerciseIdx];
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('main')} className="p-2"><Home className="w-6 h-6"/></button>
            <h1 className="text-xl font-medium">Ejercicio</h1>
          </div>
          <button onClick={() => setAudio(!audio)} className={`p-2 rounded-lg ${audio?'bg-teal-500 text-white':'bg-gray-100'}`}>🔊</button>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-xl p-6">
            <div className="flex justify-center space-x-2 mb-4">
              {exercises.map((_,i) => <div key={i} className={`w-3 h-3 rounded-full ${i===exerciseIdx?'bg-teal-500':i<exerciseIdx?'bg-teal-200':'bg-gray-200'}`}/>)}
            </div>
            <h2 className="text-lg font-medium text-center mb-2">{ex.name}</h2>
            <div className="w-32 h-32 bg-teal-100 rounded-lg mx-auto mb-4 flex items-center justify-center text-4xl">🏃‍♀️</div>
            <p className="text-center text-gray-600 mb-4">{ex.inst}</p>
            {audio && audioText && <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4"><p className="text-sm text-teal-700 text-center">🔊 {audioText}</p></div>}
            <div className="text-center mb-6">
              <div className="text-4xl font-mono text-teal-600 mb-2">{fmt(timer)}</div>
              <div className="flex justify-center space-x-4">
                <button onClick={() => {if(timer===0)setTimer(ex.dur); setIsRunning(!isRunning); if(!isRunning && audio)speak(`Comenzamos ${ex.name}`)}} 
                  className="bg-teal-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
                  {isRunning?<Pause className="w-5 h-5"/>:<Play className="w-5 h-5"/>}
                  <span>{isRunning?'Pausar':'Iniciar'}</span>
                </button>
                <button onClick={() => {setTimer(ex.dur); setIsRunning(false); setAudioText(''); speechSynthesis.cancel()}} 
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5"/><span>Reset</span>
                </button>
              </div>
            </div>
            <button onClick={() => {
              speechSynthesis.cancel();
              if(exerciseIdx < exercises.length-1) {setExerciseIdx(exerciseIdx+1); setTimer(exercises[exerciseIdx+1].dur); setIsRunning(false); setAudioText('')}
              else {if(audio)speak("¡Felicidades! Completaste la rutina"); setView('main'); setExerciseIdx(0); setAudioText('')}
            }} className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium">
              {exerciseIdx < exercises.length-1 ? 'Siguiente ejercicio':'Completar rutina'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'food') {
    const rec = recipes.lunes[meal];
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('main')} className="p-2"><Home className="w-6 h-6"/></button>
            <h1 className="text-xl font-medium">Recetas</h1>
          </div>
          <button onClick={() => setAudio(!audio)} className={`p-2 rounded-lg ${audio?'bg-green-500 text-white':'bg-gray-100'}`}>🔊</button>
        </div>
        <div className="p-6">
          <div className="flex space-x-2 mb-4">
            {['comida','cena'].map(m => <button key={m} onClick={() => {setMeal(m);setStep(0)}} className={`px-4 py-2 rounded-lg ${meal===m?'bg-green-500 text-white':'bg-gray-200'}`}>{m}</button>)}
          </div>
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-medium text-center mb-2">{rec.name}</h2>
            <p className="text-center text-green-600 mb-4">⏱️ {rec.time}</p>
            <div className="mb-4">
              <h3 className="font-medium mb-2 text-sm">Ingredientes:</h3>
              <ul className="text-sm text-gray-600 space-y-1">{rec.ing.map((i,idx) => <li key={idx}>• {i}</li>)}</ul>
            </div>
            {audio && audioText && <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"><p className="text-sm text-green-700 text-center">🔊 {audioText}</p></div>}
            <div className="mb-4">
              <p className="font-medium mb-2 text-sm">Paso {step+1} de {rec.steps.length}:</p>
              <p className="text-gray-700">{rec.steps[step]}</p>
            </div>
            <div className="flex space-x-2">
              {step>0 && <button onClick={() => setStep(step-1)} className="flex-1 bg-gray-200 py-3 rounded-lg">← Anterior</button>}
              <button onClick={() => {setAudioText(rec.steps[step]); speak(rec.steps[step])}} className="flex-1 bg-green-500 text-white py-3 rounded-lg">🔊 Reproducir</button>
              {step<rec.steps.length-1 && <button onClick={() => setStep(step+1)} className="flex-1 bg-green-500 text-white py-3 rounded-lg">Siguiente →</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'cleaning') {
    const task = cleaning.lunes;
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('main')} className="p-2"><Home className="w-6 h-6"/></button>
            <h1 className="text-xl font-medium">Limpieza</h1>
          </div>
          <button onClick={() => setAudio(!audio)} className={`p-2 rounded-lg ${audio?'bg-yellow-500 text-white':'bg-gray-100'}`}>🔊</button>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-medium text-center mb-2">Hoy: {task.zone}</h2>
            <p className="text-center text-yellow-600 mb-4">⏱️ {task.min} minutos</p>
            <div className="mb-6">
              <h3 className="font-medium mb-3">Tareas:</h3>
              {task.tasks.map((t,i) => <div key={i} className="flex items-center space-x-3 mb-2">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-gray-400"/></div>
                <span>{t}</span>
              </div>)}
            </div>
            <button onClick={() => {setTimer(task.min*60); setIsRunning(true); if(audio)speak(`Comenzamos ${task.zone}. Te acompaño con curiosidades`)}} 
              className="w-full bg-yellow-500 text-white py-4 rounded-lg mb-4">
              {isRunning ? `🕐 ${fmt(timer)}` : 'Comenzar limpieza'}
            </button>
            {isRunning && audio && audioText && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2 text-sm">💡 ¿Sabías que...?</h4>
              <p className="text-sm text-yellow-700">{audioText}</p>
            </div>}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'sleep') {
    const phase = sleepData[sleepPhase];
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('main')} className="p-2"><Home className="w-6 h-6"/></button>
            <h1 className="text-xl font-medium">Rutina Nocturna</h1>
          </div>
          <button onClick={() => setAudio(!audio)} className={`p-2 rounded-lg ${audio?'bg-purple-500 text-white':'bg-gray-100'}`}>🔊</button>
        </div>
        <div className="p-6">
          <div className="flex space-x-2 mb-4">
            {Object.keys(sleepData).map(p => <button key={p} onClick={() => setSleepPhase(p)} className={`px-3 py-2 rounded-lg text-xs ${sleepPhase===p?'bg-purple-500 text-white':'bg-gray-200'}`}>
              {p==='skincare'?'✨':'movement'?'🧘':'🌙'}
            </button>)}
          </div>
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-medium text-center mb-4">{phase.name}</h2>
            <div className="w-32 h-32 bg-purple-100 rounded-lg mx-auto mb-6 flex items-center justify-center text-4xl">
              {sleepPhase==='skincare'?'✨':sleepPhase==='movement'?'🧘':'🌙'}
            </div>
            {audio && audioText && <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4"><p className="text-sm text-purple-700 text-center">🔊 {audioText}</p></div>}
            <div className="text-center mb-6">
              <div className="text-4xl font-mono text-purple-600 mb-4">{fmt(timer)}</div>
              <button onClick={() => {setTimer(phase.dur); setIsRunning(!isRunning); if(!isRunning && audio)speak(phase.audio[0]?.txt)}} 
                className="bg-purple-500 text-white px-8 py-4 rounded-lg font-medium">
                {isRunning?'Pausar':`Comenzar ${phase.name}`}
              </button>
            </div>
            {sleepPhase==='meditation' && <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-purple-700 font-medium italic text-sm">"Con amor dejo atrás el día y me sumerjo en un sueño tranquilo, en la seguridad de que el mañana cuidará de sí mismo"</p>
            </div>}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'emotion') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center space-x-4">
          <button onClick={() => setView('main')} className="p-2"><Home className="w-6 h-6"/></button>
          <h1 className="text-xl font-medium">Check-in Emocional</h1>
        </div>
        <div className="p-6">
          {!emotion ? <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-medium text-center mb-6">¿Cómo te sientes?</h2>
            <div className="space-y-4">{Object.keys(emotions).map(e => 
              <button key={e} onClick={() => setEmotion(e)} className="w-full p-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100">
                <span className="font-medium capitalize">{e}</span>
              </button>
            )}</div>
          </div> : <div className={`${emotions[emotion].col} rounded-xl p-6`}>
            <h2 className="text-lg font-medium text-center mb-4">{emotions[emotion].tech}</h2>
            <p className="text-center text-gray-700 mb-6">{emotions[emotion].inst}</p>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto"><Heart className="w-8 h-8 text-pink-500"/></div>
              <button onClick={() => setEmotion('')} className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium">Nuevo check-in</button>
            </div>
          </div>}
        </div>
      </div>
    );
  }

  if (view === 'study') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center space-x-4">
          <button onClick={() => setView('main')} className="p-2"><Home className="w-6 h-6"/></button>
          <h1 className="text-xl font-medium">Estudio</h1>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-light text-gray-800 mb-8">Pomodoro</h2>
            <div className="text-6xl font-mono text-blue-600 mb-8">{fmt(timer)}</div>
            <div className="flex justify-center space-x-4 mb-8">
              <button onClick={() => {setTimer(25*60);setIsRunning(false)}} className="bg-blue-500 text-white px-4 py-2 rounded-lg">25 min</button>
              <button onClick={() => {setTimer(45*60);setIsRunning(false)}} className="bg-blue-500 text-white px-4 py-2 rounded-lg">45 min</button>
              <button onClick={() => {setTimer(5*60);setIsRunning(false)}} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">5 min</button>
            </div>
            <button onClick={() => {if(timer===0)setTimer(25*60); setIsRunning(!isRunning)}} className="w-full bg-blue-500 text-white py-4 rounded-lg text-lg font-medium mb-4">
              {isRunning?'Pausar':'Iniciar'}
            </button>
            <button onClick={() => setView('emotion')} className="w-full bg-pink-100 text-pink-700 py-3 rounded-lg font-medium">
              Estoy bloqueada 😔
            </button>
            <p className="text-sm text-gray-500 mt-6">No quieres estar en redes 🌱</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'interests') {
    const topic = interests[interest];
    const lesson = topic.lessons[0];
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('main')} className="p-2"><Home className="w-6 h-6"/></button>
            <h1 className="text-xl font-medium">Intereses</h1>
          </div>
          <button onClick={() => setAudio(!audio)} className={`p-2 rounded-lg ${audio?'bg-indigo-500 text-white':'bg-gray-100'}`}>🔊</button>
        </div>
        <div className="p-6">
          <div className="flex space-x-2 mb-4">
            {Object.keys(interests).map(i => 
              <button key={i} onClick={() => setInterest(i)} className={`px-3 py-2 rounded-lg text-xs ${interest===i?'bg-indigo-500 text-white':'bg-gray-200'}`}>
                {i==='violin'?'🎻':i==='neuro'?'🧠':'📜'} {interests[i].name}
              </button>
            )}
          </div>
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-medium text-center mb-4">{lesson.title}</h2>
            <div className="w-32 h-32 bg-indigo-100 rounded-lg mx-auto mb-6 flex items-center justify-center text-4xl">
              {interest==='violin'?'🎻':interest==='neuro'?'🧠':'📜'}
            </div>
            {audio && audioText && <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-indigo-700 text-center">🔊 {audioText}</p>
            </div>}
            <div className="text-center mb-6">
              <div className="text-4xl font-mono text-indigo-600 mb-4">{fmt(timer)}</div>
              <button onClick={() => {setTimer(lesson.dur); setIsRunning(!isRunning); if(!isRunning && audio)speak(lesson.audio[0]?.txt)}} 
                className="bg-indigo-500 text-white px-8 py-4 rounded-lg font-medium">
                {isRunning?'Pausar':'Comenzar lección'}
              </button>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-indigo-700 text-sm text-center">Cápsula diaria de 5 minutos para aprender algo nuevo cada día</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'logic') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-4 shadow-sm flex items-center space-x-4">
          <button onClick={() => setView('main')} className="p-2"><Home className="w-6 h-6"/></button>
          <h1 className="text-xl font-medium">Sudoku 4x4</h1>
        </div>
        <div className="p-6">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-lg font-medium text-center mb-6">Completa con números del 1 al 4</h2>
            <div className="grid grid-cols-4 gap-2 mb-6 max-w-xs mx-auto">
              {sudoku.map((row, i) => row.map((cell, j) => (
                <div key={`${i}-${j}`} className={`aspect-square ${cell===0?'bg-orange-50':'bg-orange-200'} rounded-lg flex items-center justify-center`}>
                  {cell === 0 ? (
                    <input 
                      type="number" 
                      min="1" 
                      max="4"
                      className="w-full h-full text-center text-2xl font-bold bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        if (val >= 1 && val <= 4) {
                          const newSudoku = sudoku.map(r => [...r]);
                          newSudoku[i][j] = val;
                          setSudoku(newSudoku);
                        }
                      }}
                    />
                  ) : (
                    <span className="text-2xl font-bold text-orange-700">{cell}</span>
                  )}
                </div>
              )))}
            </div>
            {solved ? (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                <p className="text-green-700 text-center font-medium">¡Perfecto! 🎉 Has resuelto el sudoku</p>
              </div>
            ) : null}
            <div className="flex space-x-2">
              <button onClick={checkSudoku} className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium">
                Verificar
              </button>
              <button onClick={initSudoku} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium">
                Nuevo juego
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">Un juego diario para activar la mente sin distracciones</p>
          </div>
        </div>
      </div>
    );
  }

  return <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">{view === 'main' ? <MainScreen /> : null}</div>;
};

export default CrisApp;