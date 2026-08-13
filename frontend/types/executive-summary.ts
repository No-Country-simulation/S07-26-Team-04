export interface ExecutiveSummary {
    sections: {
        id: string;
        level: number;
        title: string;
        content: string;
    }[];
};