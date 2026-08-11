

const Backend_Url =
  process.env.AGENT_URL ||
  "http://agent-service:3000";


export const callAgent = async (
    userId,
    message
) => {

    const response = await fetch(`${Backend_Url}/api/agents`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: message, userId })
    })

    const data = await response.json();
    console.log(data);
    return data.message
}