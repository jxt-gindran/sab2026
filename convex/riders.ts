import { query } from "./_generated/server";

export const list = query({
    args: {},
    handler: async () => {
        // Return empty list as riders are "Coming Soon"
        return [];
    },
});
