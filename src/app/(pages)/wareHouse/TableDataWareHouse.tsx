'use client';
import { useWareHouses } from 'app/hooks/useWareHouses';
import DataTable from 'components/table/DataTable';
import {
  Column,
  ColumnFormat,
  TableButtons,
} from 'components/table/interface/interfaceTable';
import { EntityTable } from 'components/table/interface/tableEntitys';

export const TableDataWareHouse = () => {
  const { warehouses } = useWareHouses(true);

  return (
    <DataTable
      data={warehouses}
      columns={columnsWareHouse}
      entity={EntityTable.WAREHOUSE}
      tableButtons={tableButtons}
    />
  );
};
const tableButtons: TableButtons = {
  edit: true,
  detail: true,
};
const columnsWareHouse: Column[] = [
  {
    label: 'ID',
    key: 'id',
    format: ColumnFormat.TEXT,
  },
  {
    label: 'Codi OT',
    key: 'code',
    format: ColumnFormat.TEXT,
  },
  {
    label: 'Descripció',
    key: 'description',
    format: ColumnFormat.TEXT,
  },
];
