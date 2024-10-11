import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Link from "next/link";
import { SvgDelete, SvgDetail, SvgRepeat, SvgSpinner } from "app/icons/icons";
import { Column, ColumnFormat, Filters, TableButtons } from "./interfaceTable";
import FiltersComponent from "./FiltersComponent";
import {
  formatDate,
  translateOperatorType,
  translateStateWorkOrder,
  translateWorkOrderType,
} from "app/utils/utils";
import { getStatusClassName, getStatusText } from "./tableUtils";
import { EntityTable } from "./tableEntitys";
import { useSessionStore } from "app/stores/globalStore";
import { UserPermission } from "app/interfaces/User";
import useRoutes from "app/utils/useRoutes";
import WorkOrderOperationsInTable from "./WorkOrderOperationsInTable";
import { PreventiveButtons } from "./components/PreventiveButtons";

interface DataTableProps {
  data: any[];
  columns: Column[];
  filters?: Filters[];
  tableButtons: TableButtons;
  entity: EntityTable;
  onDelete?: (id: string) => void;
  totalCounts?: boolean;
  enableFilterActive?: boolean;
  enableCheckbox?: boolean;
  onChecked?: (id?: string) => void;
}

export interface LoadingState {
  [key: string]: boolean;
}

export enum ButtonTypesTable {
  Create,
  Edit,
  Delete,
  Detail,
  Sign,
  PassInspectionPoints,
}
const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  filters,
  tableButtons,
  entity,
  onDelete,
  totalCounts = false,
  enableFilterActive = true,
  enableCheckbox = false,
  onChecked,
}: DataTableProps) => {
  const itemsPerPageOptions = [5, 10, 15, 20, 25, 50];
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1]);

  const [filteredData, setFilteredData] = useState<any[]>([...data]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterActive, setFilterActive] = useState(true);
  const [totalCount, setTotalCount] = useState(
    Math.ceil(data.length / itemsPerPage)
  );
  const [totalRecords, setTotalRecords] = useState(data.length);
  const ROUTES = useRoutes();
  const [pathDetail, setPathDetail] = useState<string>("");

  const [loadingState, setLoadingState] = useState<LoadingState>({});
  const { loginUser } = useSessionStore((state) => state);

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    setIsLoading(true);
    if (page > currentPage) {
      handleNextPage();
    } else handlePreviousPage();

    setCurrentPage(page);
  };

  const handleNextPage = async () => {
    setCurrentPage(currentPage + 1);
    setIsLoading(false);
  };

  const handlePreviousPage = async () => {
    setCurrentPage(currentPage - 1);
    setIsLoading(false);
  };

  useEffect(() => {
    switch (entity) {
      case EntityTable.WORKORDER:
        setPathDetail(ROUTES.workOrders);
        break;
      case EntityTable.PREVENTIVE:
        setPathDetail(ROUTES.preventive.configuration);
        break;
      case EntityTable.SPAREPART:
        setPathDetail(ROUTES.spareParts);
        break;
      case EntityTable.OPERATOR:
        setPathDetail(ROUTES.configuration.operators);
        break;
      default:
        setPathDetail("");
    }
  }, []);

  /* const handleOnFilterChange = async (e: any) => {
    setIsLoading(true);
    setFilterText(e.target.value);
    setCurrentPage(1);
  };*/

  const handleSortChange = async (sortedBy: string) => {
    if (sortedBy == "") return;
    // setIsLoading(true);
  };

  const handleSort = (columnKey: string) => {
    const order =
      sortColumn === columnKey && sortOrder === "ASC" ? "DESC" : "ASC";
    setSortColumn(columnKey);
    setSortOrder(order);

    const sortText = columnKey + " : " + order;
    handleSortChange(sortText);
  };

  let totalQuantity = 0;

  const handleItemsPerPageChange = (value: number) => {
    setIsLoading(true);

    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const sortData = (
    data: any[],
    sortColumn: string,
    sortOrder: "ASC" | "DESC"
  ): any[] => {
    return data.sort((a: any, b: any) => {
      if (!a.hasOwnProperty(sortColumn) || !b.hasOwnProperty(sortColumn)) {
        return 0;
      }

      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (sortOrder === "ASC") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  useEffect(() => {
    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;

    data = sortData(data, sortColumn, sortOrder);
    if (enableFilterActive) {
      setFilteredData(
        data
          .filter((record) => {
            if (typeof record === "object" && record.hasOwnProperty("active")) {
              if (filterActive) {
                return record.active === true;
              } else {
                return true;
              }
            }
          })
          .slice(indexOfFirstRecord, indexOfLastRecord)
      );
      setTotalRecords(
        data.filter((record) => {
          if (typeof record === "object" && record.hasOwnProperty("active")) {
            if (filterActive) {
              return record.active === true;
            } else {
              return true;
            }
          }
        }).length
      );
    } else {
      setTotalRecords(data.length);
      setFilteredData(data.slice(indexOfFirstRecord, indexOfLastRecord));
    }

    setTotalCount(Math.ceil(data.length / itemsPerPage));
    setIsLoading(false);
  }, [data, currentPage, itemsPerPage, filterActive, sortOrder, sortColumn]);

  const getNestedFieldValue = (rowData: any, key: string) => {
    const keys = key.split(".");
    let value = rowData;
    for (const k of keys) {
      if (Array.isArray(value)) {
        value = value[0];
      }
      if (value && Object.prototype.hasOwnProperty.call(value, k)) {
        value = value[k];
      } else {
        return "";
      }
    }
    return value;
  };

  const handleFilterChange = (key: string, value: string | boolean | Date) => {
    const keys = key.split(".");
    const filteredData = data.filter((item) => {
      const nestedPropertyValue = keys.reduce(
        (obj, prop) => obj && obj[prop],
        item
      );
      if (value === "") return true;
      if (nestedPropertyValue) {
        const itemValue = String(nestedPropertyValue);
        const filterValue = String(value);
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      return false;
    });

    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;

    if (enableFilterActive && filterActive) {
      setFilteredData(
        filteredData
          .filter((x) => x["active"] == filterActive)
          .slice(indexOfFirstRecord, indexOfLastRecord)
      );
    } else {
      setFilteredData(
        filteredData.slice(indexOfFirstRecord, indexOfLastRecord)
      );
    }
    setTotalRecords(filteredData.length);
    setTotalCount(Math.ceil(filteredData.length / itemsPerPage));
  };

  const toggleLoading = (
    id: string,
    buttonType: ButtonTypesTable,
    isLoading: boolean
  ) => {
    const loadingKey = `${id}_${buttonType}`;
    setLoadingState((prevLoadingState) => ({
      ...prevLoadingState,
      [loadingKey]: isLoading,
    }));
  };

  const handleDelete = async (id: string) => {
    toggleLoading(id, ButtonTypesTable.Delete, true);
    onDelete && onDelete(id);
    toggleLoading(id, ButtonTypesTable.Delete, false);
  };

  const renderFilters = () => {
    return (
      <>
        <div className="flex gap-4 p-1 justify-between">
          <div className="">
            {filters?.length == 0 && (
              <input
                type="text"
                placeholder="Filtrar"
                className="text-sm bg-blue-gray-100 rounded-lg border border-gray-500"
              />
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <FiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          {enableFilterActive && (
            <div
              className="flex items-center hover:cursor-pointer"
              onClick={() => setFilterActive(!filterActive)}
            >
              <span className="mr-2 text-sm">Actius</span>
              <input
                type="checkbox"
                checked={filterActive}
                onChange={() => setFilterActive(!filterActive)}
                className="ml-2"
              />
            </div>
          )}
        </div>
      </>
    );
  };

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSelectedRow = (id: string) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(id)) {
        newSelectedRows.delete(id);
      } else {
        newSelectedRows.add(id);
      }
      return newSelectedRows;
    });
    onChecked && onChecked(id);
  };

  const handleSelectedAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set()); // Deselect all if all are selected
    } else {
      setSelectedRows(new Set(data.map((row) => row.id))); // Select all rows
    }
    onChecked && onChecked();
  };

  const renderHeadTableActions = () => {
    return tableButtons.delete ||
      tableButtons.detail ||
      tableButtons.edit ||
      entity === EntityTable.WORKORDER ? (
      <th className="text-center border-b border-blue-gray-100 bg-blue-gray-50 ">
        Accions
      </th>
    ) : (
      <></>
    );
  };

  const renderTableButtons = (item: any) => {
    const validPermission = [
      UserPermission.Administrator,
      UserPermission.SpareParts,
    ];
    const canEdit =
      validPermission.includes(loginUser?.permission!) &&
      entity !== EntityTable.WORKORDER;
    return (
      <td className="p-2">
        {canEdit && (
          <div className="flex flex-row gap-2 justify-center">
            {tableButtons.edit && (
              <Link
                href={`${pathDetail}/${item[columns[0].key]}`}
                onClick={(e) => {
                  console.log(`${pathDetail}/${item[columns[0].key]}`);
                }}
              >
                <p
                  className="flex items-center font-medium text-white rounded-xl bg-okron-btEdit hover:bg-okron-btEditHover"
                  onClick={() => {
                    toggleLoading(
                      item[columns[0].key],
                      ButtonTypesTable.Edit,
                      true
                    );
                  }}
                >
                  {loadingState[
                    item[columns[0].key] + "_" + ButtonTypesTable.Edit
                  ] ? (
                    <SvgSpinner className="p-2" />
                  ) : (
                    <SvgDetail className="p-2" />
                  )}
                </p>
              </Link>
            )}
            {tableButtons.delete && (
              <div
                className="flex items-center text-white rounded-xl bg-okron-btDelete hover:bg-okron-btDeleteHover hover:cursor-pointer"
                onClick={() => handleDelete(item[columns[0].key])}
              >
                {loadingState[
                  item[columns[0].key] + "_" + ButtonTypesTable.Delete
                ] ? (
                  <SvgSpinner className="p-2" />
                ) : (
                  <SvgDelete className="p-2" />
                )}
              </div>
            )}
            {tableButtons.detail && (
              <Link href={`${pathDetail}/${item[columns[0].key]}`}>
                <p className="font-medium text-center text-white p-2 rounded-xl bg-okron-btDetail hover:bg-okron-btnDetailHover">
                  Detall
                  {loadingState[
                    item[columns[0].key] + "_" + ButtonTypesTable.Detail
                  ] && (
                    <span className="ml-2 text-white">
                      <SvgSpinner className="w-6 h-6" />
                    </span>
                  )}
                </p>
              </Link>
            )}
            {entity == EntityTable.PREVENTIVE && (
              <PreventiveButtons
                preventive={item}
                userId={loginUser!.agentId}
              />
            )}
          </div>
        )}
        {EntityTable.WORKORDER == entity && (
          <>
            <WorkOrderOperationsInTable
              workOrderId={item[columns[0].key]}
              workOrder={item}
              onChangeStateWorkOrder={() => setFilterActive(!filterActive)}
              enableActions={tableButtons.edit || tableButtons.delete}
            />
          </>
        )}
      </td>
    );
  };

  const isAllSelected =
    data.length > 0 && selectedRows.size === data.length ? true : false;

  if (filteredData)
    return (
      <>
        <div className="bg-white rounded-lg p-2 shadow-md">
          {renderFilters()}
          <div className="pt-4">
            {isLoading ? (
              <SvgSpinner className="w-full justify-center" />
            ) : (
              <div className="flex-grow overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-t border-gray-200 flex-grow">
                      {enableCheckbox && (
                        <th
                          className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 cursor-pointer"
                          onClick={handleSelectedAllRows}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="checkbox"
                              checked={
                                isAllSelected == undefined
                                  ? false
                                  : isAllSelected
                              }
                            />
                          </div>
                        </th>
                      )}
                      {columns.map((column) => {
                        if (column.key.toLocaleUpperCase() !== "ID") {
                          let classname = "flex";
                          if (column.format == ColumnFormat.NUMBER) {
                            classname += " justify-end pr-4";
                          }
                          return (
                            <th
                              key={column.key}
                              className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 cursor-pointer "
                              onClick={() => handleSort(column.key)}
                            >
                              <div className={classname}>
                                <label
                                  color="blue-gray"
                                  className="font-normal leading-none opacity-70"
                                >
                                  {column.label}
                                </label>
                                {sortColumn === column.key && (
                                  <span className="ml-2">
                                    {sortOrder === "ASC" ? "↑" : "↓"}
                                  </span>
                                )}
                              </div>
                            </th>
                          );
                        }
                      })}
                      {(tableButtons.detail || tableButtons.edit) &&
                        renderHeadTableActions()}
                    </tr>
                  </thead>
                  <tbody className="border-b">
                    {filteredData
                      .slice(0, itemsPerPage)
                      .map((rowData, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={`${
                            rowIndex % 2 === 0 ? "" : "bg-gray-100"
                          } `}
                        >
                          {enableCheckbox && (
                            <td
                              className="p-2 hover:cursor-pointer"
                              onClick={() => handleSelectedRow(rowData.id)}
                            >
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={selectedRows.has(rowData.id)}
                                  onChange={() => handleSelectedRow(rowData.id)}
                                  onClick={() => handleSelectedRow(rowData.id)}
                                />
                              </div>
                            </td>
                          )}
                          {columns
                            .filter(
                              (column) =>
                                column.key.toLocaleUpperCase() !== "ID"
                            )
                            .map((column) => {
                              let value = getNestedFieldValue(
                                rowData,
                                column.key
                              );
                              let className = "font-normal ";
                              let classNametd = "p-2";

                              const formatColumn =
                                column.format.toLocaleUpperCase();

                              if (column.key === "active") {
                                className += " w-full";
                                className += value
                                  ? " bg-green-500 p-2 rounded-xl text-white"
                                  : " bg-red-500 p-2 rounded-xl text-white";
                                //className = getStatusClassName( value, entity);
                              }

                              if (formatColumn == ColumnFormat.DATE) {
                                value = formatDate(value, false, false);
                              }

                              if (formatColumn == ColumnFormat.DATETIME) {
                                value = formatDate(value);
                              }

                              if (
                                formatColumn.toLocaleUpperCase() ==
                                ColumnFormat.WORKORDERTYPE
                              ) {
                                className = getStatusClassName(value, entity);
                                value = translateWorkOrderType(value);
                              }

                              if (
                                formatColumn.toLocaleUpperCase() ==
                                ColumnFormat.OPERATORTYPE
                              ) {
                                className = getStatusClassName(value, entity);
                                value = translateOperatorType(value);
                              }

                              if (
                                formatColumn.toLocaleUpperCase() ==
                                ColumnFormat.NUMBER
                              ) {
                                totalQuantity += parseInt(value);
                                classNametd = " text-right pr-8 ";
                              }

                              if (
                                formatColumn.toLocaleUpperCase() ==
                                ColumnFormat.STATEWORKORDER
                              ) {
                                className = getStatusClassName(
                                  value,
                                  "WORKORDERSTATE"
                                );
                                value = translateStateWorkOrder(value);
                              }
                              if (
                                formatColumn.toLocaleUpperCase() ==
                                ColumnFormat.BOOLEAN
                              ) {
                                className +=
                                  " text-white rounded-full py-1 px-2 text-sm text-center ";
                              }
                              /* if (column.key === "status") {
                            className = getStatusClassName(value, entity);
                          } else if (formatColumn === "DATE") {
                            className += "";
                          }*/

                              /*const formattedValue =
                            column.key === "status"
                              ? getStatusText(value, entity)
                              : formatColumn === "DATE" && !isValidDate(value)
                              ? ""
                              : dayjs(value).isValid()
                              ? dayjs(value).format("DD-MM-YYYY HH:mm:ss")
                              : value;^
*/
                              const formattedValue = value;
                              return (
                                <td key={column.key} className={classNametd}>
                                  <label className={className}>
                                    {formatColumn == ColumnFormat.BOOLEAN && (
                                      <>{value ? "Actiu" : "Inactiu"}</>
                                    )}
                                    {formattedValue}
                                  </label>
                                </td>
                              );
                            })}

                          {renderTableButtons(rowData)}
                        </tr>
                      ))}
                    {totalCounts && (
                      <tr className="bg-gray-100 border-t-2 border-gray-900">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-left">
                          Total Unitats Consumides
                        </td>
                        <td
                          colSpan={columns.length - 2}
                          className="px-6 pr-8 whitespace-nowrap text-lg text-gray-900 font-semibold text-right"
                        >
                          {totalQuantity}
                        </td>
                        <td className="px-6 pr-8 whitespace-nowrap text-lg text-gray-900 font-semibold text-right"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="flex flex-row">
            {data.length > 0 && (
              <p className="mt-auto text-sm w-full">
                Total: {totalRecords} registres
              </p>
            )}
            <div className="flex align-bottom items-center mt-auto w-full">
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="text-sm bg-blue-gray-100 rounded-lg border border-gray-500"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p className="ml-2 text-sm">registres per pàgina</p>
            </div>

            <div className="justify-end w-full">
              <Pagination
                currentPage={currentPage}
                totalPages={totalCount}
                onPageChange={handlePageChange}
                hasNextPage={currentPage < totalCount}
              />
            </div>
          </div>
        </div>
      </>
    );
  return <>No results</>;
};

export default DataTable;
