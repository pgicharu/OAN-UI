// Placeholder API for Speech-to-Text (STT)

export async function transcribeAudio(blob: Blob): Promise<string> {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 1500));

	console.log("Transcribing audio blob of size:", blob.size);

	// Simulate success (90% success rate)
	if (Math.random() > 0.1) {
		const dummySentences = [
			"What support is available for a 45HP tractor in Nakuru?",
			"How do I apply for dairy farming support?",
			"What are today's market prices for maize in Kitale?",
			"Tell me about the government fertiliser subsidy programme."
		];
		const randomTranscribedText =
			dummySentences[Math.floor(Math.random() * dummySentences.length)] || "";
		return Promise.resolve(randomTranscribedText);
	} else {
		return Promise.reject(new Error("Transcription service failed"));
	}
}
