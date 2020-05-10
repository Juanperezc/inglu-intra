export interface ITableHeaders {
    columnTitle: string;
    columnName: string;
    iconClass: string;
    formatter?: any;
    tcColor: string;
    tcFontSize: number;
    tcType: string;
    tcActions: ITableActions[];
  }
  export interface ITableActions {
    afterIcon: string;
    view:  string;
    size: string;
    handleClick : string;
  }