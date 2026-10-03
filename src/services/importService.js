import * as DocumentPicker from 'expo-document-picker';
import { CSV_COLUMNS } from '../constants/config';
import { generateId } from '../utils/id';
import {normalizePriority, normalizeStatus, validateTask } from '../utils/validators';
import { parseCSV, isHeaderRow } from '../utils/csvParser';

const HEADER_ALIASES = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  priority: 'priority',
  startdate: 'startDate',
  duedate: 'dueDate',
  status: 'status',
};

const REQUIRED_FIELDS = ['title', 'category', 'priority', 'startDate', 'dueDate', 'status'];

const simplify = (text) => text.toLowerCase().replace(/[\s_-]/g, '');

export async function pickCSVFile(){
    const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/csv', 'text/plain', '*/*'],
        copyToCacheDirectory: true,
        multiple: false,
    });

    if(result.canceled || !result.assets || result.assets.length === 0){
        return null;
    }

    const asset = result.assets[0];
    return { name: asset.name, size: asset.size, uri: asset.uri };
}

export async function readFileAsText(uri) {
    const response = await fetch(uri);
    if(!response.ok){
        throw new Error('Could not read the selected file');
    }

    return response.text();
}

function buildColumnMap(headerRow){
    const map = {};
    headerRow.forEach((name, index) => {
        const field = HEADER_ALIASES[simplify(name)];
        if(field && map[field] === undefined) map[field] = index;
    });
    return map;
}

function defaultColumnMap(){
    const map = {};
    CSV_COLUMNS.forEach((name, index) => {
        map[HEADER_ALIASES[simplify(name)]] = index;
    });
    return map;
}

const duplicateKey = (task) => `${task.title.trim().toLowerCase()}|${task.startDate}|${task.dueDate}`;

export function buildImportReport(text, existingTasks = []){
    const report = { fatalError: null, totalRows: 0, valid: [], duplicates: [], errors: [] };

    const rows = parseCSV(text);
    if(rows.length === 0){
        report.fatalError = 'The file is empty';
        return report;
    }

    const hasHeader = isHeaderRow(rows[0]);
    let columnMap;
    let firstLineNumber = 1;

    if(hasHeader){
        columnMap = buildColumnMap(rows[0]);
        rows.shift();
        firstLineNumber = 2;

        const missing = REQUIRED_FIELDS.filter((field) => columnMap[field] === undefined);
        if(missing.length > 0){
            report.fatalError = `Missing required columns: ${missing.join(', ')}`;
            return report;
        }
    } else {
        columnMap = defaultColumnMap();
    }

    report.totalRows = rows.length;

    const knownIds = new Set(existingTasks.map((t) => String(t.id)));
    const knownKeys = new Set(existingTasks.map(duplicateKey));

    rows.forEach((row, index) => {
        const lineNumber = index + firstLineNumber;
        const get = (field) => 
            columnMap[field] !== undefined ? (row[columnMap[field]] || '').trim() : '';

        if(!hasHeader && row.length !== CSV_COLUMNS.length){
            report.errors.push({
                row: lineNumber,
                title: get('title') || '(no title)',
                messages: [`Expected ${CSV_COLUMNS.length} columns but found ${row.length}`],
            });

            return;
        }

        const task = {
            id: get('id') || generateId(),
            title: get('title'),
            description: get('description'),
            category: get('category'),
            priority: normalizePriority(get('priority')) || get('priority'),
            startDate: get('startDate'),
            dueDate: get('dueDate'),
            status: normalizeStatus(get('status')) || get('status'),
            createdAt: Date.now(),
        };

        const problems = validateTask(task);
        if(Object.keys(problems).length > 0){
            report.errors.push({
                row: lineNumber,
                title: task.title || '(no title)',
                messages: Object.values(problems),
            });

            return;
        }

        const key = duplicateKey(task);
        const idExists = knownIds.has(String(task.id));
        if(idExists || knownKeys.has(key)){
            report.duplicates.push({
                row: lineNumber,
                title: task.title,
                reason: idExists ? 'Same id already exists' : 'Same title and dates already exist',
            });
            return;
        }

        knownIds.add(String(task.id));
        knownKeys.add(key);
        report.valid.push(task);
    });

    return report;
}