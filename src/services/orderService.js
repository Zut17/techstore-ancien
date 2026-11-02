import { request } from "./api";

export const createOrder = (order) => request("/orders", { method: "POST", body: order });
export const getMyOrders = () => request("/orders/mine");
