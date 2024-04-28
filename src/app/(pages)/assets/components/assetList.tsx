"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Asset } from "app/interfaces/Asset";
import AssetService from "app/services/assetService";
import { SvgSpinner } from "app/icons/icons";

interface Props {
  asset: Asset;
  onDelete: (id: string) => void;
}

const AssetListItem: React.FC<Props> = ({ asset, onDelete }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [loadingAssets, setLoadingAssets] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mt-4 bg-white rounded-xl">
      <li className=" p-4 flex flex-col border-2 ">
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
            <strong>Codi:</strong> {asset.code} | <strong>Descripció:</strong>{" "}
            {asset.description} | <strong>Nivell:</strong> {asset.level}
          </div>
          <div className="flex flex-row">
            {asset.level < 7 && (
              <Link
                href={`/assets/0?parentId=${asset.id}&level=${asset.level + 1}`}
                passHref
              >
                <button
                  onClick={(e) => {
                    setLoadingAssets({ ...loadingAssets, [asset.id]: true });
                  }}
                  className="flex items-center mr-2 bg-okron-btCreate text-white px-2 py-1 rounded hover:bg-okron-btCreateHover"
                >
                  Afegir actiu
                  {loadingAssets[asset.id] && (
                    <span className="items-center ml-2 text-white">
                      <SvgSpinner className="w-6 h-6" />
                    </span>
                  )}
                </button>
              </Link>
            )}
            <Link href={`/assets/${asset.id}`} passHref>
              <button
                onClick={(e) => {
                  setLoadingAssets({ ...loadingAssets, [asset.id]: true });
                }}
                className="flex items-center mr-2 bg-okron-btEdit text-white px-2 py-1 rounded hover:bg-okron-btEditHover"
              >
                Editar
                {loadingAssets[asset.id] && (
                  <span className="items-center ml-2 text-white">
                    <SvgSpinner className="w-6 h-6" />
                  </span>
                )}
              </button>
            </Link>
            <button
              className="flex bg-okron-btDelete text-white px-2 py-1 rounded hover:bg-okron-btDeleteHover"
              onClick={(e) => {
                onDelete(asset.id);
              }}
            >
              Eliminar
              {loadingAssets[asset.id] && (
                <span className="items-center ml-2 text-white">
                  <SvgSpinner className="w-6 h-6" />
                </span>
              )}
            </button>
          </div>
        </div>
        {expanded && asset.childs.length > 0 && (
          <ul className="pl-4 ">
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
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    const confirm = window.confirm("Segur que voleu eliminar aquest equip?");
    if (!confirm) return;
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
  const filterAssetsRecursive = (assets: Asset[], term: string): Asset[] => {
    return assets.reduce((filtered: Asset[], asset) => {
      const includesTerm =
        asset.code.toLowerCase().includes(term.toLowerCase()) ||
        asset.description.toLowerCase().includes(term.toLowerCase());

      const filteredChildren = filterAssetsRecursive(asset.childs, term);

      if (includesTerm || filteredChildren.length > 0) {
        filtered.push({
          ...asset,
          childs: filteredChildren,
        });
      }

      return filtered;
    }, []);
  };

  const filteredAssets = filterAssetsRecursive(assets, searchTerm);

  return (
    <div className="w-full mx-auto py-4">
      <h2 className="text-2xl font-semibold mb-6">Llistat d'actius i equips</h2>
      <input
        type="text"
        placeholder="Buscar per codi o descripció"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-2 py-1 border border-gray-300 rounded"
      />
      <Link
        href="/assets/0"
        passHref
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Afegir Nou Equip Pare
      </Link>
      <ul>
        {filteredAssets.map((asset) => (
          <AssetListItem key={asset.id} asset={asset} onDelete={handleDelete} />
        ))}
      </ul>
      {message != "" && <span className="text-red-500">{message}</span>}
    </div>
  );
};

export default AssetList;
