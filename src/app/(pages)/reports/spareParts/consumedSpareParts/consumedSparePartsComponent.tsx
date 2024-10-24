"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSparePartsHook } from "app/hooks/useSparePartsHook";
import { useState } from "react";
import { Button } from "designSystem/Button/Buttons";
import SparePartsConsumedReportTable from "./component/SparePartsConsumedReportTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ca from "date-fns/locale/ca";
import { SvgSpinner } from "app/icons/icons";
import SparePartBarchart from "./component/sparePartBarchart";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function ConsumedSparePartsComponent() {
  const [from, setFrom] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [to, setTo] = useState(new Date());

  const { sparePartsConsumeds, isLoading, isError, reloadSparePartsConsumeds } =
    useSparePartsHook().fetchSparePartsConsumedsHook(
      dayjs(from).format("YYYY-MM-DDTHH:mm:ss"),
      dayjs(to).format("YYYY-MM-DDTHH:mm:ss")
    );

  return (
    <div>
      <div className="flex gap-4 bg-white rounded-xl p-2 shadow-md">
        <DatePicker
          selected={from}
          onChange={(e) => (e ? setFrom(e) : setFrom(new Date()))}
          locale={ca}
          dateFormat="dd/MM/yyyy"
          className="border border-gray-300 p-2 rounded-md mr-4 w-full"
        />
        <DatePicker
          selected={to}
          onChange={(e) => (e ? setTo(e) : setTo(new Date()))}
          dateFormat="dd/MM/yyyy"
          locale={ca}
          className="border border-gray-300 p-2 rounded-md mr-4 w-full"
        />

        <Button type="create" onClick={() => reloadSparePartsConsumeds()}>
          Buscar
        </Button>
      </div>
      {isLoading && (
        <div className="flex w-full text-white justify-center p-4">
          <SvgSpinner className="items-center justify-center" />
        </div>
      )}
      {isError && <div>Error loading spare parts consumeds</div>}

      {sparePartsConsumeds && sparePartsConsumeds?.length > 0 && (
        <>
          <SparePartsConsumedReportTable
            sparePartsConsumeds={sparePartsConsumeds}
          />
          <div className="w-full bg-white rounded-xl mt-2 p-4">
            <SparePartBarchart sparePartsConsumeds={sparePartsConsumeds} />
          </div>
        </>
      )}
    </div>
  );
}
