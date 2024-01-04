import React, { useEffect, useState } from "react";
import MachineBox from "../components/MachineBox";
import App from "../components/App";
import MachineService from "../services/machineService"; // Import the 'MachineService'
import Machine from "interfaces/machine";
import Layout from "components/Layout";

const IndexPage = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const machineService = new MachineService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  useEffect(() => {
    /* machineService.getAllMachines().then((data) => {
      const activeMachines = data.filter((machine) => machine.active);
      setMachines(activeMachines);
    });*/
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-4">Màquines</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <MachineBox key={machine.id} machine={machine} />
        ))}
      </div>
    </Layout>
  );
};

export default IndexPage;
