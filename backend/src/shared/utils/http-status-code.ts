import { HttpCode } from "@nestjs/common";

export const HttpStatusCode = {
    // sucess
    OK:         200,
    CREATED:    201,
    NO_CONTENT: 204,
    // user errors
    BAD_REQUEST: 400,
    // server errors
    INTERNAL_SERVER_ERROR: 500
};
