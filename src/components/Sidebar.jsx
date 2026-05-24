import React, { useState } from 'react';
import { usePlan } from '../hooks/usePlan';
import { motion } from 'framer-motion';
import { FaChevronDown, FaDownload, FaRedoAlt } from 'react-icons/fa';

export const Sidebar = () => {
  const { getStats, resetAll, exportProgress } = usePlan();
  const stats = getStats();
  const [expandedSection, setExpandedSection] = useState('critical');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionButton = ({ title, section, children }) => (
    <div className="mb-3">
      <button
        onClick={() => toggleSection(section)}
        className="w-full px-4 py-2.5 flex items-center justify-between bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-left"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        <motion.div
          animate={{ rotate: expandedSection === section ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown size={14} className="text-gray-600" />
        </motion.div>
      </button>
      <motion.div
        animate={{ height: expandedSection === section ? 'auto' : 0 }}
        initial={{ height: 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-4 py-3 bg-gray-50 text-xs text-gray-700 space-y-2">{children}</div>
      </motion.div>
    </div>
  );

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Plan de Estudios</h1>
        <p className="text-xs text-gray-600 mt-1 font-medium">Ingeniería en Computación • Otoño 2022</p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200"
      >
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">Aprobadas</p>
            <motion.p
              key={stats.completed}
              animate={{ scale: [1, 1.1, 1] }}
              className="text-2xl font-bold text-green-600 mt-1"
            >
              {stats.completed}
            </motion.p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">Disponibles</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.available}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 font-medium">Faltantes</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{stats.remaining}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-600 font-medium">Progreso</p>
            <p className="text-xs font-semibold text-gray-900">{Math.round(stats.progress)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            ></motion.div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-medium">Duración estimada</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{stats.estimatedSemesters} semestres</p>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-2">
        <button
          onClick={exportProgress}
          className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
        >
          <FaDownload size={14} />
          Guardar progreso
        </button>
        <button
          onClick={resetAll}
          className="w-full px-4 py-2 flex items-center justify-center gap-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
        >
          <FaRedoAlt size={14} />
          Limpiar todo
        </button>
      </div>

      {/* Observations */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
        <SectionButton
          title="Cadena crítica"
          section="critical"
        >
          <p className="font-semibold mb-1">Física → Circuitos → Mecatrónica → SO</p>
          <p>
            Cada eslabón se ofrece una sola vez al año. Orden estricto: otoño-primavera-primavera. Cualquier
            tropiezo atrasa 12 meses.
          </p>
        </SectionButton>

        <SectionButton
          title="Compuertas de impacto"
          section="gates"
        >
          <p>
            <span className="font-semibold">COM-11102</span> (Estructuras de Datos, 2°)
          </p>
          <p>
            <span className="font-semibold">COM-16203</span> (Desarrollo de Aplicaciones, 3°) desbloquea 5 materias
            posteriores.
          </p>
        </SectionButton>

        <SectionButton
          title="Solo otoño"
          section="fall"
        >
          <p className="font-mono text-xs">SDI-14105, SDI-11322, COM-14106, SDI-13760, COM-11107, COM-22104</p>
        </SectionButton>

        <SectionButton
          title="Solo primavera"
          section="spring"
        >
          <p className="font-mono text-xs">
            SDI-11221, SDI-11561, COM-12102, COM-23101, COM-14101, COM-14104, COM-22105, SDI-13782
          </p>
        </SectionButton>

        <SectionButton
          title="Pares simultáneos (A)"
          section="paired"
        >
          <p>
            <span className="font-semibold">3°:</span> EGN-17123 + LEN-12702
          </p>
          <p>
            <span className="font-semibold">6°:</span> COM-12102 + LEN-12724
          </p>
          <p>
            <span className="font-semibold">7°:</span> SDI-24810 + LEN-12764
          </p>
        </SectionButton>
      </div>
    </aside>
  );
};
