export interface Hero {
    title: string;
    subtitle: string;
    description: string;
    version: string;
    publishedAt: string;
    sections: {
        id: string;
        level: number;
        title: string;
        content: string;
    }[];
};