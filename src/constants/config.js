export const STORAGE_KEYS = {
    TASKS: '@taskflow/tasks',
    THEME: '@taskflow/theme',
}

export const PRIORITIES = ['Low', 'Medium', 'High'];

export const STATUSES = ['pending', 'completed'];

export const STATUS_LABELS = {
    pending: 'Pending',
    completed: 'Completed',
}

export const CSV_COLUMNS = [
    'id',
    'title',
    'description',
    'category',
    'priority',
    'start_date',
    'due_date',
    'status',
];

export const CATEGORIES = {
    Work: { icon: 'briefcase-outline', color: '#7C6BFF' },
    Development: { icon: 'code-slash-outline', color: '#3B82F6' },
    Design: { icon: 'color-palette-outline', color: '#EC4899' },
    Documentation: { icon: 'document-text-outline', color: '#0EA5E9' },
    Planning: { icon: 'calendar-outline', color: '#F59E0B'},
    Meeting: { icon: 'people-outline', color: '#14B8A6' },
    Testing: { icon: 'bug-outline', color: '#EF4444' },
    Release: { icon: 'rocket-outline', color: '#8B5CF6' },
    Finance: { icon: 'wallet-outline', color: '#22B573' },
    Health: { icon: 'heart-outline', color: '#F43F5E'},
    Learning: { icon: 'school-outline', color: '#6366F1'},
    Personal: { icon: 'person-outline', color: '#F97316' },
    Travel: { icon: 'airplane-outline', color: '#06B6D4' },
};

export const DEFAULT_CATEGORY = { icon: 'pricetag-outline', color: '#8A82AD' };

export const CATEGORY_NAMES = Object.keys(CATEGORIES);

export const getCategoryMeta = ( name ) => CATEGORIES[name] || DEFAULT_CATEGORY;