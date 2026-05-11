import { isToxic, TOOL_INTENT_FORBIDDEN } from "./rules";

export function validateToolInput(toolName: string, content: string) {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // strip diacritics

  const normalizedContent = normalize(content);

  if (isToxic(content)) {
    return { isValid: false, error: "Content is toxic." };
  }

  const forbiddenWords = TOOL_INTENT_FORBIDDEN[toolName as keyof typeof TOOL_INTENT_FORBIDDEN];
  if (forbiddenWords?.some(word => normalizedContent.includes(normalize(word)))) {
    return { 
      isValid: false, 
      error: `This action is not allowed in the ${toolName} tool.` 
    };
  }

  return { isValid: true };
}
