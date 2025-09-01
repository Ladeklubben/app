import type { UserInfo, UserMessage } from "$lib/types/user.types";
import { get } from "./api";

export class User {
    private static instance: User;
    private allData: UserMessage | null = null;
    private constructor() { }

    public static getInstance(): User {
        if (!User.instance) {
            User.instance = new User();
        }
        return User.instance;
    }

    /**
     * Fetches all data for the user
     * @returns Promise<UserMessage | null>
     */
    public async getAllData(): Promise<UserMessage | null> {
        this.allData = await get("/user/information") as UserMessage | null;
        return this.allData;
    }

    /**
     * Fetches the user info
     * @returns Promise<UserInfo | null>
     */
    public async getInfo(): Promise<UserInfo | null> {
        if (!this.allData) {
            await this.getAllData();
        }
        return this.allData?.userinfo || null;
    }
}