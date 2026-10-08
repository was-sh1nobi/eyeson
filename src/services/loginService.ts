import { httpService } from "@/utils/httpService.ts";

type LoginPayload = {
    email: string;
    password: string;
};

export const loginService = {
    async login(data: LoginPayload) {
        return await httpService.post("/auth/login", { email: data.email, password: data.password }, { withCredentials: false });
    },
};
