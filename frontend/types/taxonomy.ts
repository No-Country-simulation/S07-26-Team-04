export interface Taxonomy {
    sections: {
        id: string;
        level: number;
        title: string;
        content: string;
    }[];
};

export interface TaxonomyItem {
    id: string;
    level: number;
    title: string;
    content: string;
}

export interface TaxonomyLayerProps {
    layer: TaxonomyItem;
    items: TaxonomyItem[];
}