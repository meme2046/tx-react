export interface IHeaderColumn {
    id: string;
    name: string;
    enableSorting?: boolean;
    enableColumnFilter?: boolean;
    selectItems?: { key: string, name: string }[];
}