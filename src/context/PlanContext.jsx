import React, { createContext, useState, useCallback, useEffect } from 'react';
import { createSubjects } from '../data/subjects';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [subjects] = useState(() => createSubjects());
  const [completed, setCompleted] = useState(new Set());
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [plannedSemesters, setPlannedSemesters] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('completedSubjects');
    if (saved) {
      try {
        setCompleted(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('completedSubjects', JSON.stringify(Array.from(completed)));
  }, [completed]);

  const getAvailableSubjects = useCallback(() => {
    return subjects.filter(s => {
      if (completed.has(s.id)) return false;
      return s.prereqs.every(p => completed.has(p));
    });
  }, [subjects, completed]);

  const getRemainingSubjects = useCallback(() => {
    return subjects.filter(s => {
      if (completed.has(s.id)) return false;
      return !s.prereqs.every(p => completed.has(p));
    });
  }, [subjects, completed]);

  const toggleSubject = useCallback((id) => {
    setCompleted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const getTransitiveDependencies = useCallback((id, direction = 'prereqs') => {
    const result = new Set();
    const queue = [id];

    while (queue.length > 0) {
      const current = queue.shift();
      if (result.has(current)) continue;
      result.add(current);

      if (direction === 'prereqs') {
        const subject = subjects.find(s => s.id === current);
        if (subject) {
          subject.prereqs.forEach(p => {
            if (!result.has(p)) queue.push(p);
          });
        }
      } else {
        subjects.forEach(s => {
          if (s.prereqs.includes(current) && !result.has(s.id)) {
            queue.push(s.id);
          }
        });
      }
    }

    return result;
  }, [subjects]);

  const getStats = useCallback(() => {
    const available = getAvailableSubjects();
    const remaining = getRemainingSubjects();
    const total = subjects.length;
    const completedCount = completed.size;

    return {
      completed: completedCount,
      available: available.length,
      remaining: remaining.length,
      total,
      progress: (completedCount / total) * 100,
      estimatedSemesters: Math.ceil(remaining.length / 6)
    };
  }, [subjects, completed, getAvailableSubjects, getRemainingSubjects]);

  const resetAll = useCallback(() => {
    if (confirm('¿Estás seguro de que quieres limpiar todo tu progreso?')) {
      setCompleted(new Set());
      setSelectedSubject(null);
    }
  }, []);

  const exportProgress = useCallback(() => {
    const data = Array.from(completed);
    const text = data.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progreso-estudios.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [completed]);

  const value = {
    subjects,
    completed,
    selectedSubject,
    setSelectedSubject,
    toggleSubject,
    getAvailableSubjects,
    getRemainingSubjects,
    getTransitiveDependencies,
    getStats,
    resetAll,
    exportProgress,
    plannedSemesters,
    setPlannedSemesters
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};
