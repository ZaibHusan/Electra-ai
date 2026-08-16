// router/systemCheckDecision.js

export const systemCheckDecision = (state) => {
    // Check if AI is active
    if (state.isAiActive === true) {
        return "continue"; // Proceed to loadMemory
    }
    
    // System is inactive or error occurred
    console.log("[Router] System is inactive. Ending workflow.");
    return "end"; // Stop workflow and go to END
};