export function generateId(){
    const time = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 7);
    return `local-${time}-${random}`;
}