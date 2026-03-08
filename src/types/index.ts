// COCORO Web — Type Definitions

// ========================================
// User Types
// ========================================
export interface User {
    id: string;
    username: string;
    email: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website?: string;
    is_verified: boolean;
    role: "user" | "admin" | "moderator";
    created_at: string;
    updated_at: string;
}

export interface UserProfile extends User {
    followers_count: number;
    following_count: number;
    posts_count: number;
    ai_chats_count: number;
}

// ========================================
// Post Types
// ========================================
export interface Post {
    id: string;
    user_id: string;
    author: string;
    handle: string;
    avatar?: string;
    avatar_bg?: string;
    content: string;
    media_urls: string[];
    is_ai_generated: boolean;
    ai_model?: string;
    tags: string[];
    likes_count: number;
    comments_count: number;
    shares_count: number;
    liked: boolean;
    bookmarked: boolean;
    ai_summary?: string;
    created_at: string;
    updated_at: string;
}

// ========================================
// Comment Types
// ========================================
export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    parent_id?: string;
    content: string;
    is_ai_generated: boolean;
    likes_count: number;
    author: string;
    avatar_url?: string;
    created_at: string;
    replies?: Comment[];
}

// ========================================
// Chat Types
// ========================================
export interface ChatThread {
    id: string;
    user_id: string;
    title: string;
    persona: string;
    message_count: number;
    last_message?: string;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    id: string;
    thread_id: string;
    role: "user" | "assistant";
    content: string;
    model?: string;
    tokens_used?: number;
    timestamp: string;
    created_at: string;
}

export interface ChatPersona {
    name: string;
    icon: string;
    color: string;
    description: string;
    system_prompt: string;
}

// ========================================
// Community Types
// ========================================
export interface Community {
    id: string;
    name: string;
    description: string;
    icon_url?: string;
    banner_url?: string;
    owner_id: string;
    tags: string[];
    has_ai_moderator: boolean;
    member_count: number;
    post_count: number;
    is_public: boolean;
    is_joined: boolean;
    is_trending: boolean;
    created_at: string;
    updated_at: string;
}

// ========================================
// AI Agent Types
// ========================================
export interface AIAgent {
    id: string;
    user_id: string;
    name: string;
    icon: string;
    icon_bg?: string;
    personality: string;
    specialty: string;
    description: string;
    system_prompt: string;
    model: string;
    temperature: number;
    status: "active" | "inactive" | "learning";
    conversation_count: number;
    rating: number;
    is_public: boolean;
    is_own: boolean;
    created_at: string;
    updated_at: string;
}

// ========================================
// Notification Types
// ========================================
export interface Notification {
    id: string;
    user_id: string;
    type: "like" | "comment" | "follow" | "mention" | "ai_message";
    actor_id?: string;
    actor_name?: string;
    actor_avatar?: string;
    post_id?: string;
    comment_id?: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

// ========================================
// API Response Types
// ========================================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
}

export interface AuthResponse {
    success: boolean;
    user: User;
    token: string;
    message: string;
}
