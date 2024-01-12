"use client";

import Layout from "components/Layout";
import OperatorForm from "components/OperatorForm";
import Operator from "interfaces/Operator";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import OperatorService from "services/operatorService";

export default function EditOperatorPage({
  params,
}: {
  params: { id: string };
}) {
  const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState<boolean | null>(
    null
  );

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

  const updateOperator = async (operator: Operator) => {
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
    }
  }, [params.id]);

  return (
    <Layout>
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
    </Layout>
  );
}
