import { authenticatedApiClient } from "@/services/api";

export async function getProduct(productId: string) {
  const response = await authenticatedApiClient.get(`/products/${productId}`);
  return response.data;
} 