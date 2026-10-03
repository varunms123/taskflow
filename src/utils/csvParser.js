import { CSV_COLUMNS } from "../constants/config";

export function parseCSV(text){
    const source = text.replace(/^\uFEFF/, '');
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    const finishRow = () => {
        row.push(field.trim());
        field = '';
        if(!(row.length === 1 &&row[0] === '')){
            rows.push(row);
        }
        row = [];
    };

    for (let i = 0; i < source.length; i++){
        const char = source[i];

        if(inQuotes){
            if(char === '"'){
                if(source[i + 1] === '"'){
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += char;
            }

            continue;
        }

        if(char === '"'){
            inQuotes = true;
        } else if (char === ','){
            row.push(field.trim());
            field = '';
        } else if (char === '\n' || char === '\r'){
            if( char === '\r' && source[i + 1] === '\n') i++;
            finishRow();
        } else {
            field += char;
        }
    }

    if (field !== '' || row.length > 0){
        finishRow();
    }

    return rows;
}

export function isHeaderRow(row){
    const cells = row.map((c) => c.toLowerCase());
    return cells.includes('title') && cells.includes('status');
}

const escapeCell = (value) => {
    const text = value === undefined || value === null ? '' : String(value);
    if(/[",\n\r]/.test(text)){
        return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
}

export function toCSV(tasks){
    const lines = [CSV_COLUMNS.join(',')];

    tasks.forEach((task) => {
        lines.push([
            task.id,
            task.title,
            task.description,
            task.category,
            task.priority,
            task.startDate,
            task.dueDate,
            task.status,
        ] 
        .map(escapeCell)
        .join(',')
        );
    });

    return lines.join('\n');
}