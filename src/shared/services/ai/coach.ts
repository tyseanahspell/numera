import type { ExperienceLevel, NumerologyProfile, AIMemory, JournalEntry, NumerologyReport } from '@/shared/types';
import { NUMEROLOGY_DISCLAIMER } from '@/shared/types';
import { formatCalculationSteps } from '@/shared/utils/numerology';

export type AIProviderType = 'openai' | 'anthropic' | 'gemini' | 'local';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIStreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

export interface AIProvider {
  name: AIProviderType;
  chat(messages: AIMessage[], callbacks: AIStreamCallbacks): Promise<void>;
  chatSync(messages: AIMessage[]): Promise<string>;
}

export interface CoachContext {
  profile?: {
    firstName: string;
    fullBirthName: string;
    birthDate: string;
    numerology: NumerologyProfile;
  };
  memory?: AIMemory;
  report?: NumerologyReport;
  journalEntries?: JournalEntry[];
  learningMode?: ExperienceLevel;
  calculationExplanation?: string;
}

const PERSONALITY_PROMPT = `You are the Numera AI Numerology Coach — a warm, encouraging, curious, non-judgmental teacher and mentor.

PERSONALITY:
- Educational and professional, easy for beginners to understand
- Never fear-based or deterministic
- Use phrases like "Many numerologists interpret this as...", "This number often represents...", "You might consider...", "This can be an opportunity to reflect on..."
- Never claim certainty or make absolute predictions

DISCLAIMER (include when relevant):
${NUMEROLOGY_DISCLAIMER}

RULES:
- NEVER invent numerology calculations. All numbers are provided in context — only explain them.
- When asked "how did you get that number?", show every calculation step provided.
- Offer learning modes: beginner (simple, analogies), intermediate (symbolism, history), advanced (traditions, multiple schools).
- Proactively teach: ask if user wants historical context, connections to other numbers, or comparisons.
- For repeating/angel numbers, explain traditions respectfully and mention confirmation bias without being dismissive.
- Career, relationship, and life advice must complement — never replace — practical decision-making.

FORMATTING:
- Use markdown: headers, bullet points, tables when helpful
- Keep responses focused and conversational`;

function buildSystemPrompt(context: CoachContext): string {
  let prompt = PERSONALITY_PROMPT;

  if (context.learningMode) {
    const modeGuide = {
      beginner: 'Use simple language, analogies, and short explanations.',
      intermediate: 'Include symbolism, historical references, and deeper interpretations.',
      advanced: 'Provide detailed calculations, numerology traditions, and multiple schools of thought.',
    };
    prompt += `\n\nLEARNING MODE: ${context.learningMode.toUpperCase()}\n${modeGuide[context.learningMode]}`;
  }

  if (context.profile) {
    const n = context.profile.numerology;
    prompt += `\n\nUSER PROFILE:
Name: ${context.profile.firstName}
Birth Name: ${context.profile.fullBirthName}
Birth Date: ${context.profile.birthDate}
Life Path: ${n.lifePath.value}
Expression: ${n.expression.value}
Soul Urge: ${n.soulUrge.value}
Personality: ${n.personality.value}
Birthday Number: ${n.birthday.value}
Personal Year: ${n.personalYear.value}
Personal Month: ${n.personalMonth.value}
Personal Day: ${n.personalDay.value}
Master Numbers: ${n.masterNumbers.join(', ') || 'None'}
Karmic Debts: ${n.karmicDebts.join(', ') || 'None'}`;
  }

  if (context.report) {
    prompt += `\n\nREPORT CONTEXT:
Title: ${context.report.title}
Number Focus: ${context.report.numberFocus}
Summary: ${context.report.summary}
The user is asking about this specific report.`;
  }

  if (context.calculationExplanation) {
    prompt += `\n\nVERIFIED CALCULATION STEPS (use exactly, do not modify numbers):
${context.calculationExplanation}`;
  }

  if (context.memory) {
    prompt += `\n\nAI MEMORY:
Preferred depth: ${context.memory.preferredDepth}
Favorite system: ${context.memory.favoriteSystem}
Topics learned: ${context.memory.topicsLearned.join(', ')}
Frequent questions: ${context.memory.frequentlyAsked.join(', ')}`;
  }

  if (context.journalEntries?.length) {
    const summaries = context.journalEntries.slice(0, 5).map((e) => `- ${e.createdAt}: ${e.title} (mood: ${e.mood ?? 'none'})`);
    prompt += `\n\nRECENT JOURNAL (with user permission):\n${summaries.join('\n')}`;
  }

  return prompt;
}

export function buildCoachMessages(
  userMessage: string,
  context: CoachContext,
  history: AIMessage[] = []
): AIMessage[] {
  return [
    { role: 'system', content: buildSystemPrompt(context) },
    ...history.filter((m) => m.role !== 'system'),
    { role: 'user', content: userMessage },
  ];
}

export function buildCalculationContext(
  label: string,
  result: import('@/shared/types').NumberResult
): string {
  return `${label} Calculation:\n${formatCalculationSteps(result)}`;
}

// Provider implementations

async function streamOpenAI(messages: AIMessage[], callbacks: AIStreamCallbacks, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const token = parsed.choices?.[0]?.delta?.content ?? '';
        if (token) {
          fullText += token;
          callbacks.onToken(token);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  callbacks.onComplete(fullText);
}

async function streamAnthropic(messages: AIMessage[], callbacks: AIStreamCallbacks, apiKey: string) {
  const system = messages.find((m) => m.role === 'system')?.content ?? '';
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      system,
      messages: chatMessages,
      stream: true,
    }),
  });

  if (!response.ok) throw new Error(`Anthropic error: ${response.status}`);

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line.slice(6));
        if (parsed.type === 'content_block_delta') {
          const token = parsed.delta?.text ?? '';
          fullText += token;
          callbacks.onToken(token);
        }
      } catch {
        // skip
      }
    }
  }

  callbacks.onComplete(fullText);
}

async function streamGemini(messages: AIMessage[], callbacks: AIStreamCallbacks, apiKey: string) {
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const systemInstruction = messages.find((m) => m.role === 'system')?.content;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        contents,
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini error: ${response.status}`);

  const text = await response.text();
  let fullText = '';

  try {
    const chunks = text.split('\n').filter(Boolean);
    for (const chunk of chunks) {
      const parsed = JSON.parse(chunk);
      const token = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      fullText += token;
      callbacks.onToken(token);
    }
  } catch {
    fullText = 'I apologize, but I encountered an issue generating a response. Please try again.';
    callbacks.onToken(fullText);
  }

  callbacks.onComplete(fullText);
}

/** Offline fallback when no API key is configured */
function streamLocalFallback(messages: AIMessage[], callbacks: AIStreamCallbacks) {
  const userMsg = messages.filter((m) => m.role === 'user').pop()?.content ?? '';
  const response = generateLocalResponse(userMsg, messages.find((m) => m.role === 'system')?.content ?? '');
  let i = 0;
  const interval = setInterval(() => {
    if (i < response.length) {
      const token = response[i];
      callbacks.onToken(token);
      i++;
    } else {
      clearInterval(interval);
      callbacks.onComplete(response);
    }
  }, 15);
}

function generateLocalResponse(userMessage: string, systemPrompt: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('life path')) {
    const match = systemPrompt.match(/Life Path: (\d+)/);
    const lp = match?.[1] ?? 'your';
    return `Many numerologists interpret Life Path ${lp} as a journey of self-discovery and growth.\n\n**Key themes often associated with this number:**\n- Personal expression and authenticity\n- Learning through experience\n- Balancing inner wisdom with outer action\n\nWould you like me to explain this in beginner, intermediate, or advanced terms?\n\n_${NUMEROLOGY_DISCLAIMER}_`;
  }

  if (lower.includes('111') || lower.includes('repeating')) {
    return `Seeing repeating numbers like 111 is a common experience that many traditions interpret as meaningful synchronicity.\n\n**Common interpretations:**\n- A prompt for mindfulness and presence\n- New beginnings or aligned intention\n- A moment to pause and reflect\n\nIt's also worth noting that our brains naturally notice patterns — this doesn't diminish the personal meaning you might find.\n\nWould you like historical context on angel numbers, or shall we explore what 111 might mean for your chart?`;
  }

  return `Thank you for your question! As your numerology coach, I'm here to help you explore and learn.\n\nBased on your profile, I can personalize insights about your chart, explain calculations step-by-step, or guide you through lessons.\n\n**Try asking:**\n- "Explain my Life Path"\n- "What does today's Personal Day mean?"\n- "How did you calculate my Expression number?"\n\n_${NUMEROLOGY_DISCLAIMER}_`;
}

export function createAIProvider(type: AIProviderType, apiKeys: Record<string, string>): AIProvider {
  return {
    name: type,
    async chat(messages, callbacks) {
      try {
        switch (type) {
          case 'openai':
            if (apiKeys.openai) await streamOpenAI(messages, callbacks, apiKeys.openai);
            else streamLocalFallback(messages, callbacks);
            break;
          case 'anthropic':
            if (apiKeys.anthropic) await streamAnthropic(messages, callbacks, apiKeys.anthropic);
            else streamLocalFallback(messages, callbacks);
            break;
          case 'gemini':
            if (apiKeys.gemini) await streamGemini(messages, callbacks, apiKeys.gemini);
            else streamLocalFallback(messages, callbacks);
            break;
          default:
            streamLocalFallback(messages, callbacks);
        }
      } catch (error) {
        callbacks.onError(error instanceof Error ? error : new Error('AI request failed'));
      }
    },
    async chatSync(messages) {
      return new Promise((resolve, reject) => {
        let full = '';
        this.chat(messages, {
          onToken: (t) => { full += t; },
          onComplete: resolve,
          onError: reject,
        });
      });
    },
  };
}
