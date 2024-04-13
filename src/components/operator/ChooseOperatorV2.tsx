"use client";
import Operator from "app/interfaces/Operator";
import AutocompleteSearchBar from "components/selector/AutocompleteSearchBar";
import { ElementList } from "components/selector/ElementList";
import { useEffect, useState } from "react";

interface ChooseOperatorV2Props {
  availableOperators: Operator[];
  preventiveSelectedOperators: string[];
  onSelectedOperator: (pointId: string) => void;
  onDeleteSelectedOperator: (pointId: string) => void;
}

const ChooseOperatorV2: React.FC<ChooseOperatorV2Props> = ({
  availableOperators,
  preventiveSelectedOperators,
  onSelectedOperator,
  onDeleteSelectedOperator,
}) => {
  const [selectedOperators, setSelectedOperator] = useState<Operator[]>([]);
  const [elementListOperator, setElementListOperator] = useState<ElementList[]>(
    []
  );

  useEffect(() => {
    const selectedOps = availableOperators.filter((operator) =>
      preventiveSelectedOperators.includes(operator.id)
    );
    setSelectedOperator(selectedOps);
    setElementListOperator(
      availableOperators.map((x) => ({ id: x.id, description: x.name }))
    );
  }, [availableOperators, preventiveSelectedOperators]);

  const handleDeleteOperatorSelected = (id: string) => {
    setSelectedOperator((prevSelected) =>
      prevSelected.filter((point) => point.id !== id)
    );
    onDeleteSelectedOperator(id);
  };
  const handleOperatorSelected = (id: string) => {
    if (id == "") return;
    const x = availableOperators.find((point) => point.id === id);
    setSelectedOperator((prevSelected) => [...prevSelected, x!]);
    onSelectedOperator(id);
  };

  return (
    <div className="flex flex-row gap-8 w-full my-6">
      <div className="w-full">
        <AutocompleteSearchBar
          elements={elementListOperator.filter(
            (x) => !preventiveSelectedOperators.some((y) => y === x.id)
          )}
          setCurrentId={handleOperatorSelected}
          placeholder="Buscar operaris"
        />
        <div className="mt-4">
          {selectedOperators.map((point) => (
            <div
              key={point.id}
              className="flex items-center justify-between mb-2"
            >
              <span className="text-gray-600 font-medium">{point.name}</span>
              <button
                type="button"
                onClick={() => handleDeleteOperatorSelected(point.id)}
                className="bg-red-600 hover:bg-red-900 text-white rounded-xl py-2 px-4 text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseOperatorV2;