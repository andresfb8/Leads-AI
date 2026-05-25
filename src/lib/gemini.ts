import { GoogleGenAI } from '@google/genai';

export interface KnowledgeConfig {
  valueProposition: string;
  painPoints: string;
  roles: string;
  companySize: string;
  industries: string;
  geographies: string;
  enrichWebsite: boolean;
  enrichMaps: boolean;
  enrichInstagram: boolean;
}

export const KNOWLEDGE_STORAGE_KEY = 'leads_ai_knowledge_config';

export const DEFAULT_KNOWLEDGE_CONFIG: KnowledgeConfig = {
  valueProposition:
    'Ofrecemos una plataforma de IA para equipos de ventas que reduce el tiempo de prospección manual en un 80% y aumenta las reuniones agendadas calificando basadas en la intención.',
  painPoints:
    '- Bajas tasas de respuesta a correos\n- Mucho tiempo perdido investigando leads\n- Bombardeo de mensajes genéricos',
  roles: 'Fundador, VP de Ventas, CTO',
  companySize: '10 - 200 empleados',
  industries: 'B2B SaaS, Fintech, Tech Services',
  geographies: 'US, UK, España, Latam',
  enrichWebsite: true,
  enrichMaps: true,
  enrichInstagram: false,
};

function getClient(): GoogleGenAI | null {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

function loadKnowledgeConfig(): KnowledgeConfig {
  try {
    const stored = localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as KnowledgeConfig;
  } catch {
    // ignore
  }
  return DEFAULT_KNOWLEDGE_CONFIG;
}

export async function rewriteEmail(
  lead: { name: string; company: string; title: string; painPoint?: string },
  draft: { subject: string; body: string }
): Promise<{ subject: string; body: string }> {
  const ai = getClient();
  if (!ai) {
    return {
      subject: draft.subject,
      body: '[Configura VITE_GEMINI_API_KEY en tu archivo .env para usar la reescritura con IA.]',
    };
  }

  const config = loadKnowledgeConfig();

  const prompt = `Eres un experto en ventas B2B outbound. Reescribe el siguiente correo de prospección de forma más personalizada y persuasiva.

CONTEXTO DEL NEGOCIO:
- Propuesta de valor: ${config.valueProposition}
- Puntos de dolor que resolvemos: ${config.painPoints}
- ICP: Roles (${config.roles}), Tamaño empresa (${config.companySize}), Industrias (${config.industries})

INFORMACIÓN DEL LEAD:
- Nombre: ${lead.name}
- Cargo: ${lead.title}
- Empresa: ${lead.company}
- Punto de dolor detectado: ${lead.painPoint || 'No identificado'}

BORRADOR ACTUAL:
Asunto: ${draft.subject}
Cuerpo:
${draft.body}

INSTRUCCIONES:
- Mantén el tono profesional pero cercano
- El correo debe ser corto (máx. 150 palabras en el cuerpo)
- Personaliza mencionando el pain point del lead
- Termina con una CTA clara y de bajo compromiso
- NO uses frases genéricas como "espero que estés bien"
- Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{"subject": "asunto aquí", "body": "cuerpo del correo aquí"}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]) as { subject: string; body: string };
    if (!parsed.subject || !parsed.body) throw new Error('Invalid JSON structure');
    return parsed;
  } catch (e) {
    console.error('Gemini rewriteEmail error:', e);
    return {
      subject: draft.subject,
      body: draft.body + '\n\n[Error al reescribir. Intenta de nuevo.]',
    };
  }
}

export type InboxClassification = 'Interesado' | 'No Interesado' | 'Objeción/Baja' | 'Pregunta';

export async function classifyInboxMessage(snippet: string): Promise<InboxClassification> {
  const ai = getClient();
  if (!ai) return 'Pregunta';

  const prompt = `Clasifica este mensaje de respuesta a un correo de prospección B2B en una de estas categorías:
- "Interesado": El lead muestra interés en reunirse o saber más
- "No Interesado": El lead rechaza claramente sin querer bajas
- "Objeción/Baja": El lead pide ser eliminado de la lista o expresa rechazo fuerte
- "Pregunta": El lead hace una pregunta o pide más información

Mensaje: "${snippet}"

Responde ÚNICAMENTE con una de estas palabras exactas: Interesado, No Interesado, Objeción/Baja, Pregunta`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    const text = (response.text ?? '').trim();
    const valid: InboxClassification[] = ['Interesado', 'No Interesado', 'Objeción/Baja', 'Pregunta'];
    const match = valid.find(v => text.includes(v));
    return match ?? 'Pregunta';
  } catch (e) {
    console.error('Gemini classifyInboxMessage error:', e);
    return 'Pregunta';
  }
}
