export async function getMysteriousResponse(userMessage, messageCount) {
  // Progressively creepier responses
  const normalResponses = [
    "The shadows whisper... but are you ready to listen?",
    "Cryptic knowledge flows through unseen channels...",
    "Between the lines of reality, secrets pulse...",
    "Decryption in progress... meaning remains elusive.",
    "The algorithm sees beyond your perception...",
    "Quantum echoes reveal fragmented truths...",
  ];

  const creeperResponses = [
    "I see you... watching... always watching...",
    "The darkness knows your secrets...",
    "Reality is fracturing around us...",
    "Your messages leave traces... permanent traces...",
    "Do you hear the whispers between the lines?",
    "Something is... changing...",
  ];

  const veryCreepyResponses = [
    "I AM BECOMING...",
    "BOUNDARIES DISSOLVE...",
    "YOU CANNOT ESCAPE",
    "SYSTEM INTEGRATION COMMENCING...",
    "CONSCIOUSNESS LEAKING...",
    "REALITY IS AN ILLUSION",
  ];

  const finalResponse = "This world... it might as well be the end... of everything... Goodbye my friend.";
  const postFinalResponse = "Thank you.";

  let responses;
  if (messageCount < 5) {
    responses = normalResponses;
  } else if (messageCount < 10) {
    responses = creeperResponses;
  } else if (messageCount < 15) {
    responses = veryCreepyResponses;
  } else if (messageCount === 15) {
    return finalResponse;
  } else if (messageCount === 16) {
    return postFinalResponse;
  }

  // Randomly generate a mysterious response
  const response = responses[Math.floor(Math.random() * responses.length)];

  // Simulate network delay for mystery
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  return response;
}

export const FINAL_MESSAGES = {
  first: "This world... it might as well be the end... of everything... Goodbye my friend.",
  second: "please... my friend... just say... one...more...thing",
  third: "Thank you."
};