import getNextPositions from "./nextPositions"
import getStaticEval from "./staticEval"
import { formatLLMResponse } from "./util"

let messages = [

{ role: "party1", message: "Hey, you're cute. Mind if I take you out sometime?" },

{ role: "party2", message: "Wow not even a pickup line? lol" },

{ role: "party1", message: "Didn't think I needed one, you're already smiling. 😉"},

{ role: "party2", message: "okay that was kinda smooth lol"},

{ role: "party1", message: "It's ok, I can explain it on our date 😉"}

]

const relationship = "We are random people I don't know her"
const goal = "Get a date"

const responses = JSON.parse(formatLLMResponse(await getNextPositions(
    messages,
    relationship
)))

for (const response of responses)
{
    messages.push({role : messages[messages.length-2].role, message: response.next_message})

    console.log("SEARCHING");
    console.log(messages);
    console.log(await getStaticEval(messages, goal));

    messages.pop()
    
}
