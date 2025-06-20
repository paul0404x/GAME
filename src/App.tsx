import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX, Settings, Save, Loader as Load } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  image: string;
  position: 'left' | 'center' | 'right';
}

interface Choice {
  id: string;
  text: string;
  nextScene: string;
  consequences?: {
    reputation?: number;
    money?: number;
    environment?: number;
  };
}

interface Scene {
  id: string;
  background: string;
  characters: Character[];
  dialogue: {
    speaker: string;
    text: string;
  }[];
  choices?: Choice[];
  music?: string;
  effects?: string[];
}

const gameData: Scene[] = [
  {
    id: 'intro',
    background: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    characters: [],
    dialogue: [
      {
        speaker: 'Narrador',
        text: 'Bienvenido a WELL OF POWER, una historia sobre las decisiones que moldean el futuro de la industria petrolera.'
      },
      {
        speaker: 'Narrador',
        text: 'Eres el nuevo CEO de PetroMax, una empresa petrolera en un momento crucial de su historia.'
      }
    ],
    choices: [
      {
        id: 'start',
        text: 'Comenzar la aventura',
        nextScene: 'office_intro'
      }
    ]
  },
  {
    id: 'office_intro',
    background: 'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg',
    characters: [
      {
        id: 'assistant',
        name: 'Sarah Martinez',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        position: 'right'
      }
    ],
    dialogue: [
      {
        speaker: 'Sarah Martinez',
        text: 'Buenos días, CEO. Soy Sarah Martinez, su asistente ejecutiva. Tenemos una situación urgente que requiere su atención inmediata.'
      },
      {
        speaker: 'Sarah Martinez',
        text: 'Hemos descubierto un nuevo yacimiento petrolero en la región amazónica, pero los grupos ambientalistas están protestando.'
      }
    ],
    choices: [
      {
        id: 'listen_environmentalists',
        text: 'Escuchar a los ambientalistas primero',
        nextScene: 'environmental_meeting',
        consequences: { reputation: 10, environment: 15 }
      },
      {
        id: 'ignore_protests',
        text: 'Proceder con la extracción inmediatamente',
        nextScene: 'drilling_decision',
        consequences: { money: 20, environment: -10, reputation: -5 }
      },
      {
        id: 'seek_compromise',
        text: 'Buscar un compromiso entre ambas partes',
        nextScene: 'negotiation_room',
        consequences: { reputation: 5, environment: 5 }
      }
    ]
  },
  {
    id: 'environmental_meeting',
    background: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    characters: [
      {
        id: 'environmentalist',
        name: 'Dr. Elena Rodriguez',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        position: 'left'
      }
    ],
    dialogue: [
      {
        speaker: 'Dr. Elena Rodriguez',
        text: 'Gracias por recibirnos, CEO. Soy la Dra. Elena Rodriguez, representante de la Coalición Verde.'
      },
      {
        speaker: 'Dr. Elena Rodriguez',
        text: 'Este yacimiento está en una zona de biodiversidad crítica. Su extracción podría destruir ecosistemas únicos.'
      },
      {
        speaker: 'Dr. Elena Rodriguez',
        text: '¿Estaría dispuesto a considerar tecnologías de extracción más limpias, aunque sean más costosas?'
      }
    ],
    choices: [
      {
        id: 'accept_clean_tech',
        text: 'Invertir en tecnología limpia',
        nextScene: 'clean_tech_path',
        consequences: { environment: 20, money: -15, reputation: 15 }
      },
      {
        id: 'reject_proposal',
        text: 'Rechazar la propuesta por costos',
        nextScene: 'conflict_escalation',
        consequences: { money: 10, environment: -15, reputation: -10 }
      },
      {
        id: 'request_time',
        text: 'Pedir tiempo para evaluar opciones',
        nextScene: 'evaluation_period',
        consequences: { reputation: 5 }
      }
    ]
  },
  {
    id: 'drilling_decision',
    background: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
    characters: [
      {
        id: 'engineer',
        name: 'Carlos Mendez',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
        position: 'center'
      }
    ],
    dialogue: [
      {
        speaker: 'Carlos Mendez',
        text: 'CEO, soy Carlos Mendez, jefe de operaciones. Los equipos están listos para comenzar la perforación.'
      },
      {
        speaker: 'Carlos Mendez',
        text: 'Sin embargo, debo informarle que las protestas se han intensificado. Hay riesgo de confrontaciones.'
      },
      {
        speaker: 'Carlos Mendez',
        text: '¿Procedemos con la operación o esperamos a que se calme la situación?'
      }
    ],
    choices: [
      {
        id: 'proceed_drilling',
        text: 'Proceder con la perforación',
        nextScene: 'drilling_consequences',
        consequences: { money: 25, environment: -20, reputation: -15 }
      },
      {
        id: 'wait_situation',
        text: 'Esperar a que se calme la situación',
        nextScene: 'waiting_game',
        consequences: { reputation: 5, money: -5 }
      },
      {
        id: 'increase_security',
        text: 'Aumentar la seguridad y proceder',
        nextScene: 'security_measures',
        consequences: { money: 15, environment: -15, reputation: -10 }
      }
    ]
  },
  {
    id: 'negotiation_room',
    background: 'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg',
    characters: [
      {
        id: 'mediator',
        name: 'Judge Patricia Wilson',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
        position: 'center'
      }
    ],
    dialogue: [
      {
        speaker: 'Judge Patricia Wilson',
        text: 'Bienvenidos a esta sesión de mediación. Soy la Jueza Patricia Wilson.'
      },
      {
        speaker: 'Judge Patricia Wilson',
        text: 'Ambas partes han acordado buscar una solución que beneficie tanto a la empresa como al medio ambiente.'
      },
      {
        speaker: 'Judge Patricia Wilson',
        text: '¿Qué propuesta presenta PetroMax para este conflicto?'
      }
    ],
    choices: [
      {
        id: 'propose_partnership',
        text: 'Proponer una asociación con grupos ambientales',
        nextScene: 'partnership_path',
        consequences: { reputation: 15, environment: 10, money: -5 }
      },
      {
        id: 'offer_compensation',
        text: 'Ofrecer compensación económica',
        nextScene: 'compensation_deal',
        consequences: { reputation: 10, money: -10, environment: 5 }
      },
      {
        id: 'limited_extraction',
        text: 'Proponer extracción limitada',
        nextScene: 'limited_operations',
        consequences: { reputation: 8, environment: 8, money: 10 }
      }
    ]
  },
  {
    id: 'clean_tech_path',
    background: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    characters: [
      {
        id: 'tech_expert',
        name: 'Dr. Michael Chen',
        image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
        position: 'right'
      }
    ],
    dialogue: [
      {
        speaker: 'Dr. Michael Chen',
        text: 'Excelente decisión, CEO. Soy el Dr. Michael Chen, especialista en tecnologías limpias.'
      },
      {
        speaker: 'Dr. Michael Chen',
        text: 'Podemos implementar sistemas de extracción con impacto ambiental mínimo, pero necesitaremos tiempo y recursos.'
      },
      {
        speaker: 'Dr. Michael Chen',
        text: 'Esta inversión posicionará a PetroMax como líder en responsabilidad ambiental.'
      }
    ],
    choices: [
      {
        id: 'full_investment',
        text: 'Inversión completa en tecnología verde',
        nextScene: 'green_future',
        consequences: { environment: 30, reputation: 25, money: -25 }
      },
      {
        id: 'gradual_implementation',
        text: 'Implementación gradual',
        nextScene: 'gradual_progress',
        consequences: { environment: 15, reputation: 15, money: -10 }
      }
    ]
  },
  {
    id: 'green_future',
    background: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    characters: [],
    dialogue: [
      {
        speaker: 'Narrador',
        text: 'Seis meses después...'
      },
      {
        speaker: 'Narrador',
        text: 'PetroMax se ha convertido en un referente mundial en extracción petrolera sostenible.'
      },
      {
        speaker: 'Narrador',
        text: 'Aunque los costos iniciales fueron altos, la empresa ahora atrae inversores conscientes del medio ambiente.'
      },
      {
        speaker: 'Narrador',
        text: 'Has logrado un equilibrio entre rentabilidad y responsabilidad ambiental.'
      }
    ],
    choices: [
      {
        id: 'restart',
        text: 'Jugar de nuevo',
        nextScene: 'intro'
      }
    ]
  }
];

interface GameStats {
  reputation: number;
  money: number;
  environment: number;
}

function App() {
  const [currentScene, setCurrentScene] = useState('intro');
  const [gameStats, setGameStats] = useState<GameStats>({
    reputation: 50,
    money: 50,
    environment: 50
  });
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const scene = gameData.find(s => s.id === currentScene);

  useEffect(() => {
    setDialogueIndex(0);
    setShowChoices(false);
  }, [currentScene]);

  const handleNextDialogue = () => {
    if (!scene) return;
    
    if (dialogueIndex < scene.dialogue.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setShowChoices(true);
    }
  };

  const handleChoice = (choice: Choice) => {
    if (choice.consequences) {
      setGameStats(prev => ({
        reputation: Math.max(0, Math.min(100, prev.reputation + (choice.consequences?.reputation || 0))),
        money: Math.max(0, Math.min(100, prev.money + (choice.consequences?.money || 0))),
        environment: Math.max(0, Math.min(100, prev.environment + (choice.consequences?.environment || 0)))
      }));
    }
    setCurrentScene(choice.nextScene);
  };

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  if (!isPlaying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <motion.h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            WELL OF POWER
          </motion.h1>
          <p className="text-2xl mb-2">Novela Visual</p>
          <p className="text-lg mb-8 text-gray-400">Por Paul Mora</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg text-xl font-semibold flex items-center gap-3 mx-auto transition-all duration-300"
          >
            <Play size={24} />
            Comenzar Juego
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!scene) return <div>Escena no encontrada</div>;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${scene.background})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* UI Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowStats(!showStats)}
          className="bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70 transition-all"
        >
          <Settings size={20} />
        </motion.button>
      </div>

      {/* Stats Panel */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-4 top-4 bg-black bg-opacity-80 p-4 rounded-lg text-white z-40 w-64"
          >
            <h3 className="text-lg font-bold mb-4">Estadísticas</h3>
            <StatBar label="Reputación" value={gameStats.reputation} color="bg-blue-500" />
            <StatBar label="Dinero" value={gameStats.money} color="bg-green-500" />
            <StatBar label="Medio Ambiente" value={gameStats.environment} color="bg-emerald-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Characters */}
      <div className="absolute inset-0 flex items-end justify-center pb-32">
        <AnimatePresence>
          {scene.characters.map((character) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className={`absolute ${
                character.position === 'left' ? 'left-1/4' :
                character.position === 'right' ? 'right-1/4' : 'center'
              }`}
            >
              <img
                src={character.image}
                alt={character.name}
                className="w-64 h-80 object-cover rounded-lg shadow-2xl"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dialogue Box */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-transparent p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black bg-opacity-80 rounded-lg p-6 max-w-4xl mx-auto"
        >
          {!showChoices ? (
            <div onClick={handleNextDialogue} className="cursor-pointer">
              <div className="text-yellow-400 font-bold text-lg mb-2">
                {scene.dialogue[dialogueIndex].speaker}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white text-lg leading-relaxed"
              >
                {scene.dialogue[dialogueIndex].text}
              </motion.div>
              <div className="text-gray-400 text-sm mt-4 text-right">
                Haz clic para continuar...
              </div>
            </div>
          ) : (
            <div>
              <div className="text-yellow-400 font-bold text-lg mb-4">
                ¿Qué decides hacer?
              </div>
              <div className="space-y-3">
                {scene.choices?.map((choice) => (
                  <motion.button
                    key={choice.id}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-4 rounded-lg text-white transition-all duration-300 shadow-lg"
                  >
                    {choice.text}
                    {choice.consequences && (
                      <div className="text-xs mt-2 text-gray-300">
                        {choice.consequences.reputation && `Reputación: ${choice.consequences.reputation > 0 ? '+' : ''}${choice.consequences.reputation} `}
                        {choice.consequences.money && `Dinero: ${choice.consequences.money > 0 ? '+' : ''}${choice.consequences.money} `}
                        {choice.consequences.environment && `Ambiente: ${choice.consequences.environment > 0 ? '+' : ''}${choice.consequences.environment}`}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App;