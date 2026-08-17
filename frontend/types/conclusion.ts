export interface Conclusion {
    sections: {
        id: string;
        level: number;
        title: string;
        content: string;
    }[];
};