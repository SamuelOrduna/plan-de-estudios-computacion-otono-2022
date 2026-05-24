import React from 'react';
import { usePlan } from '../hooks/usePlan';
import { motion } from 'framer-motion';

export const SubjectCard = ({ subject, isAvailable }) => {
  const { completed, toggleSubject, setSelectedSubject } = usePlan();
  const isCompleted = completed.has(subject.id);

  const cardVariants = {
    hover: { y: -4, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)' },
    tap: { scale: 0.98 }
  };

  const getBgColor = () => {
    if (isCompleted) return 'bg-green-50 border-green-300';
    if (isAvailable) return 'bg-blue-50 border-blue-300';
    return 'bg-gray-50 border-gray-300';
  };

  const getCriticalBgColor = () => {
    if (subject.critical) return 'border-red-400 bg-red-50';
    return '';
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        getCriticalBgColor() || getBgColor()
      } ${!isAvailable && !isCompleted ? 'opacity-60' : ''}`}
      onClick={() => {
        if (isAvailable) {
          toggleSubject(subject.id);
        }
        setSelectedSubject(subject);
      }}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => {}}
          className="w-5 h-5 rounded border-2 border-gray-300 text-green-600 mt-0.5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleSubject(subject.id);
          }}
        />
        <div className="flex-1">
          <div className="font-bold text-sm text-gray-900">{subject.name}</div>
          <div className="text-xs text-gray-600 mt-1 font-mono">{subject.id}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                subject.offer === 'fall'
                  ? 'bg-amber-100 text-amber-700'
                  : subject.offer === 'spring'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {subject.offer === 'fall' ? 'Otoño' : subject.offer === 'spring' ? 'Primavera' : 'Ambos'}
            </span>
            {subject.critical && (
              <span className="text-xs px-2 py-1 rounded font-medium bg-red-100 text-red-700">
                Crítica
              </span>
            )}
            {subject.gate && (
              <span className="text-xs px-2 py-1 rounded font-medium bg-purple-100 text-purple-700">
                Compuerta
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
