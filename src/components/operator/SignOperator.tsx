"use client";
import { OperatorLogged } from "app/interfaces/User";
import { useSessionStore } from "app/stores/globalStore";
import AuthenticationService from "app/services/authentication";
import { useState } from "react";
import { Button } from "designSystem/Button/Buttons";

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
    if (operatorLogged?.codeOperatorLogged) {
      setCodeOperator("");
      setOperatorLogged(undefined);
      if (codeOperator == "") return;
    }
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
            operatorLoggedType: x.operatorType,
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
    <div className="flex flex-row gap-4 items-center bg-white rounded-xl p-4 font-semibold">
      <input
        type="text"
        placeholder="Codi Operari"
        className="rounded-sm text-sm"
        value={codeOperator}
        onChange={(e) => setCodeOperator(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            signOperator();
          }
        }}
      />
      <Button
        customStyles={` ${
          operatorLogged?.codeOperatorLogged ? "bg-blue-500 " : "bg-red-500 "
        } rounded-md p-2 text-white text-sm hover:${
          operatorLogged?.codeOperatorLogged ? "bg-blue-700" : "bg-red-700"
        }`}
        onClick={signOperator}
      >
        {operatorLogged?.codeOperatorLogged ? "Desfitxar" : "Fitxar"}
      </Button>
      <p className="text-red-500">{errorSign && errorSign}</p>
    </div>
  );
}
