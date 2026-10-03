import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { CATEGORY_NAMES } from '../constants/config';
import { loadTasks, saveTasks } from '../services/storageService';
import { generateId } from '../utils/id';

export const TaskContext = createContext(null);

const initialState = {
  tasks: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_SUCCESS':
      return { tasks: action.payload, loading: false, error: null };

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };

    case 'ADD':
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case 'UPDATE':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.changes } : task
        ),
      };

    case 'DELETE':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.payload) };

    case 'TOGGLE':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
            : task
        ),
      };

    case 'IMPORT':
      return { ...state, tasks: [...state.tasks, ...action.payload] };

    case 'CLEAR':
      return { ...state, tasks: [] };

    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const saved = await loadTasks();
      dispatch({ type: 'LOAD_SUCCESS', payload: saved });
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', payload: 'We could not load your tasks.' });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (state.loading || state.error) return;
    saveTasks(state.tasks).catch((error) => console.warn('Could not save tasks', error));
  }, [state.tasks, state.loading, state.error]);

  const addTask = useCallback((data) => {
    const task = {
      ...data,
      title: data.title.trim(),
      description: (data.description || '').trim(),
      id: generateId(),
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD', payload: task });
    return task;
  }, []);

  const updateTask = useCallback((id, changes) => {
    const cleaned = { ...changes };
    if (typeof cleaned.title === 'string') cleaned.title = cleaned.title.trim();
    if (typeof cleaned.description === 'string') cleaned.description = cleaned.description.trim();
    dispatch({ type: 'UPDATE', payload: { id, changes: cleaned } });
  }, []);

  const deleteTask = useCallback((id) => dispatch({ type: 'DELETE', payload: id }), []);
  const toggleTask = useCallback((id) => dispatch({ type: 'TOGGLE', payload: id }), []);
  const importTasks = useCallback((list) => dispatch({ type: 'IMPORT', payload: list }), []);
  const clearAllTasks = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const getTaskById = useCallback(
    (id) => state.tasks.find((task) => task.id === id),
    [state.tasks]
  );

  const categories = useMemo(() => {
    const extras = state.tasks
      .map((task) => task.category)
      .filter((name) => name && !CATEGORY_NAMES.includes(name));
    return [...CATEGORY_NAMES, ...Array.from(new Set(extras)).sort()];
  }, [state.tasks]);

  const value = useMemo(
    () => ({
      tasks: state.tasks,
      loading: state.loading,
      error: state.error,
      categories,
      reload: load,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      importTasks,
      clearAllTasks,
      getTaskById,
    }),
    [
      state,
      categories,
      load,
      addTask,
      updateTask,
      deleteTask,
      toggleTask,
      importTasks,
      clearAllTasks,
      getTaskById,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}