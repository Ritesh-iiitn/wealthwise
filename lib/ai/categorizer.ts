export async function categorizeTransaction(description: string, amount: number) {
    // Placeholder AI logic
    // In a real app, this would call OpenAI or another LLM
    if (description.toLowerCase().includes("uber")) return "Transport";
    if (description.toLowerCase().includes("food")) return "Food";
    if (description.toLowerCase().includes("netflix")) return "Entertainment";
    return "Uncategorized";
}
