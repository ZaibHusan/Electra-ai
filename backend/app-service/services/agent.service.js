

const Backend_Url =
  process.env.AGENT_URL ||
  "http://localhost:3000";

console.log(Backend_Url);



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