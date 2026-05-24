import React, { useState } from 'react';
import { usePlan } from '../hooks/usePlan';
import { SubjectCard } from './SubjectCard';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

export const MainContent = () => {
  const { getAvailableSubjects, getRemainingSubjects, getStats, subjects } = usePlan();
  const available = getAvailableSubjects();
  const remaining = getRemainingSubjects();
  const stats = getStats();
  const [searchTerm, setSearchTerm] = useState('');

  const filterSubjects = (subjectList) => {
    if (!searchTerm) return subjectList;
    return subjectList.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredAvailable = filterSubjects(available);
  const filteredRemaining = filterSubjects(remaining);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Plan curricular interactivo</h2>
          <p className="text-xs text-gray-600 mt-1">Selecciona las materias que ya completaste</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{stats.estimatedSemesters} semestres</p>
          <p className="text-xs text-gray-600">Duración estimada</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-8 py-4 bg-white border-b border-gray-200">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar materia por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        {/* Available Section */}
        <motion.section initial="hidden" animate="visible" variants={containerVariants}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-green-700 mb-2">Puedes llevar ahora</h3>
            <p className="text-sm text-gray-600">
              {filteredAvailable.length} materia{filteredAvailable.length !== 1 ? 's' : ''} disponible
              {filteredAvailable.length !== 1 ? 's' : ''} — todos los prerrequisitos están completos
            </p>
          </div>

          {filteredAvailable.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {filteredAvailable.map(subject => (
                <motion.div key={subject.id} variants={itemVariants}>
                  <SubjectCard subject={subject} isAvailable={true} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300"
            >
              <p className="text-gray-500 font-medium">
                {searchTerm ? 'No hay resultados que coincidan' : 'Ninguna materia disponible aún'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm ? 'Intenta otro término de búsqueda' : 'Completa prerrequisitos para desbloquear materias'}
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Remaining Section */}
        <motion.section initial="hidden" animate="visible" variants={containerVariants}>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Por completar</h3>
            <p className="text-sm text-gray-600">
              {filteredRemaining.length} materia{filteredRemaining.length !== 1 ? 's' : ''} — requiere completar
              otros cursos
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
          >
            {filteredRemaining.map(subject => (
              <motion.div key={subject.id} variants={itemVariants}>
                <SubjectCard subject={subject} isAvailable={false} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};
