import Operator from "interfaces/Operator";
import { Open_Sans } from "next/font/google";
import { useState } from "react";

type ChooseOperatorProps = {
  aviableOperators: Operator[];
  selectedOperators: Operator[];
  setSelectedOperators: React.Dispatch<React.SetStateAction<Operator[]>>;
};

const ChooseOperator: React.FC<ChooseOperatorProps> = ({
  aviableOperators = [],
  selectedOperators,
  setSelectedOperators,
}) => {
  const [operatorAdded, setOperatorAdded] = useState<{
    [key: string]: boolean;
  }>({});

  const addOperatorToSelected = (operator: Operator) => {
    setSelectedOperators((prevSelected) => [...prevSelected, operator]);
    setOperatorAdded((prevAdded) => ({ ...prevAdded, [operator.id]: true }));
  };

  const removeOperatorFromAdded = (operatorId: string) => {
    setOperatorAdded((prevAdded) => ({ ...prevAdded, [operatorId]: false }));
    setSelectedOperators((prevSelected) =>
      prevSelected.filter((operator) => operator.id !== operatorId)
    );
  };

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Seleccionar Operari</h1>
      <div className="grid grid-cols-2 gap-4">
        {aviableOperators.map((operator) => (
          <div
            key={operator.id}
            className="flex justify-between items-center border p-4"
          >
            <span>{operator.name}</span>
            {!operatorAdded[operator.id] &&
            !selectedOperators.find((x) => x.id == operator.id) ? (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => addOperatorToSelected(operator)}
                type="button"
              >
                Afegir
              </button>
            ) : (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => removeOperatorFromAdded(operator.id)}
                type="button"
              >
                Esborrar
              </button>
            )}
          </div>
        ))}
        <h1 className="text-2xl font-bold mb-4">Operaris Assignats</h1>

        {selectedOperators.map((x) => (
          <div key={x.id} className="text-xl text-stone-900">
            <span>{x.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseOperator;
