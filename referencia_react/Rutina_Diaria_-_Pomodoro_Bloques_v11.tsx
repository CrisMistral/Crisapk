import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Plus, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';

export default function RutinaDiaria() {
  const [blocks, setBlocks] = useState([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [blockTotalTime, setBlockTotalTime] = useState(0);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('work');
  const [modalDuration, setModalDuration] = useState(25);
  const [modalLabel, setModalLabel] = useState('');
  const [tasks, setTasks] = useState([
    { text: "☀️ Despertar", done: false },
    { text: "🥐 Desayunar", done: false },
    { text: "💻 Trabajo", done: false },
    { text: "🏃‍♀️ Ejercicio", done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const presets = {
    clasico: [
      { type: 'work', duration: 25, label: 'Trabajo 1' },
      { type: 'break', duration: 5, label: 'Descanso' },
      { type: 'work', duration: 25, label: 'Trabajo 2' },
      { type: 'break', duration: 5, label: 'Descanso' },
      { type: 'work', duration: 25, label: 'Trabajo 3' },
      { type: 'longbreak', duration: 15, label: 'Descanso largo' }
    ],
    intenso: [
      { type: 'work', duration: 45, label: 'Profundo 1' },
      { type: 'break', duration: 10, label: 'Pausa' },
      { type: 'work', duration: 45, label: 'Profundo 2' },
      { type: 'longbreak', duration: 20, label: 'Descanso' }
    ],
    sprint: [
      { type: 'work', duration: 15, label: 'Sprint 1' },
      { type: 'break', duration: 3, label: 'Break' },
      { type: 'work', duration: 15, label: 'Sprint 2' },
      { type: 'break', duration: 3, label: 'Break' },
      { type: 'work', duration: 15, label: 'Sprint 3' },
      { type: 'longbreak', duration: 10, label: 'Descanso' }
    ]
  };

  useEffect(() => {
    loadPreset('clasico');
  }, []);

  useEffect(() => {
    let interval;
    if (sessionRunning && !isPaused && blockTimeLeft > 0) {
      interval = setInterval(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            completeBlock();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionRunning, isPaused, blockTimeLeft]);

  const loadPreset = (name) => {
    if (sessionRunning) return;
    setBlocks(JSON.parse(JSON.stringify(presets[name])));
  };

  const showAddBlockModal = (type) => {
    setModalType(type);
    setModalDuration(type === 'work' ? 25 : type === 'break' ? 5 : 15);
    setModalLabel('');
    setShowModal(true);
  };

  const addBlock = () => {
    if (!modalDuration || modalDuration < 1) return;
    const label = modalLabel.trim() || 
      (modalType === 'work' ? 'Trabajo' : modalType === 'break' ? 'Descanso' : 'Descanso largo');
    setBlocks([...blocks, { type: modalType, duration: modalDuration, label }]);
    setShowModal(false);
  };

  const deleteBlock = (index) => {
    if (sessionRunning) return;
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    if (sessionRunning) return;
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const getTotalTime = () => blocks.reduce((sum, b) => sum + b.duration, 0);

  const startSession = () => {
    if (blocks.length === 0) return;
    setCurrentBlockIndex(0);
    setSessionRunning(true);
    setShowConfig(false);
    startBlock(0);
  };

  const startBlock = (index) => {
    const block = blocks[index];
    const totalSeconds = block.duration * 60;
    setBlockTotalTime(totalSeconds);
    setBlockTimeLeft(totalSeconds);
    setIsPaused(false);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const skipBlock = () => {
    completeBlock();
  };

  const completeBlock = () => {
    const nextIndex = currentBlockIndex + 1;
    if (nextIndex < blocks.length) {
      setTimeout(() => {
        if (window.confirm(`¡Bloque completado!\n\nSiguiente: ${blocks[nextIndex].label}`)) {
          setCurrentBlockIndex(nextIndex);
          startBlock(nextIndex);
        }
      }, 100);
    } else {
      alert('🎉 ¡Sesión completada!');
      resetSession();
    }
  };

  const resetSession = () => {
    setSessionRunning(false);
    setIsPaused(false);
    setCurrentBlockIndex(0);
    setBlockTimeLeft(0);
    setShowConfig(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBlockIcon = (type) => {
    return type === 'work' ? '🔥' : type === 'break' ? '☕' : '🌟';
  };

  const getBlockColor = (type) => {
    return type === 'work' ? '#ff6b6b' : type === 'break' ? '#4dd0e1' : '#ffeb3b';
  };

  const toggleTask = (index) => {
    setTasks(tasks.map((t, i) => i === index ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { text: newTaskText, done: false }]);
    setNewTaskText('');
  };

  const currentBlock = blocks[currentBlockIndex];
  const progress = blockTotalTime > 0 ? ((blockTotalTime - blockTimeLeft) / blockTotalTime) * 100 : 0;
  const sessionProgress = blocks.length > 0 ? Math.round((currentBlockIndex / blocks.length) * 100) : 0;
  const timeRemaining = blocks.slice(currentBlockIndex).reduce((sum, b) => sum + b.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🐨📝</div>
          <h1 className="text-2xl font-bold text-cyan-500">Rutina Diaria</h1>
        </div>

        {/* POMODORO */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h2 className="text-lg font-bold text-cyan-500 mb-3">⏰ Pomodoro por Bloques</h2>

          {showConfig ? (
            <>
              <div className="flex gap-2 mb-4 flex-wrap">
                <button onClick={() => loadPreset('clasico')} className="px-3 py-1.5 text-xs border-2 border-cyan-500 text-cyan-500 rounded-full hover:bg-cyan-500 hover:text-white">
                  Clásico
                </button>
                <button onClick={() => loadPreset('intenso')} className="px-3 py-1.5 text-xs border-2 border-cyan-500 text-cyan-500 rounded-full hover:bg-cyan-500 hover:text-white">
                  Intenso
                </button>
                <button onClick={() => loadPreset('sprint')} className="px-3 py-1.5 text-xs border-2 border-cyan-500 text-cyan-500 rounded-full hover:bg-cyan-500 hover:text-white">
                  Sprint
                </button>
              </div>

              <div className="mb-4">
                <strong className="text-sm">📋 Bloques:</strong>
                <div className="mt-2 space-y-2">
                  {blocks.map((block, i) => (
                    <div key={i} className="bg-gray-50 p-2 rounded-lg flex items-center gap-2" style={{ borderLeft: `4px solid ${getBlockColor(block.type)}` }}>
                      <span>{getBlockIcon(block.type)}</span>
                      <span className="flex-1 text-sm">{block.label} - {block.duration}min</span>
                      <button onClick={() => moveBlock(i, -1)} className="p-1 hover:bg-gray-200 rounded"><ChevronUp size={16} /></button>
                      <button onClick={() => moveBlock(i, 1)} className="p-1 hover:bg-gray-200 rounded"><ChevronDown size={16} /></button>
                      <button onClick={() => deleteBlock(i)} className="p-1 hover:bg-gray-200 rounded"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <strong className="text-sm">➕ Agregar:</strong>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button onClick={() => showAddBlockModal('work')} className="px-3 py-2 text-xs bg-red-500 text-white rounded-full hover:bg-red-600">
                    🔥 Trabajo
                  </button>
                  <button onClick={() => showAddBlockModal('break')} className="px-3 py-2 text-xs bg-cyan-500 text-white rounded-full hover:bg-cyan-600">
                    ☕ Descanso
                  </button>
                  <button onClick={() => showAddBlockModal('longbreak')} className="px-3 py-2 text-xs bg-yellow-400 text-gray-800 rounded-full hover:bg-yellow-500">
                    🌟 Largo
                  </button>
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg text-xs mb-4">
                <div>⏱️ Tiempo total: <strong>{getTotalTime()} min</strong></div>
                <div>📊 <strong>{blocks.length}</strong> bloques</div>
              </div>

              <button onClick={startSession} className="w-full bg-green-500 text-white py-3 rounded-full font-bold hover:bg-green-600">
                ▶️ INICIAR SESIÓN
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="text-lg font-bold mb-2" style={{ color: getBlockColor(currentBlock?.type) }}>
                  {getBlockIcon(currentBlock?.type)} {currentBlock?.label?.toUpperCase()}
                </div>
                <div className="text-4xl font-bold mb-3">{formatTime(blockTimeLeft)}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="flex gap-2 justify-center mb-3 flex-wrap">
                  {blocks.map((block, i) => (
                    <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border-2 ${
                      i < currentBlockIndex ? 'bg-green-500 border-green-500 text-white' :
                      i === currentBlockIndex ? 'bg-cyan-500 border-cyan-500 text-white' :
                      'bg-gray-100 border-gray-300'
                    }`}>
                      {getBlockIcon(block.type)}
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-4">
                  <div>Bloque {currentBlockIndex + 1} de {blocks.length}</div>
                  <div>Sesión: {sessionProgress}%</div>
                  <div>Restante: {timeRemaining} min</div>
                </div>

                <div className="flex gap-2 justify-center">
                  <button onClick={pauseSession} className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600">
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  </button>
                  <button onClick={skipBlock} className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm hover:bg-gray-600">
                    <SkipForward size={16} />
                  </button>
                  <button onClick={resetSession} className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* TAREAS */}
        <div>
          <h2 className="text-lg font-bold text-cyan-500 mb-3">📋 Tareas del Día</h2>
          <div className="space-y-2 mb-3">
            {tasks.map((task, i) => (
              <div key={i} onClick={() => toggleTask(i)} className={`bg-gray-50 p-3 rounded-lg flex items-center gap-3 cursor-pointer ${task.done ? 'opacity-60 line-through' : ''}`} style={{ borderLeft: task.done ? '4px solid #4dd0e1' : '4px solid transparent' }}>
                <div className={`w-5 h-5 rounded-full border-2 border-cyan-500 flex items-center justify-center ${task.done ? 'bg-cyan-500 text-white' : ''}`}>
                  {task.done && '✓'}
                </div>
                <span className="flex-1 text-sm">{task.text}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteTask(i); }} className="text-red-500 hover:bg-red-100 p-1 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Nueva tarea..."
              className="flex-1 px-3 py-2 border-2 border-cyan-500 rounded-lg text-sm"
            />
            <button onClick={addTask} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-cyan-500">Agregar Bloque</h3>
                <button onClick={() => setShowModal(false)}><X size={24} /></button>
              </div>
              <input
                type="number"
                value={modalDuration}
                onChange={(e) => setModalDuration(parseInt(e.target.value) || 0)}
                placeholder="Minutos"
                min="1"
                max="120"
                className="w-full px-3 py-2 border-2 border-cyan-500 rounded-lg mb-3"
              />
              <input
                type="text"
                value={modalLabel}
                onChange={(e) => setModalLabel(e.target.value)}
                placeholder="Etiqueta (opcional)"
                className="w-full px-3 py-2 border-2 border-cyan-500 rounded-lg mb-4"
              />
              <button onClick={addBlock} className="w-full bg-cyan-500 text-white py-3 rounded-full font-bold hover:bg-cyan-600">
                Agregar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}