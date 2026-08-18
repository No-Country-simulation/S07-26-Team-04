export interface Citation {
    title?: string;
    publishedAt?: string | null;
    createdAt?: string;
    sections: {
        id: string;
        level: number;
        title: string;
        content: string;
    }[];
};