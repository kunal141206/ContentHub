import { users, userPreferences, favorites, contentItems, type User, type InsertUser, type UserPreferences, type InsertUserPreferences, type Favorite, type InsertFavorite, type ContentItem, type InsertContentItem } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;
  
  getFavorites(userId: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, contentId: string): Promise<boolean>;
  
  getContentItems(type?: string, limit?: number, offset?: number): Promise<ContentItem[]>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  searchContentItems(query: string, limit?: number): Promise<ContentItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userPreferences: Map<number, UserPreferences>;
  private favorites: Map<string, Favorite>;
  private contentItems: Map<number, ContentItem>;
  private currentUserId: number;
  private currentPreferencesId: number;
  private currentFavoriteId: number;
  private currentContentId: number;

  constructor() {
    this.users = new Map();
    this.userPreferences = new Map();
    this.favorites = new Map();
    this.contentItems = new Map();
    this.currentUserId = 1;
    this.currentPreferencesId = 1;
    this.currentFavoriteId = 1;
    this.currentContentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (pref) => pref.userId === userId,
    );
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = this.currentPreferencesId++;
    const now = new Date();
    const userPref: UserPreferences = { 
      ...preferences, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.userPreferences.set(id, userPref);
    return userPref;
  }

  async updateUserPreferences(userId: number, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(userId);
    if (!existing) {
      throw new Error("Preferences not found");
    }
    
    const updated: UserPreferences = {
      ...existing,
      ...preferences,
      updatedAt: new Date(),
    };
    
    this.userPreferences.set(existing.id, updated);
    return updated;
  }

  async getFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      (fav) => fav.userId === userId,
    );
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const fav: Favorite = { 
      ...favorite, 
      id, 
      createdAt: new Date() 
    };
    this.favorites.set(`${favorite.userId}-${favorite.contentId}`, fav);
    return fav;
  }

  async removeFavorite(userId: number, contentId: string): Promise<boolean> {
    const key = `${userId}-${contentId}`;
    return this.favorites.delete(key);
  }

  async getContentItems(type?: string, limit = 20, offset = 0): Promise<ContentItem[]> {
    let items = Array.from(this.contentItems.values());
    
    if (type) {
      items = items.filter(item => item.type === type);
    }
    
    return items
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
      .slice(offset, offset + limit);
  }

  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const id = this.currentContentId++;
    const contentItem: ContentItem = { 
      ...item, 
      id, 
      createdAt: new Date() 
    };
    this.contentItems.set(id, contentItem);
    return contentItem;
  }

  async searchContentItems(query: string, limit = 10): Promise<ContentItem[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.contentItems.values())
      .filter(item => 
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description?.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
