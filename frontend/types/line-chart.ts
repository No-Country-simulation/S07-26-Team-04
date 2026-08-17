export interface LineChartSeries {
    dataKey: string;
    label: string;
    axisLabel: string;
    valueSuffix: string;
}

export interface FailureModeData {
    name: string;
    value: number;
}

export interface LineChartMetrics {
    chartType: string;

    meta: {
        title: string;
        description: string;
    };

    xKey: string;

    xAxisLabel: string;

    series: LineChartSeries[];

    layout: string;

    data: FailureModeData[];
}

export interface LineChartFigure {
    figure2: LineChartMetrics
}

export interface LineChart {
    charts: LineChartFigure;
}