import { PrismaClientOptions } from '@prisma/client/runtime';

export const prismaConfig: PrismaClientOptions = {
    datasources: {
        db: {
            url: '',
        },
    },
};
