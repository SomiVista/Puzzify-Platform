# Valentine's Day Interactive Gift ❤️

A romantic, interactive web application designed for a developer couple. Solve the puzzle to unlock the secret love story!

## Features
- **Stage 1: Photo Puzzle**: Drag and drop pieces to reveal a special photo.
- **Stage 2: Secret Code Game**: Answer questions about your relationship to unlock memories.
- **Celebration**: A final message with confetti and sparkles.
- **Customizable**: Easy to add your own photos, questions, and music.

## How to Customize
1.  **Photos**:
    -   Replace the puzzle image in `src/components/PuzzleBoard.vue` (look for `imageSrc` prop).
    -   Add your memory photos in `src/components/SecretCodeGame.vue` (update the `questions` array).
2.  **Questions**:
    -   Edit the `questions` array in `src/components/SecretCodeGame.vue` to include your own relationship trivia.
3.  **Music**:
    -   Update the audio URL in `src/App.vue` (look for `new Audio(...)`).

## Installation & Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally (Development)**:
    ```bash
    npm run dev
    ```
    Open the link shown (usually `http://localhost:5173`).

3.  **Run Server (Production/Local)**:
    ```bash
    npm run build
    npm start
    ```
    Open `http://localhost:3000`.

## Deployment

### GitHub Pages (Static)
Since this is a Vue app, you can deploy it as a static site:
1.  Build the project: `npm run build`
2.  Push the contents of the `dist` folder to a `gh-pages` branch, or configure GitHub Pages to deploy from your main branch's `dist` folder (requires a workflow).
3.  **Easiest way**: Use a GitHub Action for Vite/Vue.

### Node.js Hosting (Heroku, Railway, etc.)
If you want to use the Express server:
1.  Commit the entire project.
2.  Deploy to your platform of choice. The `start` script is already set up to run `node server.js`.

## Credits
Built with Vue.js, Vite, and ❤️.
