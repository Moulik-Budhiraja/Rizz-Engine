import getNextPositions from "./nextPositions"
import getStaticEval from "./staticEval"
import { formatLLMResponse } from "./util"

let messages = [
    { role: "party1", message: "Hi mom can i borrow 100 dollars" },
    { role: "party2", message: "did you do the chores?" },
    { role: "party1", message: "Yep! And I cleaned my room!" }
]

const relationship = "she's my mom"
const goal = "i want 100 dollars"

async function search(messages: any[], relationship: string, goal: string, depth: number) {

    if (depth == 5) {
        // Base case: When we've reached max depth, evaluate the current state
        const evaluation = await getStaticEval(messages, goal);
        console.log("Leaf node reached:");
        console.log("Messages:", messages);
        console.log("Evaluation:", evaluation);
        return evaluation; // Don't return any value
    }

    // Get potential next positions in the conversation as a string
    const rawResponse = await getNextPositions(messages, relationship, messages[messages.length-2].role == "party1" ? goal : "NONE");
    
    // Format the LLM response
    const formattedResponse = formatLLMResponse(rawResponse);
    
    // Convert formatted string to JSON
    const nextPositions = JSON.parse(formattedResponse);
    
    // Search all possible next positions in parallel
    let evaluations = await Promise.all(
        nextPositions.map(async (nextPosition) => {
            // Create a new messages array with the next position added
            const newMessages = [...messages, {role: messages[messages.length-2].role, message: nextPosition.next_message}];
            
            // Recursively search from this new state without caring about return value
            return await search(newMessages, relationship, goal, depth + 1);
        })
    );

    // Calculate the average evaluation score
    const sum = evaluations.reduce((acc, curr) => acc + curr, 0);
    const average = evaluations.length > 0 ? sum / evaluations.length : 0;
    
    return average;
}

console.log(await search(messages, relationship, goal, 1))