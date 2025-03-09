import { useState } from 'react';
import { Order, OrderCreationRequest } from 'app/interfaces/Order';
import { WareHouse } from 'app/interfaces/WareHouse';
import OrderService, { IOrderService } from 'app/services/orderService';

export const useOrder = (orderService: IOrderService = new OrderService()) => {
  const [warehouses, setWarehouses] = useState<WareHouse[]>([]);

  const fetchOrderById = async (id: string): Promise<Order> => {
    try {
      const response = await orderService.getById(id);
      return response;
    } catch (error) {
      console.error('Error fetching fetchOrderById:', error);
      throw error;
    }
  };

  const createOrder = async (order: OrderCreationRequest): Promise<Order> => {
    try {
      const response = await orderService.create(order);

      return response;
    } catch (error) {
      console.error('Error creating warehouse:', error);
      throw error;
    }
  };

  return {
    fetchOrderById,
    createOrder,
  };
};
