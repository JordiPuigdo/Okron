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
    <div className="px-4 py-8 mt-12">
      <div className="bg-white w-full text-center p-4 rounded-md border-2 border-gray-400">
        <span className="text-xl font-bold mb-4 ">Seleccionar Operari</span>
      </div>
      <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>
      <div className="flex flex-col gap-4 mt-6 w-full">
        <div className="">
          <table className="w-full border-collapse">
            <thead className="bg-white ">
              <tr className="border-b ">
                <th className="px-4 py-2 text-xl font-bold">Operari</th>
                <th className="px-4 py-2 text-xl font-bold">Acció</th>
              </tr>
            </thead>
            <tbody className="items-center justify-center text-center">
              {aviableOperators.map((operator) => (
                <tr key={operator.id} className="border-b">
                  <td className="px-4 py-2">{operator.name}</td>
                  <td className="px-4 py-2">
                    {!operatorAdded[operator.id] &&
                    !selectedOperators.find((x) => x.id === operator.id) ? (
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6 w-full">
          <div className="w-full bg-white p-3">
            <span className="text-xl font-bold mb-4">Operaris Assignats</span>
          </div>

          <table className="w-full border-collapse">
            <tbody>
              {selectedOperators.map((operator) => (
                <tr key={operator.id} className="border-b">
                  <td className="px-4 py-2">{operator.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full bg-black border-2 border-black rounded-xl mt-6"></div>
    </div>
  );
};
export default ChooseOperator;
