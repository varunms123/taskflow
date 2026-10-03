import { useMemo } from "react";
import useTasks from "./useTasks";
import { taskCoversDay } from '../utils/dateUtils';

export const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
];

export const SORT_OPTIONS = [
  { value: 'due', label: 'Due date' },
  { value: 'start', label: 'Start date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title (A-Z)' },
];

const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };

const comparers = {
    due: (a, b) => a.dueDate.localeCompare(b.dueDate),
    start: (a, b) => a.startDate.localeCompare(b.startDate),
    priority: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
    title: (a, b) => a.title.localeCompare(b.title),
}

export default function useFilteredTasks({ filter = 'all', search = '', sortBy = 'due', day = null } = {}) {
  const { tasks } = useTasks();

  return useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks
      .filter((task) => (filter === 'all' ? true : task.status === filter))
      .filter((task) => (day ? taskCoversDay(task, day) : true))
      .filter((task) => {
        if (!query) return true;
        return (
          task.title.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query) ||
          (task.description || '').toLowerCase().includes(query)
        );
      })
      .sort((a, b) => comparers[sortBy](a, b) || a.title.localeCompare(b.title));
  }, [tasks, filter, search, sortBy, day]);
}