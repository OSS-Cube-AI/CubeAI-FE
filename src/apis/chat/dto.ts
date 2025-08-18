type RoleType = 'user' | 'assistant' | 'system';

export interface ConversationPostRequest {
  conversation: {
    content: string;
    role: RoleType;
  }[];
}

export interface ConversationResponse {
  conversation: {
    content: string;
    role: RoleType;
  }[];
}