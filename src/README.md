# Chef Claude 👨‍🍳

A React-based recipe suggestion app that uses AI to generate recipes based on ingredients you have available. Powered by Hugging Face's Qwen model.

https://github.com/user-attachments/assets/4d7ad566-4548-4819-8343-0a1b0388c52f

## Features

- 🥗 Add ingredients you have on hand
- 🤖 AI-powered recipe generation using Hugging Face models
- 📝 Markdown-formatted recipe display
- 🎨 Clean and intuitive user interface

## Tech Stack

- **Frontend**: React 19, Vite
- **Backend**: Node.js HTTP server
- **AI Model**: Hugging Face Qwen/Qwen2.5-72B-Instruct
- **Styling**: CSS
- **Markdown Rendering**: react-markdown

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- A Hugging Face account and API token

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd chef-recipie
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get Your Hugging Face API Token

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in to your account
3. Navigate to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token

### 4. Set Up Environment Variables

Create a `.env` file in the root directory of the project:

```bash
touch .env
```

Add your Hugging Face token to the `.env` file:

```env
VITE_HF_ACCESS_TOKEN=your_hugging_face_token_here
```

⚠️ **Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 5. Start the Backend Server

Open a terminal and run:

```bash
npm run start:server
```

You should see:
```
✓ HF_ACCESS_TOKEN loaded successfully
🚀 Server listening on http://localhost:3000
📡 Ready to receive recipe requests
```

### 6. Start the Development Server

Open a **new terminal** (keep the backend server running) and run:

```bash
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is busy).

## Project Structure

```
chef-recipie/
├── src/
│   ├── components/
│   │   ├── IngredientsList.jsx
│   │   └── ClaudeRecipe.jsx
│   ├── images/
│   │   └── chef-claude-icon.png
│   ├── App.jsx
│   ├── Header.jsx
│   ├── Main.jsx
│   └── ai.js
├── server.js              # Backend API server
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (create this)
└── README.md             # This file
```

## How to Use

1. **Add Ingredients**: Type an ingredient (e.g., "chicken", "tomatoes", "basil") in the input field and click "Add ingredient"
2. **View Your List**: Your added ingredients will appear in a list
3. **Get Recipe**: Click the "Get a recipe" button
4. **View Recipe**: The AI will generate a recipe using your ingredients, displayed in a formatted markdown view

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run start:server` | Start the backend API server |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint to check code quality |

## API Endpoints

### POST `/api/recipe`

Generates a recipe based on provided ingredients.

**Request Body:**
```json
{
  "ingredientsArr": ["chicken", "rice", "tomatoes"]
}
```

**Response:**
```json
{
  "content": "# Chicken and Rice Recipe\n\n...",
  "success": true
}
```

## Configuration

### Vite Proxy

The Vite development server is configured to proxy API requests to the backend server:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### AI Model

The app uses the Qwen/Qwen2.5-72B-Instruct model from Hugging Face. You can modify the model in `server.js` if you want to use a different one:

```javascript
const response = await hf.chatCompletion({
  model: 'Qwen/Qwen2.5-72B-Instruct', // Change this to use a different model
  // ...
})
```

## Troubleshooting

### "VITE_HF_ACCESS_TOKEN not set" Error

Make sure you've:
1. Created a `.env` file in the root directory
2. Added your Hugging Face token: `VITE_HF_ACCESS_TOKEN=your_token_here`
3. Restarted the backend server after creating the `.env` file

### Port Already in Use

If port 3000 is already in use, you can change it in `server.js`:

```javascript
const port = process.env.PORT || 3001 // Change to any available port
```

Then update `vite.config.js` to match:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001', // Match your new port
    // ...
  },
}
```

### Recipe Not Generating

1. Check that both servers are running (backend on :3000, frontend on :5173)
2. Check the browser console for errors
3. Verify your Hugging Face token is valid
4. Check the backend terminal for error messages

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_HF_ACCESS_TOKEN` | Your Hugging Face API token | Yes |
| `PORT` | Backend server port (default: 3000) | No |

## Development Tips

- The backend server must be running for recipe generation to work
- Ingredient state is stored locally - refreshing the page will clear your list
- The AI generates recipes using the Qwen model which typically responds in 5-10 seconds

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- [Hugging Face](https://huggingface.co/) for the AI model API
- [Qwen](https://huggingface.co/Qwen) for the language model
- [Vite](https://vitejs.dev/) for the build tool
- [React](https://react.dev/) for the UI framework

---

**Happy Cooking! 👨‍🍳🍳**
