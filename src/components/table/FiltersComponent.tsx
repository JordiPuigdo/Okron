import React, { useState } from "react";
import { Filters, FiltersFormat } from "./interfaceTable";
import DatePicker from "react-datepicker";
import ca from "date-fns/locale/ca";

interface FiltersComponentProps {
  filters?: Filters[];
  onFilterChange?: (key: string, value: string | boolean | Date) => void;
  onFilterDateChange?: (date: Date) => void;
}

const FiltersComponent: React.FC<FiltersComponentProps> = ({
  filters,
  onFilterChange,
  onFilterDateChange,
}) => {
  const currentDate = new Date();
  const [date, setDate] = useState<Date | null>(currentDate);

  const [filterValues, setFilterValues] = useState<{
    [key: string]: string | boolean | Date;
  }>({});

  const handleInputChange = (key: string, value: string | boolean | Date) => {
    setFilterValues({ ...filterValues, [key]: value });
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  const handleDateChange = (date: Date) => {
    setDate(date);
    if (onFilterDateChange) {
      onFilterDateChange(date);
    }
  };

  return (
    <>
      {filters && filters.length > 0 && (
        <div className="flex gap-4 p-1 justify-between">
          <div className="flex items-center gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="flex items-center">
                {filter.format === FiltersFormat.TEXT && (
                  <input
                    type="text"
                    placeholder={filter.label}
                    className="text-sm bg-blue-gray-100 rounded-lg border border-gray-500"
                    value={
                      filterValues[filter.key]
                        ? filterValues[filter.key].toString()
                        : ""
                    }
                    onChange={(e) =>
                      handleInputChange(filter.key, e.target.value)
                    }
                  />
                )}
                {filter.format === FiltersFormat.BOOLEAN && (
                  <input
                    type="checkbox"
                    id={filter.key}
                    checked={!!filterValues[filter.key]}
                    onChange={(e) =>
                      handleInputChange(filter.key, e.target.checked)
                    }
                  />
                )}
                {filter.format === FiltersFormat.DATE && (
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    locale={ca}
                    className="p-3 border border-gray-300 rounded-md text-lg bg-white text-gray-900"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FiltersComponent;