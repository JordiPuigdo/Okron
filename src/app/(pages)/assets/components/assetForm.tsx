'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SvgSpinner } from 'app/icons/icons';
import { Asset } from 'app/interfaces/Asset';
import useRoutes from 'app/utils/useRoutes';
import { useRouter } from 'next/navigation';

interface AssetFormProps {
  id: string;
  loading: boolean;
  assetData?: Asset;
  onSubmit: (data: any) => Promise<void>;
  parentId?: string;
  level?: number;
}

const AssetForm: React.FC<AssetFormProps> = ({
  id,
  loading,
  assetData,
  onSubmit,
  parentId,
  level,
}) => {
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const ROUTES = useRoutes();

  useEffect(() => {
    if (assetData) {
      Object.entries(assetData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [assetData]);

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Codi:</label>
        <input
          type="text"
          {...register('code', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Descripció:</label>
        <input
          type="text"
          {...register('description', { required: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4 items-start">
        <label className="block text-gray-700 mb-2">
          Crea Ordre de treball:
        </label>
        <input
          type="checkbox"
          defaultChecked={assetData?.createWorkOrder || true}
          {...register('createWorkOrder')}
          className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4 items-start">
        <label className="block text-gray-700 mb-2">Actiu:</label>
        <input
          type="checkbox"
          defaultChecked={assetData?.active || true}
          {...register('active')}
          className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="flex flex-row gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          {loading ? <SvgSpinner /> : id !== '0' ? 'Actualitzar' : 'Afegir'}
        </button>
        <button
          type="button"
          disabled={loading}
          className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
          onClick={() => {
            router.push(ROUTES.configuration.assets);
          }}
        >
          {loading ? <SvgSpinner /> : 'Cancelar'}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;
