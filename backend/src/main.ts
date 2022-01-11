import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalErrorHandlerFilter } from './middlewares/erro-handdler/error-handler.filter';

import * as cors from 'cors';
import * as helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cors({
        origin: 'http://localhost:3000'
    }));
    app.use(helmet.hidePoweredBy());
    app.useGlobalFilters(new GlobalErrorHandlerFilter());
    await app.listen(process.env.PORT || 3001);
}

bootstrap();
