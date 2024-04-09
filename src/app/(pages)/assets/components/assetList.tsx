"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Asset } from "app/interfaces/Asset";
import AssetService from "app/services/assetService";

interface Props {
  asset: Asset;
  onDelete: (id: string) => void;
}

const AssetListItem: React.FC<Props> = ({ asset, onDelete }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mt-4">
      <li className=" p-4 flex flex-col border-2 bg-slate-50">
        <div className="flex items-center mb-2">
          {asset.childs.length > 0 && (
            <button
              onClick={toggleExpanded}
              className="mr-2 focus:outline-none rounded-full bg-blue-500 text-white px-2 py-1"
            >
              {expanded ? "-" : "+"}
            </button>
          )}
          <div className="flex-grow">
            <strong>Nom:</strong> {asset.name} | <strong>Nivell:</strong>{" "}
            {asset.level}
          </div>
          <div>
            {asset.level < 7 && (
              <Link
                href={`/assets/0?parentId=${asset.id}&level=${asset.level + 1}`}
                passHref
              >
                <button className="mr-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                  Afegir subnivell
                </button>
              </Link>
            )}
            <Link href={`/assets/${asset.id}`} passHref>
              <button className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                Editar
              </button>
            </Link>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={(e) => {
                onDelete(asset.id);
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
        {expanded && asset.childs.length > 0 && (
          <ul className="pl-4">
            {asset.childs.map((child) => (
              <AssetListItem key={child.id} asset={child} onDelete={onDelete} />
            ))}
          </ul>
        )}
      </li>
    </div>
  );
};

const AssetList: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const assetService = new AssetService(process.env.NEXT_PUBLIC_API_BASE_URL!);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    assetService
      .getAll()
      .then((assets: Asset[]) => {
        setAssets(assets);
      })
      .catch((error: any) => {
        console.error("Error al obtener activos:", error);
      });
  }, []);

  const handleDelete = (id: string) => {
    assetService
      .deleteAsset(id)
      .then((data) => {
        if (data) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error al eliminar activo:", error);
        setMessage("Error al eliminar activo");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Llistat d'actius i equips</h2>
      <Link
        href="/assets/0"
        passHref
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Afegir Nou Equip Pare
      </Link>
      <ul>
        {assets.map((asset) => (
          <AssetListItem key={asset.id} asset={asset} onDelete={handleDelete} />
        ))}
      </ul>
      {message != "" && <span className="text-red-500">{message}</span>}
    </div>
  );
};

export default AssetList;
