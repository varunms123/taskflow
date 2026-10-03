const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (n) => String(n).padStart(2, '0');

export function toISODate(date){
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function today(){
    return toISODate(new Date());
}

export function parseISODate(value){
    const [y, m, d] = value.split('-').map(Number);
    return new Date (y, m - 1, d, 12);
}

export function isValidISODate(value){
    if(typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)){
        return false;
    }

    return toISODate(parseISODate(value)) === value;
}

export function formatDate(value){
    if(!isValidISODate(value)) return '-';
    const date = parseISODate(value);
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatShortDate(value){
    if(!isValidISODate(value)) return '-';
    const date = parseISODate(value);
    return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function isToday(value){
    return value === today();
}

export function isOverdue(task){
    return task.status === 'pending' && task.dueDate < today();
}

export function isActiveToday(task){
    const now = today();
    return task.status === 'pending' && task.startDate <= now && task.dueDate >= now;
}

export function daysBetween(a, b){
    const ms = parseISODate(b) - parseISODate(a);
    return Math.round(ms / 86400000);
}

export function getDueLabel(task){
    const diff = daysBetween(today(), task.dueDate);

    if(task.status === 'completed') return `Due ${formatShortDate(task.dueDate)}`;
    if(diff === 0) return 'Due today';
    if(diff === 1) return 'Due tomorrow';
    if(diff === -1) return '1 day overdue';
    if(diff < 0) return `${Math.abs(diff)} days overdue`;
    return `Due ${formatShortDate(task.dueDate)}`;
}

export function getWeekDays(baseISO = today()){
    const base = parseISODate(baseISO);
    const offsetToMonday = (base.getDay() + 6) % 7;
    const monday = new Date(base);
    monday.setDate(base.getDate() - offsetToMonday);

    const now = today();

    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        const iso = toISODate(day);

        return {
            iso, 
            label: WEEKDAYS[day.getDay()].slice(0, 3),
            dayNumber: day.getDate(),
            isToday: iso === now,
        };
    });
}

export function taskCoversDay(task, dayISO) {
  return task.startDate <= dayISO && task.dueDate >= dayISO;
}

export function formatLongToday(){
    const date = new Date ();
    const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${names[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}