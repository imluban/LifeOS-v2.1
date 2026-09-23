// Groq periodically deprecates older free-tier models (it happened to
// llama-3.3-70b-versatile in August 2026). Keeping the model id here means
// a future migration is a one-line change instead of hunting through every
// API route. Override via env var if you want to pin/test a different
// model without a code change.
//
// openai/gpt-oss-120b is Groq's current recommended free-tier replacement
// for the retired llama-3.3-70b-versatile model — same free-tier access,
// no credit card required, generous rate limits.
export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
