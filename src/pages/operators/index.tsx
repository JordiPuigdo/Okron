import React, { useEffect, useState } from "react";
import OperatorForm from "../../components/OperatorForm";
import OperatorService from "services/operatorService";
import Operator from "interfaces/Operator";
import Layout from "components/Layout";
import Link from "next/link";

function OperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    async function fetchOperators() {
      try {
        const data = await operatorService.getOperators();
        setOperators(data);
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    }

    fetchOperators();
  }, []);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  async function createOperator(operator: Operator) {
    const data = await operatorService.createOperator(operator);
  }

  async function deleteOperator(id: string) {
    const data = await operatorService.deleteOperator(id);
  }

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-2xl font-semibold mb-4">Operaris</h1>
        <button
          onClick={toggleFormVisibility}
          className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          {isFormVisible ? "Tancar" : "Crear Operari"}
        </button>
        {isFormVisible && (
          <OperatorForm
            onSubmit={createOperator}
            onCancel={function (): void {
              //TODO
            }}
            onUpdatedSuccesfully={false}
          />
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border py-2 px-4">Nom</th>
                <th className="border py-2 px-4">Codi</th>
                <th className="border py-2 px-4">Accions</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((operator) => (
                <tr key={operator.id} className="bg-white">
                  <td className="border py-2 px-4">{operator.name}</td>
                  <td className="border py-2 px-4">{operator.code}</td>
                  <td className="border py-2 px-4">
                    <Link
                      href="/operators/[id]"
                      as={`/operators/${operator.id}`}
                    >
                      Editar
                    </Link>
                    <a
                      className="pl-4"
                      onClick={() => deleteOperator(operator.id)}
                    >
                      Eliminar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default OperatorsPage;
