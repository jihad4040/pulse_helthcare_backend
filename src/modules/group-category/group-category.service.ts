import { Injectable } from '@nestjs/common';
// Multer type fixed
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class GroupCategoryService {
    constructor(private readonly prisma: PrismaService, private readonly cloudinary: CloudinaryService) { }

    async create(createGroupCategoryDto: { name: string }, file: any) {
        let iconUrl = '';
        if (file) {
            const uploadResult: any = await this.cloudinary.uploadImageFromBuffer(
                file.buffer,
                'group-categories',
                `${Date.now()}-${file.originalname}`,
            );
            iconUrl = uploadResult.secure_url;
        }

        return this.prisma.groupCategory.create({
            data: {
                name: createGroupCategoryDto.name,
                icon: iconUrl,
            },
        });
    }

    async findAll() {
        return this.prisma.groupCategory.findMany({
            where: { isDeleted: false },
        });
    }

    async findOne(id: string) {
        return this.prisma.groupCategory.findFirst({
            where: { groupCategoryId: id, isDeleted: false },
        });
    }

    async update(id: string, updateGroupCategoryDto: { name?: string }, file?: any) {
        const updateData: any = { ...updateGroupCategoryDto };

        if (file) {
            const uploadResult: any = await this.cloudinary.uploadImageFromBuffer(
                file.buffer,
                'group-categories',
                `${Date.now()}-${file.originalname}`,
            );
            updateData.icon = uploadResult.secure_url;
        }

        return this.prisma.groupCategory.update({
            where: { groupCategoryId: id },
            data: updateData,
        });
    }

    async remove(id: string) {
        return this.prisma.groupCategory.update({
            where: { groupCategoryId: id },
            data: { isDeleted: true },
        });
    }
}
