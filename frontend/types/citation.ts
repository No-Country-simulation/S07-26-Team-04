export interface Citation {
    sections: {
        id: string;
        level: number;
        title: string;
        content: string;
    }[];
};