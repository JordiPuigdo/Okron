import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import Layout from "../../../components/Layout";
import MachineForm from "../../../components/MachineForm"; // Create a MachineForm component for editing
import Machine from "../../../interfaces/machine";
import MachineService from "../../../services/machineService"; // Import your MachineService
import { useEffect, useState } from "react";

type Props = {
  item?: Machine;
  errors?: string;
};

const EditMachinePage = ({ item, errors }: Props) => {
  const router = useRouter();
  const { id } = router.query;

  const fetchMachineData = async () => {
    try {
      const machineService = new MachineService(
        process.env.NEXT_PUBLIC_API_BASE_URL || ""
      );
      const machineData = await machineService.getMachineById(id as string);
      return machineData;
    } catch (error) {
      console.error("Error fetching machine data:", error);
      return null;
    }
  };

  const [machineData, setMachineData] = useState<Machine | null>(null);

  useEffect(() => {
    if (id) {
      fetchMachineData().then((data) => {
        if (data) {
          setMachineData(data);
        }
      });
    }
  }, [id]);

  function onCancel() {
    history.back();
  }

  if (errors) {
    return (
      <Layout>
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      {machineData && (
        <MachineForm
          machine={machineData}
          onCancel={onCancel}
          onSubmit={function (data: Machine): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </Layout>
  );
};

export default EditMachinePage;
