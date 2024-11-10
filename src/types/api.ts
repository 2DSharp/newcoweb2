export type ApiSuccessResponse<T> = {
    status: 'SUCCESS';
    data: T;
    successful: true;
};

export type ApiErrorResponse = {
    status: 'FAIL';
    message: string;
    successful: false;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
