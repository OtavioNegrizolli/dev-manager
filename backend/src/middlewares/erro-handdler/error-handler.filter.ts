import { ArgumentsHost, Catch, ExceptionFilter, InternalServerErrorException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

import { InvalidDataError } from '../../shared/errors/invalid-data-error';
import { HttpStatusCode } from '../../shared/utils/http-status-code';

@Catch(InvalidDataError)
@Catch(InternalServerErrorException)
export class GlobalErrorHandlerFilter implements ExceptionFilter
{
    public catch(error: Error, host: ArgumentsHost)
    {
        const res = host.switchToHttp().getResponse<Response>();
        if (error instanceof InvalidDataError)
            return res.status(HttpStatusCode.BAD_REQUEST).json({ message: error.message });
        else if ( error instanceof InternalServerErrorException )
        {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({messege: 'O servidor retornou um erro interno, caso persista, contate o suporte!'});
        }
    }
}
