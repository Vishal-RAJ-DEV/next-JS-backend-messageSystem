import { message } from "@/model/user";
export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: message[];
    data?: any;
}