export interface IFearGreed {
    name: string;
    now: {
        value: string;
        value_classification: string;
        timestamp: string;
        time_until_update: string;
    };
    yesterday: {
        value: string;
        value_classification: string;
        timestamp: string;
    };
    lastWeek: {
        value: string;
        value_classification: string;
        timestamp: string;
    };
}
