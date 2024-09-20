"use client";

import OperatorForm from "components/OperatorForm";
import MainLayout from "components/layout/MainLayout";
import Operator, { OperatorType } from "app/interfaces/Operator";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import OperatorService from "app/services/operatorService";
import Container from "components/layout/Container";
import {
  AssignOperatorToPreventivesRequest,
  Preventive,
} from "app/interfaces/Preventive";
import PreventiveService from "app/services/preventiveService";

export default function EditOperatorPage({
  params,
}: {
  params: { id: string };
}) {
  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const preventiveService = new PreventiveService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState<boolean | null>(
    null
  );

  const [operatorPreventives, setOperatorPreventives] = useState<
    Preventive[] | null
  >(null);

  const [selectedAvailable, setSelectedAvailable] = useState<Set<string>>(
    new Set()
  );
  const [selectedAssigned, setSelectedAssigned] = useState<Set<string>>(
    new Set()
  );

  const [preventives, setPreventives] = useState<Preventive[] | null>(null);

  const assignOperatorToPreventives = async () => {
    try {
      if (selectedAvailable.size === 0) {
        alert("Has de seleccionar un preventiu per assignar-lo a l'operari");
        return;
      }
      const isConfirmed = window.confirm(
        "Segur que voleu assignar els preventius seleccionats a l'operari?"
      );

      if (isConfirmed) {
        const request: AssignOperatorToPreventivesRequest = {
          operatorId: params.id as string,
          preventiveIds: Array.from(selectedAvailable),
        };
        const result = await preventiveService.assignOperatorToPreventives(
          request
        );
        debugger;

        if (result) {
          const newlyAssignedPreventives = preventives!.filter((p) =>
            selectedAvailable.has(p.id)
          );
          setOperatorPreventives((prevOperatorPreventives) => {
            // Initialize as empty array if null
            const updatedPreventives = prevOperatorPreventives
              ? [...prevOperatorPreventives]
              : [];

            // Add newly assigned preventives
            return [...updatedPreventives, ...newlyAssignedPreventives];
          });

          // Optionally clear selected assigned set
          setSelectedAssigned(new Set());
        }
      }
    } catch (error) {
      console.error("Error assigning operator to preventives:", error);
    }
  };

  const fetchOperatorData = async () => {
    try {
      setIsUpdateSuccessful(null);
      const operatorData = await operatorService.getOperator(
        params.id as string
      );
      return operatorData;
    } catch (error) {
      console.error("Error fetching operator data:", error);
      return null;
    }
  };

  const fetchOperatorPreventives = async () => {
    try {
      const operatorPreventives =
        await preventiveService.getPreventiveByOperatorId(params.id as string);
      return operatorPreventives;
    } catch (error) {
      console.error("Error fetching operator preventives:", error);
      return null;
    }
  };

  const fetchPreventives = async () => {
    try {
      const preventives = await preventiveService.getPreventives();
      return preventives;
    } catch (error) {
      console.error("Error fetching preventives:", error);
      return null;
    }
  };

  const updateOperator = async (operator: Operator) => {
    if (operator.operatorType == null)
      operator.operatorType = OperatorType.Maintenance;
    await operatorService.updateOperator(operator).then((data) => {
      if (data) {
        setIsUpdateSuccessful(true);
        setTimeout(() => {
          history.back();
        }, 2000);
      } else {
        setIsUpdateSuccessful(false);
      }

      setTimeout(() => {
        setIsUpdateSuccessful(null);
      }, 3000);
    });
  };
  const [operatorData, setOperatorData] = useState<Operator | null>(null);

  useEffect(() => {
    setIsUpdateSuccessful(null);
    if (params.id) {
      fetchOperatorData().then((data) => {
        if (data) {
          setOperatorData(data);
        }
      });
      fetchOperatorPreventives().then((data) => {
        if (data) {
          setOperatorPreventives(data);
        }
      });
      fetchPreventives().then((data) => {
        if (data) {
          setPreventives(data);
        }
      });
    }
  }, [params.id]);

  const handleSelectAll = (
    selectAll: boolean,
    table: "available" | "assigned"
  ) => {
    if (table === "available") {
      if (selectAll) {
        const allAvailableIds = new Set(
          preventives
            ?.filter((p) => !assignedPreventiveIds.has(p.id))
            .map((p) => p.id) || []
        );
        setSelectedAvailable(allAvailableIds);
      } else {
        setSelectedAvailable(new Set());
      }
    } else {
      if (selectAll) {
        const allAssignedIds = new Set(
          operatorPreventives?.map((p) => p.id) || []
        );
        setSelectedAssigned(allAssignedIds);
      } else {
        setSelectedAssigned(new Set());
      }
    }
  };
  const handleSelect = (id: string, table: "available" | "assigned") => {
    if (table === "available") {
      const updatedSelection = new Set(selectedAvailable);
      if (updatedSelection.has(id)) {
        updatedSelection.delete(id);
      } else {
        updatedSelection.add(id);
      }
      setSelectedAvailable(updatedSelection);
    } else {
      const updatedSelection = new Set(selectedAssigned);
      if (updatedSelection.has(id)) {
        updatedSelection.delete(id);
      } else {
        updatedSelection.add(id);
      }
      setSelectedAssigned(updatedSelection);
    }
  };
  const assignedPreventiveIds = new Set(
    operatorPreventives?.map((p) => p.id) || []
  );

  const [filterAvailable, setFilterAvailable] = useState<boolean>(false);
  const toggleFilter = () => {
    setFilterAvailable(!filterAvailable);
  };

  const filteredPreventives = filterAvailable
    ? preventives?.filter((p) => !assignedPreventiveIds.has(p.id))
    : preventives;
  return (
    <MainLayout>
      <Container>
        {operatorData && (
          <OperatorForm
            operator={operatorData}
            onSubmit={function (
              data: Operator,
              event?: BaseSyntheticEvent<object, any, any> | undefined
            ): unknown {
              return updateOperator(data);
            }}
            onCancel={function (): void {
              history.back();
            }}
            onUpdatedSuccesfully={isUpdateSuccessful}
          />
        )}
        <div className="flex flex-row gap-4 mt-2">
          <div className="flex flex-col bg-white gap-4 w-full items-center p-2 rounded-xl">
            <div className="flex flex-row w-full justify-between p2">
              <span className="flex text-lg font-semibold bg-green-200 p-2 rounded-xl items-center">
                Preventius disponibles
              </span>
              <div className="flex justify-end p-2">
                <button
                  onClick={toggleFilter}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  {filterAvailable ? "Mostra'ls tots" : "Pendents d'assignar"}
                </button>
              </div>
            </div>
            <div className="w-full max-h-64 overflow-y-auto">
              <table className="table-auto w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="text-left">
                    <th className="p-2">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleSelectAll(e.target.checked, "available")
                        }
                        checked={
                          filteredPreventives?.length === selectedAvailable.size
                        }
                      />
                    </th>
                    <th className="p-2">Codi Preventiu</th>
                    <th className="p-2">Equip</th>
                    <th className="p-2">Acció</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPreventives?.map((x) => (
                    <tr
                      key={x.id}
                      className={`border-b ${
                        selectedAvailable.has(x.id) ? "bg-green-200" : ""
                      } ${assignedPreventiveIds.has(x.id) ? "bg-red-200" : ""}`}
                    >
                      <td className="p-2">
                        {!assignedPreventiveIds.has(x.id) && (
                          <input
                            type="checkbox"
                            disabled={assignedPreventiveIds.has(x.id)}
                            checked={selectedAvailable.has(x.id)}
                            onChange={() => handleSelect(x.id, "available")}
                          />
                        )}
                      </td>
                      <td className="p-2">{x.code}</td>
                      <td className="p-2">{x.asset?.description}</td>
                      <td className="p-2">
                        {!assignedPreventiveIds.has(x.id) && "Assignar"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-row w-full justify-between p2">
              <span>Total: {filteredPreventives?.length}</span>
              <div className="flex justify-end p-2">
                <button
                  onClick={assignOperatorToPreventives}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Assignar seleccionats
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white gap-4 w-full items-center p-2 rounded-xl">
            <span className="flex text-lg font-semibold bg-gray-200 p-2 rounded-xl items-center">
              Preventius assignats
            </span>
            <div className="w-full max-h-64 overflow-y-auto">
              <table className="table-auto w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr className="text-left">
                    <th className="p-2">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleSelectAll(e.target.checked, "assigned")
                        }
                        checked={
                          operatorPreventives?.length === selectedAssigned.size
                        }
                      />
                    </th>
                    <th className="p-2">Codi Preventiu</th>
                    <th className="p-2">Equip</th>
                    <th className="p-2">Acció</th>
                  </tr>
                </thead>
                <tbody>
                  {operatorPreventives?.map((x) => (
                    <tr key={x.id} className="border-b">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedAssigned.has(x.id)}
                          onChange={() => handleSelect(x.id, "assigned")}
                        />
                      </td>
                      <td className="p-2">{x.code}</td>
                      <td className="p-2">{x.asset?.description}</td>
                      <td className="p-2">Delete</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            Total: {operatorPreventives?.length}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
