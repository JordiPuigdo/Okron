import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Link from "next/link";
import { SvgSpinner } from "app/icons/icons";
import { Column, ColumnFormat, Filters, TableButtons } from "./interfaceTable";
import FiltersComponent from "./FiltersComponent";
import {
  formatDate,
  translateStateWorkOrder,
  translateWorkOrderType,
} from "app/utils/utils";
import { getStatusClassName, getStatusText } from "./tableUtils";
import { EntityTable } from "./tableEntitys";
import { useSessionStore } from "app/stores/globalStore";
import { UserPermission } from "app/interfaces/User";
import useRoutes from "app/utils/useRoutes";

interface DataTableProps {
  data: any[];
  columns: Column[];
  filters?: Filters[];
  tableButtons: TableButtons;
  entity: EntityTable;
  onDelete?: (id: string) => void;
  totalCounts?: boolean;
  enableFilterActive?: boolean;
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
}: DataTableProps) => {
  const itemsPerPageOptions = [5, 10, 15, 20, 25, 50];
  const pathName = usePathname();
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
  const ROUTES = useRoutes();
  const [pathDetail, setPathDetail] = useState<string>("");

  const [isLoadingButton, setIsLoadingButton] = useState<{
    [key: string]: boolean;
  }>({
    ["Edit"]: false,
    ["Delete"]: false,
    ["Detail"]: false,
  });
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
      default:
        setPathDetail(pathName);
    }
  }, []);

  /* const handleOnFilterChange = async (e: any) => {
    setIsLoading(true);
    setFilterText(e.target.value);
    setCurrentPage(1);
  };*/

  /*const handleSortChange = async (sortedBy: string) => {
    if (sortedBy == "") return;
    setIsLoading(true);
  };

  const handleSort = (columnKey: string) => {
    const order =
      sortColumn === columnKey && sortOrder === "ASC" ? "DESC" : "ASC";
    setSortColumn(columnKey);
    setSortOrder(order);

    const sortText = columnKey + " : " + order;
    handleSortChange(sortText);
  };*/

  const handleItemsPerPageChange = (value: number) => {
    setIsLoading(true);

    setItemsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
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
    } else {
      setFilteredData(data);
    }
    setTotalCount(Math.ceil(data.length / itemsPerPage));
    setIsLoading(false);
  }, [data, currentPage, itemsPerPage, filterActive]);

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
      if (nestedPropertyValue) {
        const itemValue = String(nestedPropertyValue);
        const filterValue = String(value);
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      return false;
    });

    const indexOfLastRecord = currentPage * itemsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
    if (enableFilterActive) {
      setFilteredData(
        filteredData
          .filter((x) => x["active"] == filterActive)
          .slice(indexOfFirstRecord, indexOfLastRecord)
      );
    }

    setTotalCount(Math.ceil(filteredData.length / itemsPerPage));
  };

  const handleDelete = async (id: string) => {
    setIsLoadingButton((prevState) => ({
      ...prevState,
      ["Delete"]: true,
    }));
    onDelete && onDelete(id);
    setIsLoadingButton((prevState) => ({
      ...prevState,
      ["Delete"]: false,
    }));
  };

  const renderFilters = () => {
    return (
      <>
        <div className="flex gap-4 p-1 justify-between">
          <div className="flex items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="text-sm bg-blue-gray-100 rounded-lg border border-gray-500"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p className="ml-2">registres per pàgina</p>
          </div>
          {enableFilterActive && (
            <div className="flex items-center">
              <span className="mr-2">Veure registres actius</span>
              <input
                type="checkbox"
                checked={filterActive}
                onChange={() => setFilterActive(!filterActive)}
                className="ml-2"
              />
            </div>
          )}

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
        <FiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </>
    );
  };

  const renderHeadTableActions = () => {
    if (
      entity == EntityTable.SPAREPART &&
      loginUser?.permission != UserPermission.Administrator
    ) {
      return <></>;
    }
    return tableButtons.delete || tableButtons.detail || tableButtons.edit ? (
      <th className="text-center border-b border-blue-gray-100 bg-blue-gray-50 p-4 cursor-pointer">
        Accions
      </th>
    ) : (
      <></>
    );
  };

  const renderTableButtons = (item: any) => {
    if (
      entity == EntityTable.SPAREPART &&
      loginUser?.permission != UserPermission.Administrator
    ) {
      return <></>;
    }

    return (
      <div className="justify-center flex flex-col sm:flex-row items-center">
        {loginUser?.permission != UserPermission.Administrator ? (
          <Link href={`${pathDetail}/${item[columns[0].key]}`}>
            <p className="flex items-center font-medium text-center text-white p-2 rounded-xl bg-okron-btDetail hover:bg-okron-btnDetailHover">
              Detall
              {isLoadingButton && (
                <span className="ml-2 text-xs">
                  <SvgSpinner className="w-6 h-6" />
                </span>
              )}
            </p>
          </Link>
        ) : (
          <>
            <td className="p-4 flex flex-col sm:flex-row justify-center items-center text-center gap-4">
              {tableButtons.edit && (
                <Link href={`${pathName}/${item[columns[0].key]}`}>
                  <p
                    className="flex items-center font-medium text-white p-2 rounded-xl bg-okron-btEdit hover:bg-okron-btEditHover"
                    onClick={() => {
                      setIsLoadingButton((prevState) => ({
                        ...prevState,
                        ["Edit"]: true,
                      }));
                    }}
                  >
                    Editar
                    {isLoadingButton["Edit"] && (
                      <span className="ml-2 text-white">
                        <SvgSpinner className="w-6 h-6" />
                      </span>
                    )}
                  </p>
                </Link>
              )}
              {tableButtons.delete && (
                <button
                  type="button"
                  className="flex items-center font-medium text-white p-2 rounded-xl bg-okron-btDelete hover:bg-okron-btDeleteHover"
                  onClick={() => handleDelete(item[columns[0].key])}
                >
                  Eliminar
                  {isLoadingButton["Delete"] && (
                    <span className="ml-2 text-white">
                      <SvgSpinner className="w-6 h-6" />
                    </span>
                  )}
                </button>
              )}
              {tableButtons.detail && (
                <Link href={`${pathDetail}/${item[columns[0].key]}`}>
                  <p className="font-medium text-center text-white p-2 rounded-xl bg-okron-btDetail hover:bg-okron-btnDetailHover">
                    Detall
                    {isLoadingButton["Detail"] && (
                      <span className="ml-2 text-white">
                        <SvgSpinner className="w-6 h-6" />
                      </span>
                    )}
                  </p>
                </Link>
              )}
            </td>
          </>
        )}
      </div>
    );
  };

  if (filteredData)
    return (
      <>
        <div className="bg-white rounded-lg p-2">
          {renderFilters()}
          <div className="pt-4">
            {isLoading ? (
              <SvgSpinner className="w-full justify-center" />
            ) : (
              <div className="relative overflow-x-auto ">
                <table className="w-full text-left text-lg">
                  <thead>
                    <tr className="border-t border-gray-200 pt-2">
                      {columns.map(
                        (column) =>
                          column.key.toLocaleUpperCase() !== "ID" && (
                            <th
                              key={column.key}
                              className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 cursor-pointer"
                            >
                              <div className="flex">
                                <label
                                  color="blue-gray"
                                  className="font-normal leading-none opacity-70 "
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
                          )
                      )}
                      {renderHeadTableActions()}
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
                              let classNametd = " p-2 relative ";

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
                                ColumnFormat.NUMBER
                              ) {
                                classNametd = " text-center ";
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
                      <>
                        <tr className="bg-gray-100 border-t-2 border-gray-900">
                          <td className="px-6 py-4 whitespace-nowrap">
                            Total Unitats Consumides
                          </td>
                          <td
                            colSpan={4}
                            className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 font-semibold"
                          >
                            5
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="flex flex-row ">
            {data.length > 0 && (
              <p className="mt-auto w-full">Total: {data.length} registres</p>
            )}

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
