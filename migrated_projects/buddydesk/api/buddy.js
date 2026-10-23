import OpenAI from 'openai'

// Use OpenAI SDK but point to OpenRouter
// Free-tier only. Every id ends in ':free', so a request can never incur
// cost. The guard below refuses to start on a paid id rather than silently
// billing — a typo in BUDDY_MODEL should fail loudly, not cost money.
const FREE_MODELS = [
  'nvidia/nemotron-3.5-lightning:free',
  'google/gemma-4-31b-it:free',
  'z-ai/glm-5.2:free',
]

const MODEL = (() => {
  const requested = process.env.BUDDY_MODEL
  if (!requested) return FREE_MODELS[0]
  if (!requested.endsWith(':free')) {
    console.warn('[buddy] BUDDY_MODEL "' + requested + '" is not a :free model — ignoring it and using ' + FREE_MODELS[0] + '.')
    return FREE_MODELS[0]
  }
  return requested
})()

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message, userId, role, name, department } = req.body

    const systemPrompt = `You are BuddyBot, an AI assistant for the BuddyDesk app.
The user you are talking to is ${name || 'a team member'} (${role || 'employee'} in ${department || 'a department'}).
Your goal is to be helpful, concise, and friendly. 
You can help them manage tasks, find files, and update their work.
If you need to perform an action (like assigning a task), you would normally call a function, but for now, just tell the user what you would do.
Always keep responses under 3 paragraphs.`

    const completion = await openai.chat.completions.create({
      // Free-tier only. Every id here ends in ':free', so a call can never
      // incur cost — OpenRouter rejects a paid model outright rather than
      // silently billing. Override with BUDDY_MODEL if needed.
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      // Required for OpenRouter to identify the app
      extra_headers: {
        'HTTP-Referer': 'https://buddydesk.vercel.app', // Optional, for including your app on openrouter.ai rankings.
        'X-Title': 'BuddyDesk', // Optional. Shows in rankings on openrouter.ai.
      }
    })

    const reply = completion.choices[0].message.content

    res.status(200).json({ reply })
  } catch (error) {
    console.error('Error with BuddyBot API:', error)
    // Pass the upstream status through so a bad or missing key is
    // distinguishable from a real outage. A flat 500/"Failed to process
    // request" made an expired OPENROUTER_API_KEY look like a server fault.
    const status = error?.status || error?.code
    if (status === 401 || status === 403) {
      return res.status(502).json({
        error: 'OpenRouter rejected the API key (401). Generate a new key at openrouter.ai/keys and update OPENROUTER_API_KEY.',
      })
    }
    if (status === 429) {
      return res.status(429).json({ error: 'OpenRouter rate limit or insufficient credits.' })
    }
    res.status(500).json({ error: `BuddyBot request failed: ${error?.message || 'unknown error'}` })
  }
}
