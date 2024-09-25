import SparePart, { SparePartDetailRequest } from "app/interfaces/SparePart";
import SparePartService from "app/services/sparePartService";
import useSWR from "swr";

const sparePartService = new SparePartService(
process.env.NEXT_PUBLIC_API_BASE_URL!);

const fetchAllSpareParts = async () : Promise<SparePart[]> => {
   try {
    const response = await sparePartService.getSpareParts();
    return response;
  } catch (error) {
    console.error('Error fetching spare parts:', error);
    throw error;
  }
}

const fetchSparePartByRequest = async (sparePartDetailRequest : SparePartDetailRequest) : Promise<SparePart> => {
    sparePartService.getSparePart(sparePartDetailRequest).then((response) => {
        if(response)
        {
            return response;
        }
    }).catch((error) =>
    {
        console.log(error);
        throw error;
    });
    return {} as SparePart;
}

export const useSparePartsHook = () => {
  const { data: spareParts, error: sparePartsError, mutate: fetchSpareParts } = useSWR<SparePart[]>('spareParts', fetchAllSpareParts);

  const fetchSparePart = (sparePartDetailRequest: SparePartDetailRequest) => {
    const { data, error, mutate } = useSWR<SparePart>(
      ['sparePart', sparePartDetailRequest],
      () => fetchSparePartByRequest(sparePartDetailRequest)
    );
    return { sparePart: data, isLoading: !error && !data, isError: error, reloadSparePart: mutate };
  };

  return {
    spareParts,
    sparePartsError,
    fetchSpareParts,
    fetchSparePart
  };
};