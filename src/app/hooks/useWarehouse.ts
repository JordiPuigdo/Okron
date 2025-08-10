import { useState } from 'react';
import { WareHouse } from 'app/interfaces/Warehouse';
import WareHouseService, {
  IWareHouseService,
} from 'app/services/warehouseService';

export const useWareHouses = (
  shouldFetchWarehouses: boolean = false,
  wareHouseService: IWareHouseService = new WareHouseService()
) => {
  const [warehouses, setWarehouses] = useState<WareHouse[]>([
    {
      id: '6814816f446c684cd2af368a',
      description: 'Vegetalia',
      active: true,
    },
  ]);
  const getStockAvailability = async () => {
    try {
      const response = await wareHouseService.stockAvailability();
      return response;
    } catch (error) {
      console.log('error fetching getStockAvailability');
      throw error;
    }
  };

  return {
    warehouses,
    getStockAvailability,
  };
};
