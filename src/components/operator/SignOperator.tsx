"use client";
import { OperatorLogged } from "app/interfaces/User";
import { useSessionStore } from "app/stores/globalStore";
import AuthenticationService from "components/services/authentication";
import { useState } from "react";

export default function SignOperator() {
  const { setOperatorLogged, operatorLogged } = useSessionStore(
    (state) => state
  );
  const [codeOperator, setCodeOperator] = useState("");
  const [errorSign, setErrorSign] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState("");

  const authService = new AuthenticationService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  function signOperator() {
    if (!/^\d+$/.test(codeOperator) || codeOperator == "") {
      setCodeOperator("");
      alert("Codi de operari només pot ser númeric");
      return;
    }
    authService
      .LoginOperator(codeOperator)
      .then((x) => {
        if (x.id != undefined) {
          const op: OperatorLogged = {
            codeOperatorLogged: x.code,
            idOperatorLogged: x.id,
            nameOperatorLogged: x.name,
          };
          setOperatorLogged(op);
          setCodeOperator("");
        } else {
          setErrorSign("Operari no trobat!");
          setCodeOperator("");
          setTimeout(() => {
            setErrorSign(undefined);
          }, 4000);
        }
      })
      .catch((err) => {
        setErrorSign(err);
      });
  }

  return (
    <>
      <div>
        Codi Operari:
        <input
          type="text"
          className="ml-4 rounded-sm"
          value={codeOperator}
          onChange={(e) => setCodeOperator(e.target.value)}
        />
        <button
          type="button"
          className="ml-4 bg-blue-500 rounded-md p-1 text-white"
          onClick={signOperator}
        >
          Fitxar
        </button>
        <button
          type="button"
          className="ml-4 bg-red-500 rounded-md p-1 text-white"
          onClick={(e) => setOperatorLogged(undefined)}
        >
          Desfitxar
        </button>
        <p className="text-red-500">{errorSign && errorSign}</p>
      </div>
      {operatorLogged && (
        <div>
          Operari Entrat: {operatorLogged.codeOperatorLogged} -{" "}
          {operatorLogged.nameOperatorLogged}
        </div>
      )}
    </>
  );
}
