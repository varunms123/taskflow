# TaskFlow – Task Management App

TaskFlow is a React Native task management application built with Expo. It allows users to create, manage, organize, filter, search, and track tasks locally on their device.

The application does not require a backend. Task data is persisted locally using AsyncStorage.

---

## Features

### Dashboard

The Home/Dashboard screen provides an overview of the user's tasks:

- Total tasks
- Completed tasks
- Pending tasks
- Today's tasks
- Completion progress
- Overdue task indicator
- Weekly task filtering
- Quick access to Bulk Upload
- Floating action button for creating a new task

---

### Task Management

Users can create, edit, view, complete, and delete tasks.

Each task contains:

- Title
- Description
- Category
- Priority
- Start date
- Due date
- Status

Supported priorities:

- Low
- Medium
- High

Supported statuses:

- Pending
- Completed

---

### Task List

The Task List screen supports:

- All tasks
- Pending tasks
- Completed tasks
- Task search
- Search by title, category, or description
- Sorting by:
  - Due date
  - Start date
  - Priority
  - Title
- Complete/pending actions
- Delete actions
- Swipe actions
- Task details navigation

---

### Task Details

The Task Details screen displays complete information for a task.

Users can:

- View task information
- Mark a task as completed
- Mark a completed task as pending
- Edit a task
- Delete a task

Overdue pending tasks are visually indicated.

---

### Add / Edit Task

The task form supports:

- Title
- Description
- Category
- Priority
- Start date
- Due date
- Status

Validation is included for:

- Required title
- Required category
- Valid priority
- Valid status
- Valid start date
- Valid due date
- Maximum title length
- Maximum description length
- Due date cannot be earlier than the start date

---

## Bulk CSV Import

TaskFlow supports importing tasks from a CSV file.

Expected CSV columns:

```text
id
title
description
category
priority
start_date
due_date
status
```

Example:

```csv
id,title,description,category,priority,start_date,due_date,status
1,Complete project report,Finish the final report,Work,High,2026-10-01,2026-10-03,pending
2,Team meeting,Discuss project progress,Meeting,Medium,2026-10-02,2026-10-02,pending
```

### Import process

1. Open Bulk Upload.
2. Select a CSV file.
3. TaskFlow reads and parses the file.
4. CSV records are validated.
5. Invalid records are displayed with row-level error messages.
6. Duplicate records are detected and skipped.
7. Valid records can be imported.
8. An import summary is displayed.

The import summary includes:

- Total rows
- Valid/imported records
- Duplicate records
- Failed/invalid records

Duplicate detection handles:

- Existing task IDs
- Duplicate task title + start date + due date combinations

The application uses the CSV data dynamically and does not hard-code the supplied task records.

---

## Local Data Storage

TaskFlow uses:

```text
AsyncStorage
```

to persist:

- Tasks
- Theme preference

No backend or external database is required.

Task data remains available after restarting the application.

---

## Settings

The Settings screen provides:

- Light mode
- Dark mode
- Stored task count
- Clear all tasks
- CSV export/share functionality

---

## Bonus Features

The application includes several additional features beyond the core requirements:

- Overdue task indicator
- Weekly/day task filtering
- Task sorting
- Swipe actions
- Dark mode
- Task completion progress
- Responsive UI
- Reusable UI components

---

## Technology Stack

- React Native
- Expo
- JavaScript
- React Navigation
- AsyncStorage
- Expo Document Picker
- React Native Gesture Handler
- React Native DateTimePicker
- Expo Vector Icons
- Expo Linear Gradient

---

## Project Structure

```text
TaskFlow/
├── App.js
├── index.js
├── app.json
├── package.json
│
├── assets/
│
└── src/
    ├── components/
    │   ├── common/
    │   ├── dashboard/
    │   └── tasks/
    │
    ├── constants/
    │
    ├── context/
    │
    ├── hooks/
    │
    ├── navigations/
    │
    ├── screens/
    │
    ├── services/
    │
    ├── themes/
    │
    └── utils/
```

---

## Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Expo-compatible development environment
- Android Studio / Android emulator for Android development, if required

---

## Setup

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd TaskFlow
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

Or:

```bash
npx expo start
```

---

## Running on Android

Start the development server:

```bash
npm run android
```

Alternatively:

```bash
npx expo start
```

Then open the application using an Android emulator or a connected device.

---

## Running on iOS

```bash
npm run ios
```

An appropriate macOS/iOS development environment is required.

---

## Running on Web

```bash
npm run web
```

---

## Building the APK

For an Android APK, an Expo/EAS build can be used.

Install EAS CLI:

```bash
npm install -g eas-cli
```

Login:

```bash
eas login
```

Configure the project:

```bash
eas build:configure
```

Build an Android application:

```bash
eas build --platform android
```

After the build completes, the generated APK/build artifact can be downloaded from the EAS build page.

---

## Validation and Error Handling

TaskFlow handles several application states:

### Loading

Displays a loading state while locally stored tasks are being loaded.

### Empty state

Displays helpful messages when:

- No tasks exist
- No search results are found
- No tasks are scheduled for a selected day

### Error state

Displays an error message with a retry option when task loading fails.

### CSV validation errors

Invalid CSV records display:

- Row number
- Task title
- Validation error messages

---

## Data Persistence

All task changes are persisted locally.

Operations such as:

- Creating a task
- Editing a task
- Completing a task
- Deleting a task
- Importing tasks
- Clearing tasks

update the local AsyncStorage data.

No backend API is required.

---

## CSV Export

TaskFlow provides CSV export functionality from the Settings screen.

The application generates CSV data using the following columns:

```text
id,title,description,category,priority,start_date,due_date,status
```

> Note: The current implementation shares the generated CSV content through the native share sheet. For a full file-based CSV export, the CSV content can be written to a `.csv` file before sharing/saving it.

---

## Known Limitations

- Task data is stored locally on the device and is not synchronized between devices.
- No backend or user authentication is implemented because it was not required for the assessment.
- CSV import depends on the selected file being readable by the device.
- The current CSV export shares CSV content through the native sharing interface rather than creating a dedicated `.csv` file first.

---

## Assessment Coverage

The implementation covers the requested assessment areas:

- React Native development
- Expo
- Navigation
- Local data storage
- CRUD operations
- State management
- Form validation
- CSV import
- Duplicate handling
- Search and filtering
- Sorting
- Reusable components
- Loading states
- Empty states
- Error handling
- Responsive UI
- Dark/light mode

---

## Submission

The assessment submission includes:

1. GitHub repository
2. Android APK
3. Short screen recording demonstrating the application
4. README with setup and run instructions
5. Known limitations/incomplete features

---

## Author

TaskFlow – React Native Task Management Assessment