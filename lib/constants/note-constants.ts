export const FORBIDDEN_CREATE_KEYWORDS = [
  'delete', 'remove', 'discard', 'erase', 'destroy',
  'xóa', 'huỷ', 'loại bỏ', 'dẹp'
];

export const isViolatingCreateIntent = (content: string) => {
  const lowerContent = content.toLowerCase();
  return FORBIDDEN_CREATE_KEYWORDS.some(word => lowerContent.includes(word));
};