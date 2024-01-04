import Operator from "interfaces/Operator";
import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

type OperatorFormProps = {
  operator?: Operator;
  onSubmit: SubmitHandler<Operator>;
  onCancel: () => void;
  onDelete?: () => void;
  onUpdatedSuccesfully?: boolean;
};

const OperatorForm: React.FC<OperatorFormProps> = ({
  operator,
  onSubmit,
  onCancel,
  onDelete,
  onUpdatedSuccesfully,
}) => {
  const { handleSubmit, control, reset } = useForm<Operator>({
    defaultValues: operator,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg p-6 shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700"
        >
          Codi Operari
        </label>
        <Controller
          name="code"
          control={control}
          defaultValue={operator ? operator.code : ""}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Codi Operari"
              className="border rounded-md w-full px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:border-indigo-500"
            />
          )}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nom
        </label>
        <Controller
          name="name"
          control={control}
          defaultValue={operator ? operator.name : ""}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Nom"
              className="border rounded-md w-full px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:border-indigo-500"
            />
          )}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Preu Hora
        </label>
        <Controller
          name="priceHour"
          control={control}
          defaultValue={operator ? operator.priceHour : 0}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              placeholder="Preu / Hora"
              className="border rounded-md w-full px-3 py-2 mt-1 text-gray-700 focus:outline-none focus:border-indigo-500"
            />
          )}
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          Guardar
        </button>
        <button
          onClick={() => {
            onCancel();
          }}
          className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          Cancelar
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="text-red-600 hover:text-red-900 font-semibold focus:outline-none"
          >
            Eliminar
          </button>
        )}
        {onUpdatedSuccesfully && (
          <div className="mb-4 text-green-500 text-center">
            Operari actualitzat correctament!
          </div>
        )}
      </div>
    </form>
  );
};

export default OperatorForm;