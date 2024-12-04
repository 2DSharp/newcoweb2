import { authenticatedApiClient } from "@/services/api";

export async function getAddresses() {
  const response = await authenticatedApiClient.get('/accounts/addresses/');
  return response.data;
}

export async function addAddress(addressData: any) {
  const response = await authenticatedApiClient.post('/accounts/addresses', addressData);
  return response.data;
} 