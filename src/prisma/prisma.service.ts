import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        super({ adapter: adapter })
    };

    async onModuleInit() {
        await this.$connect();
        await this.seedAdmin();
    }

    private async seedAdmin() {
        try {
            const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@servicemarketplace.com';
            const existingAdmin = await this.user.findFirst({
                where: {
                    OR: [
                        { role: Role.ADMIN },
                        { role: Role.SUPER_ADMIN }
                    ]
                }
            });

            if (!existingAdmin) {
                const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperSecurePassword123!';
                const hashedPassword = await bcrypt.hash(adminPassword, 10);

                await this.user.create({
                    data: {
                        name: 'Super Admin',
                        email: adminEmail,
                        phone: process.env.SUPER_ADMIN_PHONE || '+10000000000',
                        password: hashedPassword,
                        role: Role.ADMIN,
                        status: 'ACTIVE',
                        verifidStatus: 'ACTIVE',
                    }
                });
                this.logger.log('Admin user seeded successfully.');
            } else {
                this.logger.log('Admin user already exists. Skipping seed.');
            }
        } catch (error) {
            this.logger.error('Failed to seed admin user', error);
        }
    }
};
