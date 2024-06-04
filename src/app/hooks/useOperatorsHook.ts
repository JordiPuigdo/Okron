import Operator from "app/interfaces/Operator";
import OperatorService from "app/services/operatorService";


export const useOperatorHook = () => {
    const operatorService = new OperatorService(
    process.env.NEXT_PUBLIC_API_BASE_URL!);


    const fetchOperators = async () : Promise<Operator[]> => {
        operatorService.getOperators().then((response) => {
            if(response)
            return response;
        }).catch((error) =>
        {
            console.log(error);
        });
        return {} as Operator[];
    }

    return { fetchOperators }
}