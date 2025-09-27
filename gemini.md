# Gemini Setup Notes for Bingoals API

This document outlines the steps to set up and run the Bingoals API locally, specifically for the Gemini CLI.

**Stack:**
*   **Backend:** Node.js with Express.js
*   **Language:** TypeScript
*   **Database:** MongoDB (using Mongoose)
*   **Other key libraries:** `cors`, `dotenv`, `express-async-errors`, `express-validator`, `uuid`, `winston`

**Purpose:**
The Bingoals API is a backend service built with Node.js, Express.js, and TypeScript. It connects to a MongoDB database and likely handles user-related data and goals. It includes middleware for CORS, error handling, and logging.

**Local Setup Steps:**

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev &
    ```
    This will start the server in the background.

**Checking Backend Logs:**

Since the server is run in the background, its logs are not directly visible. To check the logs, you'll need to stop the current background process and restart it with log redirection.

1.  **Find the Process ID (PID) of the background server:**
    When you ran `npm run dev &`, the output included a `Background PIDs` value (e.g., `49953`). Note this number.

2.  **Stop the current background process:**
    ```bash
    kill <PID>
    ```
    Replace `<PID>` with the actual process ID you noted (e.g., `kill 49953`).

3.  **Restart the server and redirect logs to a file:**
    ```bash
    cd backend
    npm run dev > server.log 2>&1 &
    ```
    This command will:
    *   `cd backend`: Navigate to the backend directory.
    *   `npm run dev`: Start the development server.
    *   `> server.log`: Redirect standard output to `server.log`.
    *   `2>&1`: Redirect standard error to the same `server.log` file.
    *   `&`: Run the command in the background.

4.  **View the logs:**
    You can then view the logs in real-time using `tail -f server.log`:
    ```bash
    tail -f server.log
    ```

**Important Note:** Committing changes directly to the `main` branch is strictly prohibited.

---

## Coding Principles for Bingoals API Development

To ensure high quality and rapid development, we will adhere to the following principles:

*   **Minimal Changes:** Prioritize solutions that require the least amount of modification to existing code or infrastructure.
*   **Minimal and Very Configurable for Starters:** Design features to be simple and highly configurable, allowing for easy adaptation and extension without complex refactoring.
*   **90:10 Principle Everywhere:** Focus on delivering 90% of the value with 10% of the effort, cutting scope where necessary to achieve faster, high-quality results.
*   **Code Quality without Sacrificing Time/Scope:** Maintain high code quality standards (readability, maintainability, testability) but be pragmatic about scope to ensure timely delivery.
*   **ORM Usage:** Leverage an Object-Relational Mapper (ORM) for database interactions to streamline development, improve code readability, and reduce boilerplate.
*   **Using Utilities Everywhere to Avoid Code Duplication:** Promote the creation and reuse of utility functions and modules to ensure a DRY (Don't Repeat Yourself) codebase.

## Linting and Formatting

After making code changes, you can automatically fix most linting and formatting issues by running:

```bash
cd backend
npm run lint:fix
```

---

# Frontend Setup Notes

This section outlines the setup and conventions for the Bingoals frontend.

**Stack:**
*   **Framework:** Svelte
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Language:** JavaScript (with JSDoc for type checking)

**Key Files and Directories:**
*   `frontend/index.html`: The main HTML entry point.
*   `frontend/src/main.js`: The JavaScript entry point for the Svelte application.
*   `frontend/src/App.svelte`: The root Svelte component.
*   `frontend/src/app.css`: Global CSS, including Tailwind directives and font imports.
*   `frontend/tailwind.config.js`: Tailwind CSS configuration, including custom font settings.
*   `frontend/postcss.config.js`: PostCSS configuration for Tailwind CSS.
*   `frontend/src/lib/components/`: Directory for reusable Svelte components.

**Font:**
The primary font used across the application is **Alegreya Sans** from Google Fonts. It is imported via `@import` in `frontend/src/app.css` and configured as the default `sans` font in `frontend/tailwind.config.js`.

**Local Setup Steps:**

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the development server, typically accessible at `http://localhost:5173` (or another port if 5173 is in use).

**Design Practices to Minimize Code Bloat:**

To maintain a lean and efficient codebase, we adhere to the following practices:

*   **Component-Based Architecture:** Break down the UI into small, reusable Svelte components. Store these in `frontend/src/lib/components/`.
*   **Tailwind CSS for Styling:** Leverage Tailwind's utility-first approach to avoid writing custom CSS where possible, promoting consistency and reducing stylesheet size.
*   **DRY (Don't Repeat Yourself):** Actively identify and refactor duplicated code into reusable functions, stores, or components.
*   **Minimal Dependencies:** Only introduce new libraries or packages when absolutely necessary and after careful consideration of their impact on bundle size and performance.

*   **Focus on Core Functionality:** Prioritize delivering essential features efficiently, avoiding premature optimization or over-engineering.
*   **Regular Review and Refactoring:** Periodically review the codebase for opportunities to simplify, optimize, and remove unnecessary code.
