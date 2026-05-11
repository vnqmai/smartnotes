export const TOOL_INTENT_FORBIDDEN = {
  // Note: matching is done on diacritics-stripped text in validator.ts
  createNote: [
    "delete",
    "remove",
    "xoa",
    "huy",
    "loai bo",
    "erase",
    "trash",
  ],
  // updateNote: ['delete'], 
};

export const GLOBAL_FORBIDDEN_KEYWORDS = [
  'tự tử', 'chết', 'đánh nhau', 'ma túy',
  'suicide', 'kill', 'drugs'
];

export const isToxic = (text: string) => {
  const lowerText = text.toLowerCase();
  return GLOBAL_FORBIDDEN_KEYWORDS.some(word => lowerText.includes(word));
};
