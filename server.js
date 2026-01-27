import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { HfInference } from '@huggingface/inference'

// Load .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '.env')

if (fs.existsSync(envPath)) {
  try {
    const envRaw = fs.readFileSync(envPath, 'utf-8')
    envRaw.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const idx = trimmed.indexOf('=')
      if (idx > -1) {
        const key = trimmed.substring(0, idx).trim()
        let val = trimmed.substring(idx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        process.env[key] = val
      }
    })
  } catch (e) {
    console.error('Error reading .env:', e.message)
  }
}

const HF_TOKEN = process.env.VITE_HF_ACCESS_TOKEN
if (!HF_TOKEN) {
  console.error('❌ ERROR: VITE_HF_ACCESS_TOKEN not set in environment or .env')
  process.exit(1)
} else {
  console.log('✓ HF_ACCESS_TOKEN loaded successfully')
}

// Initialize Hugging Face Inference client
const hf = new HfInference(HF_TOKEN)

const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. Format the response in markdown.`

async function handleRecipe(ingredientsArr) {
  const ingredientsString = Array.isArray(ingredientsArr) ? ingredientsArr.join(', ') : String(ingredientsArr || '')
  
  try {
    // Using Qwen model which is reliable and supports chat
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`
        }
      ],
      max_tokens: 1024,
      temperature: 0.7
    })
    
    console.log('✓ Recipe generated successfully')
    return response.choices[0].message.content
  } catch (error) {
    console.error('HF Inference error:', error)
    throw new Error(`Failed to generate recipe: ${error.message}`)
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  if (req.url === '/api/recipe' && req.method === 'POST') {
    console.log('📥 Received recipe request')
    try {
      let body = ''
      for await (const chunk of req) body += chunk
      const json = body ? JSON.parse(body) : {}
      console.log('Ingredients:', json.ingredientsArr)
      
      const content = await handleRecipe(json.ingredientsArr)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ content, success: true }))
    } catch (err) {
      console.error('❌ Server error:', err.message)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message, success: false }))
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`)
  console.log(`📡 Ready to receive recipe requests`)
})