import { ValidationError } from 'yup';

interface Errors {
    [key: string]: string;
}

export default (yupError: ValidationError): Errors =>
    yupError.inner.reduce(
        (acc, error) => {
            if (error.path) {
                return {
                    ...acc,
                    [error.path]: error.message,
                };
            }
            return acc;
        }, {} as Errors);