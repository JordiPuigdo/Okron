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

  const authService = new AuthenticationService(
    process.env.NEXT_PUBLIC_API_BASE_URL || ""
  );

  function signOperator() {
    authService
      .LoginOperator(codeOperator)
      .then((x) => {
        if (x) {
          const op: OperatorLogged = {
            codeOperatorLogged: x.code,
            idOperatorLogged: x.id,
            nameOperatorLogged: x.name,
          };
          setOperatorLogged(op);
          setCodeOperator("");
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
