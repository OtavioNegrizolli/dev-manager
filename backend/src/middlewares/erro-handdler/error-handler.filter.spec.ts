import { InvalidDataError } from '../../shared/errors/invalid-data-error';
import { GlobalErrorHandlerFilter } from './error-handler.filter';
import * as express from 'express';

describe('GlobalErrorHandelerFilter', () =>
{
    let sut: GlobalErrorHandlerFilter;

    beforeAll(() => {
        sut = new GlobalErrorHandlerFilter();
    });

    it('should be defined', () => {
        expect(sut).toBeDefined();
    });

    it('should return an 400 if the error is of type \'InvalidDataError\'', () => {
        const invalidDataErrorMessage = 'The data was invalid';
        const invalidDataError = new InvalidDataError(invalidDataErrorMessage);
    });
});
