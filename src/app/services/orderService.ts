import { Order, OrderCreationRequest } from 'app/interfaces/Order';

export interface IOrderService {
  create(createOrderRequest: OrderCreationRequest): Promise<Order>;
  getById(id: string): Promise<Order>;
}

export class OrderService implements IOrderService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL!) {
    this.baseUrl = baseUrl;
  }
  async create(createOrderRequest: OrderCreationRequest): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createOrderRequest),
      });
      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}api/order/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}
export default OrderService;
