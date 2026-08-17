export interface BarChartSeries {
    dataKey: string;
    label: string;
    valueSuffix: string;
}

export interface PueContextData {
    layer: string;
    value: number;
}

export interface PueContext {
    chartType: string;
    meta: {
        title: string;
        description: string;
    };
    nameKey: string;
    valueKey: string;
    data: PueContextData[];
}

export interface FailureModeData {
    name: string;
    value: number;
}

export interface BarChartMetrics {
    chartType: string;

    meta: {
        title: string;
        description: string;
    };

    xKey: string;

    series: BarChartSeries[];

    layout: string;

    data: FailureModeData[];

    pueContext: PueContext;
}

export interface BarChart {
    metrics: BarChartMetrics;
}