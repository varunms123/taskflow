import { PRIORITIES, STATUSES } from '../constants/config';
import { isValidISODate } from './dateUtils';

export function normalizePriority(value = ''){
    const clean = String(value).trim().toLowerCase();
    return PRIORITIES.find((p) => p.toLowerCase() === clean) || null;
}

export function normalizeStatus(value = ''){
    const clean = String(value).trim().toLowerCase();
    return STATUSES.includes(clean) ? clean : null;
}

export function validateTask(task){
    const errors = {};

    const title = (task.title || '').trim();
    if(!title){
        errors.title = 'Title is required';
    } else if (title.length > 80) {
        errors.title = 'Title must be 80 characters or less';
    }

    if ((task.description || '').length > 300){
        errors.description = 'Description must be 300 characters or less';
    }

    if(!(task.category || '').trim()){
        errors.category = 'Please choose a category';
    }

    if(!PRIORITIES.includes(task.priority)){
        errors.priority = 'priority must be Low, Medium or High';
    }

    if(!STATUSES.includes(task.status)){
        errors.status = 'Status must be pending or completed';
    }

    const startOk = isValidISODate(task.startDate);
    const dueOk = isValidISODate(task.dueDate);

    if(!startOk) errors.startDate = 'Start Date is missing or not a valid date';
    if(!dueOk) errors.dueDate = 'Due date is missing or not  a valid date';

    if(startOk && dueOk && task.dueDate < task.startDate) {
        errors.dueDate = 'Due date cannot eb earlier than the start date';
    }

    return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;