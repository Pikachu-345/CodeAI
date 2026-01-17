export type Step = {
  type: 'file';
  filePath: string;
  content: string;
};

export type ParsedResponse = {
  text: string; // Clean text for the chat UI
  steps: Step[]; // Code updates for the Sandbox
};

export function parseResponse(rawContent: string): ParsedResponse {
  const steps: Step[] = [];

  // 1. Extract Artifacts (Code)
  // Looks for <action type="file" filePath="...">CONTENT</action>
  const actionRegex = /<action\s+type="file"\s+filePath="([^"]+)">([\s\S]*?)<\/action>/g;

  let match;
  while ((match = actionRegex.exec(rawContent)) !== null) {
    steps.push({
      type: 'file',
      filePath: match[1], // Group 1: filePath
      content: match[2].trim(), // Group 2: Code content
    });
  }

  // 2. Extract Text (Chat)
  // Removes the entire <artifact> block to show only the conversation in chat
  const artifactRegex = /<artifact[\s\S]*?>[\s\S]*?<\/artifact>/g;
  const cleanText = rawContent.replace(artifactRegex, '').trim();

  return {
    text: cleanText,
    steps,
  };
}