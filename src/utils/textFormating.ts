/**
 * Converts camelCase or PascalCase text to normal case with spaces
 * @param text - The text to convert
 * @returns The converted text with proper spacing and capitalization
 */
export const toNormalCase = (text: string): string => {
  if (!text) return "";

  return (
    text
      // Insert a space before any uppercase letter that follows a lowercase letter
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Insert a space before any uppercase letter that follows a number
      .replace(/([0-9])([A-Z])/g, "$1 $2")
      // Insert a space before any number that follows a letter
      .replace(/([A-Za-z])([0-9])/g, "$1 $2")
      // Clean up any multiple spaces
      .replace(/\s+/g, " ")
      .trim()
      // Convert entire string to lowercase first
      .toLowerCase()
      // Capitalize only the first letter of the entire string
      .replace(/^./, (char) => char.toUpperCase())
  );
};
