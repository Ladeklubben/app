import { Preferences } from "@capacitor/preferences";
import type { IToken } from "$lib/types/token.types";

/**
 * Singleton class for storing and retrieving token data from Capacitor Preferences
 */
class Token {
    private static instance: Token;
    private readonly STORAGE_KEY = "auth_data";

    private constructor() { }

    /**
     * Create the singleton instance of Token if it doesn't exist
     * @returns The singleton instance of Token
     */
    public static getInstance(): Token {
        if (!Token.instance) {
            Token.instance = new Token();
        }
        return Token.instance;
    }

    /**
     * Set the token data in the Capacitor Preferences
     * @param token - The token to set
     * @param expiresAt - The expiration date of the token
     */
    public setToken(token: string, expiresAt: number): void {
        const tokenStore: IToken = {
            token,
            expiresAt,
        };
        Preferences.set({ key: this.STORAGE_KEY, value: JSON.stringify(tokenStore) });
    }

    /**
     * Get the token data from the Capacitor Preferences
     * @returns The token data or null if it doesn't exist
     */
    public async getLocalStorage(): Promise<IToken | null> {
        try {
            const { value } = await Preferences.get({ key: this.STORAGE_KEY });
            if (!value) return null;
            return JSON.parse(value) as IToken;

        } catch (error) {
            console.error("Error getting auth data:", error);
            return null;
        }

    }

    /**
     * Clear the token data from the Capacitor Preferences
     */
    public async clearLocalStorage(): Promise<void> {
        try {
            await Preferences.remove({ key: this.STORAGE_KEY });
        } catch (error) {
            console.error("Error clearing auth data:", error);
        }
    }

    /**
     * Check if the user is authenticated
     * @returns True if the user is authenticated, false otherwise
     */
    public async isAuthenticated(): Promise<boolean> {
        const auth = await this.getLocalStorage();
        return auth !== null;
    }

    /**
     * Get the token from the auth data
     * @returns The token or null if it doesn't exist
     */
    public async getToken(): Promise<string | null> {
        const auth = await this.getLocalStorage();
        return auth?.token || null;
    }

    /**
     * Get the expiration date of the token
     * @returns The expiration date or null if it doesn't exist
     */
    public async getExpiresAt(): Promise<number | null> {
        const auth = await this.getLocalStorage();
        return auth?.expiresAt || null;
    }
}

export const token = Token.getInstance();