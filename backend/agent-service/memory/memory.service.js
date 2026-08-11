import CustomerMemory from "./models/customer.memory.js";

export const loadMemory = async (
    customerId
) => {
    let memory =
        await CustomerMemory.findOne({
            customerId,
        });

    if (!memory) {
        memory =
            await CustomerMemory.create({
                customerId,
            });
    }

    return memory;
}


export const addMessage = async (
    customerId,
    role,
    content
) => {
    const memory =
        await loadMemory(customerId);
    memory.lastMessages.push({
        role,
        content,
    });

    if (
        memory.lastMessages.length > 20
    ) {
        memory.lastMessages =
            memory.lastMessages.slice(-10);
    }

    await memory.save();

    return memory;
}