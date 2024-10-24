import { SparePartsConsumedsReport } from "app/interfaces/SparePart";
import { columnsSparePartConsumedReport } from "./columnsReport";
import DataTable from "components/table/DataTable";
import {
  Filters,
  FiltersFormat,
  TableButtons,
} from "components/table/interfaceTable";
import { EntityTable } from "components/table/tableEntitys";

interface SparePartsConsumedReportTableProps {
  sparePartsConsumeds: SparePartsConsumedsReport[];
}
const tableButtons: TableButtons = {
  edit: false,
  delete: false,
  detail: false,
};
const filters: Filters[] = [
  {
    key: "sparePartCode",
    label: "Codi Recanvi",
    format: FiltersFormat.TEXT,
  },
  {
    key: "sparePartDescription",
    label: "Descripció Recanvi",
    format: FiltersFormat.TEXT,
  },
  {
    key: "operator",
    label: "Operari",
    format: FiltersFormat.TEXT,
  },
  {
    key: "workOrderDescription",
    label: "Descripció OT",
    format: FiltersFormat.TEXT,
  },
];
export default function SparePartsConsumedReportTable({
  sparePartsConsumeds,
}: SparePartsConsumedReportTableProps) {
  return (
    <div className="mt-2">
      <DataTable
        columns={columnsSparePartConsumedReport}
        data={sparePartsConsumeds}
        tableButtons={tableButtons}
        entity={EntityTable.SPAREPART}
        filters={filters}
        onDelete={undefined}
        enableFilterActive={false}
        totalCounts={false}
        isReport={true}
      />
    </div>
  );
}
