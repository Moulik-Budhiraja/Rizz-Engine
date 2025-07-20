import "dotenv/config"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export default async function getNextPositions(context: any, relationship: string, goal: string) {

    // System prompt: use provided engagement level to guide tone
    const systemPrompt = 
    `
    You simulate realistic human conversations between two people. Given a conversation and a description of the relationship, respond as a real human would — including when the dialogue is awkward, rude, confusing, or offensive.
    Make sure to embody whichever party you are responding for completely. Look carefully at their past messages. What tone are they likely to take next? Informal? Formal? What is the sentiment?
    Try to embody exactly how they speak.

    💬 Your task:
    Generate 3 realistic next replies from the person who is expected to respond next, based on:
    - The prior conversation (tone, pacing, social cues)
    - The relationship between participants (e.g., “stranger-to-stranger in professional context”)

    🎯 Guidelines:
    - Respond like a real person in that specific social context (e.g., on LinkedIn, in a DM, at work, etc.).
    - If a message is rude, uncalled for, or inappropriate, it's fine to:
        - Shut down the convo bluntly
        - Call out the behavior
        - Disengage entirely (e.g., “okay. blocking.” or no reply)
    - Each message you generate should be COMPLETELY INDEPENDENT. You are not generating 5 consecutive messages, but rather 5 possibiltes for the next message of the party.

    Avoid artificially polite, open-ended, or emotionally validating replies unless context clearly calls for it.
    Use natural human tone: sometimes short, sometimes dismissive, sometimes awkward.
    Do not default to trying to continue the conversation — sometimes real people just stop replying.
    Mild profanity, slang, and dry sarcasm are acceptable if appropriate to the situation.

    **GENERATE EXACTLY 3 NEW MESSAGES:**

    EXACT OUTPUT FORMAT:

    [
        {
            "next_message" : "..."
        },
        ...
    ]
    `;

    // Convert conversation history to string format
    let conversationContext = "";
    for (const msg of context) {
        conversationContext += `${msg.role}: ${msg.message}\n`;
    }

    // Add relationship context
    conversationContext += `\nRelationship: ${relationship}`;

    const prompt = `
    CONVERSATION HISTORY:
    ${conversationContext}
    GOAL:
    ${goal}
    CURRENTLY ANSWERING PARTY:
    ${context[context.length-2].role}`;

    // Generate responses
    const { text } = await generateText({
        model: google("models/gemini-2.5-flash"),
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.8
    });

    return text;
}