import { Injectable, NotFoundException } from '@nestjs/common';
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

    async update(
        id: string,
        updateGroupCategoryDto: { name?: string },
        file?: any,
    ) {
        const existingCategory = await this.findOne(id);

        if (!existingCategory) {
            throw new NotFoundException('Category not found');
        }

        const updateData: any = {
            name : existingCategory.name, // Default to existing name
            icon : existingCategory.icon, // Default to existing icon
        };

        // Only update name if provided
        if (updateGroupCategoryDto.name) {
            updateData.name = updateGroupCategoryDto.name;
        }

        // Only update icon if file exists
        if (file && file.buffer) {
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
