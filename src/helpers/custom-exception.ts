class CustomError extends Error { 
    public message: string;
    public statusCode: number;
    constructor(message: string) {
        super(message);
        this.message = message;
        this.statusCode = 500;
    }
}

class BadRequestError extends CustomError {
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
    }
}

class AuthenticationFailure extends CustomError {
    constructor(message: string) {
        super(message);
        this.statusCode = 403;
    }
}

class UnexpectedError extends CustomError {
    constructor(message: string) {
        super(message);
        this.statusCode = 500;
    }
}

export { BadRequestError, CustomError, AuthenticationFailure, UnexpectedError };