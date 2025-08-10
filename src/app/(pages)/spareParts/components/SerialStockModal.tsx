import React, { useState } from 'react';
import { SvgClose, SvgCreate, SvgDelete } from 'app/icons/icons';
import { SerialStocks } from 'app/interfaces/Warehouse';
import { Modal } from 'designSystem/Modals/Modal';

export interface SerialStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (serialStocks: SerialStocks[]) => void;
  initialSerialStocks?: SerialStocks[];
  title?: string;
}

const SerialStockModal: React.FC<SerialStockModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSerialStocks = [],
  title = 'Gestionar SerialStocks',
}) => {
  const [serialStocks, setSerialStocks] = useState<SerialStocks[]>(
    initialSerialStocks || []
  );
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const addSerial = () => {
    const newSerial: SerialStocks = {
      id: `temp_${Date.now()}`,
      serialNumber: '',
      quantity: 0,
      creationDate: new Date(),
      active: false,
    };
    setSerialStocks(prev => [...prev, newSerial]);
  };

  const removeSerial = (index: number) => {
    const updated = [...serialStocks];
    updated.splice(index, 1);
    setSerialStocks(updated);
  };

  const updateSerial = (
    index: number,
    field: keyof SerialStocks,
    value: string | number
  ) => {
    const updated = [...serialStocks];
    updated[index] = { ...updated[index], [field]: value };
    setSerialStocks(updated);

    const errorKey = `${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    let hasErrors = false;

    serialStocks.forEach((serial, index) => {
      if (!serial.serialNumber.trim()) {
        newErrors[`${index}_serialNumber`] = true;
        hasErrors = true;
      }
      if (isNaN(serial.quantity)) {
        newErrors[`${index}_quantity`] = true;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(serialStocks);
      onClose();
    }
  };

  return (
    <Modal
      isVisible={isOpen}
      onOpenChange={onClose}
      type="center"
      height="h-[65%]"
      width="w-full"
      className="max-w-2xl p-0 overflow-hidden flex flex-col border border-black"
      avoidClosing={true}
      onKeyDown={(e: { key: string; preventDefault: () => void }) => {
        if (e.key === 'Enter') {
          handleSave();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <SvgClose className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-600">Número de sèrie</h3>
          <div
            className="flex items-center p-2 text-white rounded-xl bg-okron-btCreate hover:bg-okron-btCreateHover hover:cursor-pointer"
            onClick={addSerial}
          >
            <SvgCreate />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 px-2 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded">
          <div className="col-span-6">Número de Sèrie</div>
          <div className="col-span-4">Quantitat</div>
          <div className="col-span-2 text-center">Accions</div>
        </div>

        {serialStocks.map((serial, index) => (
          <div
            key={serial.id}
            className="grid grid-cols-12 gap-4 items-center bg-white border border-gray-200 rounded px-2 py-2"
          >
            <div className="col-span-6">
              <input
                value={serial.serialNumber}
                onChange={e =>
                  updateSerial(index, 'serialNumber', e.target.value)
                }
                placeholder="Número de sèrie"
                className={`w-full text-sm rounded border px-2 py-1 focus:outline-none ${
                  errors[`${index}_serialNumber`]
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors[`${index}_serialNumber`] && (
                <p className="text-red-500 text-xs">
                  El camp Número de sèrie és obligatori
                </p>
              )}
            </div>
            <div className="col-span-4">
              <input
                type="number"
                value={serial.quantity}
                onChange={e =>
                  updateSerial(index, 'quantity', parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className={`w-full text-sm rounded border px-2 py-1 focus:outline-none ${
                  errors[`${index}_quantity`]
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                } ${serial.quantity < 0 ? 'bg-red-50' : ''}`}
              />
            </div>
            <div className="col-span-2 flex justify-center">
              <div
                className="flex items-center text-white rounded-xl bg-okron-btDelete hover:bg-okron-btDeleteHover hover:cursor-pointer"
                onClick={() => removeSerial(index)}
              >
                <SvgDelete className="p-2 " />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
};

export default SerialStockModal;
