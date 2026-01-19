
import Api from "@services/api";
import {allUserRequest} from "@interfaces/user/User";
export async function getMeInfo(): Promise<allUserRequest> {
    const Apis = await Api.getInstance();
    const response = await Apis.get<null, allUserRequest>(
        { url: `/auth` }
    );
    return response.data;
}