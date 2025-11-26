import { createGroqModel, formatMessages } from '../aiClient.js';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ClinicAssistantAgent {
  constructor() {
    this.model = createGroqModel(0.7);
    this.systemPrompt = null;
  }

  async loadPrompt() {
    if (!this.systemPrompt) {
      const promptPath = path.join(__dirname, '../prompts/clinicAssistant.txt');
      this.systemPrompt = await fs.readFile(promptPath, 'utf-8');
    }
  }

  async invoke(input, history = []) {
    await this.loadPrompt();
    
    const messages = [
      new SystemMessage(this.systemPrompt),
      ...formatMessages(history),
      new HumanMessage(input),
    ];

    const response = await this.model.invoke(messages);
    return response.content;
  }
}
