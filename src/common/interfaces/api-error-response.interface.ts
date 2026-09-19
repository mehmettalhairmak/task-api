export interface ValidationErrorDetail {
    field: string;
    errors: string[];
}

export interface ApiErrorResponse {
    success: false;
    statusCode: number;
    errorCode: string;
    message: string;
    details: ValidationErrorDetail[] | null;
    timestamp: string;
    path: string;
}
