# Image-to-Poem-Generator

## Running Locally

To run this project locally and use its AI capabilities, you need a Google AI API key.

### 1. Obtain an API Key
If you don't have one already, you can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Configure Environment Variable
This project uses a `.env` file to manage environment variables.

*   Ensure you have a file named `.env` in the root directory of the project.
*   Open the `.env` file and add your API key like this:

    ```env
    GOOGLE_GEMINI_API_KEY="YOUR_ACTUAL_API_KEY_HERE"
    ```

    Replace `"YOUR_ACTUAL_API_KEY_HERE"` with the API key you obtained from Google AI Studio.

### 3. Install Dependencies
If you haven't already, install the project dependencies:
```bash
npm install
```

### 4. Run the Application
You'll need to run two development servers: one for the Next.js application and one for Genkit.

*   **For the Next.js app (frontend):**
    Open a terminal and run:
    ```bash
    npm run dev
    ```
    This usually starts the app on `http://localhost:9002`.

*   **For Genkit (AI backend):**
    Open another terminal and run:
    ```bash
    npm run genkit:dev
    ```
    Or, if you want it to automatically restart when AI flow files change:
    ```bash
    npm run genkit:watch
    ```
    This typically starts the Genkit server on `http://localhost:3400` and makes the AI flows available to your Next.js app.

Now, your application should be able to use the AI features by authenticating with your API key.
