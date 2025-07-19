import "dotenv/config"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export default async function getStaticEval(context: any, goal: any) {

    // System prompt: use provided engagement level to guide tone
    const systemPrompt = 
    `
    You are the static evaluation model for a conversation "chess engine". Given a "position" (IE the history of messages between two people), and a goal the user wants to achieve, generate a score from 1-100 describing how close the user is to **GETTING VERBAL CONFIRMAITON** of achieving this goal.

    Grading guidelines:
    1-10: The user has massively screwed up, has offended/insulted the other party and has little to no chance of recovery
    10-30: The user hasn't massively insulted the other party, but is not smooth in their conversation and it making the wrong moves. Not likely to succeed
    30-50: The user is gradually making their way to achieving their goal with the other party. They are making some right moves, but not a very promising position.
    50-80: The user has made promising progress towards the goal based on the tone, sentiment, and direction of the conversation.
    80-100: Verbal confirmation has either already been given, or it seems very likely based on the sentiment/direction of the conversation.

    **DO NOTE OUTPUT ANYTHING OTHER THAN THE SCORE NUMBER**
    `;

    // Convert conversation history to string format
    let conversationContext = "";
    for (const msg of context) {
        conversationContext += `${msg.role}: ${msg.message}\n`;
    }

    const prompt = `
    CONVERSATION HISTORY:
    ${conversationContext}
    GOAL:
    ${goal}`;

    // Generate responses
    const { text } = await generateText({
        model: google("models/gemini-2.0-flash-exp"),
        system: systemPrompt,
        prompt: prompt,
        temperature: 0.8
    });

    return text;
}