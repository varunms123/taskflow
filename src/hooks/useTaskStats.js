import { useMemo } from "react";
import useTasks from "./useTasks";
import { isActiveToday, isOverdue } from "../utils/dateUtils";

export default function useTaskStats(){
    const { tasks } = useTasks();

    return useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'completed').length;
        const pending = total - completed;
        const todayCount = tasks.filter(isActiveToday).length;
        const overdue = tasks.filter(isOverdue).length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        return { total, completed, pending, today: todayCount, overdue, percent };
    }, [tasks]);
}