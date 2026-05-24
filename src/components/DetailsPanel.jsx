import React from 'react';
import { usePlan } from '../hooks/usePlan';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

export const DetailsPanel = () => {
  const { selectedSubject, setSelectedSubject, completed, getTransitiveDependencies, subjects } = usePlan();

  if (!selectedSubject) return null;

  const isCompleted = completed.has(selectedSubject.id);
  const prereqs = selectedSubject.prereqs;
  const allPrereqsMet = prereqs.every(p => completed.has(p));
  const directUnlocks = subjects.filter(s => s.prereqs.includes(selectedSubject.id));
  const transitiveDeps = getTransitiveDependencies(selectedSubject.id, 'after');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden shadow-lg"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-medium">CÓDIGO</p>
            <h3 className="text-2xl font-bold text-gray-900 font-mono mt-1">{selectedSubject.id}</h3>
          </div>
          <button
            onClick={() => setSelectedSubject(null)}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <FaTimes size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">NOMBRE</p>
            <p className="text-sm text-gray-900">{selectedSubject.name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">INFORMACIÓN</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Semestre:</span> {selectedSubject.semester}°
              </p>
              <p>
                <span className="font-semibold">Oferta:</span>{' '}
                {selectedSubject.offer === 'fall'
                  ? 'Solo Otoño'
                  : selectedSubject.offer === 'spring'
                  ? 'Solo Primavera'
                  : 'Ambos Semestres'}
              </p>
            </div>
          </div>

          {prereqs.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 font-medium mb-2">PRERREQUISITOS</p>
              <div className="space-y-2">
                {prereqs.map(prereq => (
                  <div
                    key={prereq}
                    className={`text-xs px-3 py-2 rounded font-mono font-medium ${
                      completed.has(prereq)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {prereq}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">ESTADO</p>
            {isCompleted ? (
              <div className="px-3 py-2 bg-green-100 text-green-700 text-xs rounded font-medium">
                ✓ Completada
              </div>
            ) : allPrereqsMet ? (
              <div className="px-3 py-2 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                Disponible ahora
              </div>
            ) : (
              <div className="px-3 py-2 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                Requiere prerrequisitos
              </div>
            )}
          </div>

          {directUnlocks.length > 0 && (
            <div>
              <p className="text-xs text-gray-600 font-medium mb-2">DESBLOQUEA DIRECTAMENTE</p>
              <div className="space-y-2">
                {directUnlocks.map(unlock => (
                  <div key={unlock.id} className="text-xs bg-amber-50 px-3 py-2 rounded border border-amber-200">
                    {unlock.id}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-600 font-medium mb-2">IMPACTO TOTAL</p>
            <p className="text-sm text-gray-900 font-semibold">{transitiveDeps.size - 1} materias río abajo</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((transitiveDeps.size / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {selectedSubject.critical && (
            <div className="px-4 py-3 bg-red-50 border border-red-300 rounded">
              <p className="text-xs font-semibold text-red-700 mb-1">Parte de la cadena crítica</p>
              <p className="text-xs text-red-600">
                Un tropiezo aquí atrasa 12 meses. Máxima prioridad.
              </p>
            </div>
          )}

          {selectedSubject.gate && (
            <div className="px-4 py-3 bg-purple-50 border border-purple-300 rounded">
              <p className="text-xs font-semibold text-purple-700 mb-1">Compuerta de impacto</p>
              <p className="text-xs text-purple-600">Desbloquea muchas materias posteriores.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => setSelectedSubject(null)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
