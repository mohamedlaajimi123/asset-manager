import { Controller, Get, Post, Delete, Param, Res, StreamableFile, UseGuards, UseInterceptors, UploadedFile, NotFoundException, Body,BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express, Response } from 'express';
import type { Readable } from 'stream';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import 'multer';

type MulterFile = Express.Multer.File;

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post('folders')
  async createCustomFolder(@Body('name') name: string, @CurrentUser() user: any) {
    return this.assetsService.createFolder(name, user.userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Cleaned up! No hardcoded limit.
  async uploadAsset(@UploadedFile() file: MulterFile, @CurrentUser() user: any) {
    if (!file) {
      throw new BadRequestException('File payload is missing.');
    }
    return this.assetsService.createAsset(file, user.userId);
  }

  @Get()
  async listAssets(@CurrentUser() user: any) {
    return this.assetsService.listAssetsByUser(user.userId, user.role); // ◄— Fixed: Added user.role
  }

  @Get('storage')
  async getStorageUsage(@CurrentUser() user: any) {
    return this.assetsService.getStorageUsage(user.userId);
  }

  @Get(':id')
  async downloadAsset(
    @Param('id') id: string, 
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: Response
  ) {
    // ◄— Fixed: Added user.role below
    const { asset, stream } = await this.assetsService.getAssetFile(id, user.userId, user.role); 
    res.set({
      'Content-Type': asset.mimeType,
      'Content-Disposition': `attachment; filename="${asset.filename}"`,
    });
    return new StreamableFile(stream as Readable);
  }

  @Post(':id/sas')
  async getSasUrl(@Param('id') id: string, @CurrentUser() user: any) {
    return { url: await this.assetsService.generateBlobSasUrl(id, user.userId, user.role) }; 
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: string, @CurrentUser() user: any) {
    return this.assetsService.deleteAsset(id, user.userId, user.role); 
  }
  @Get('folders/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async listFolders(@CurrentUser() user: any) {
    return this.assetsService.listFoldersByUser(user.userId, user.role);
  }

  @Delete('admin/all/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async adminForceDeleteAsset(@Param('id') id: string) {
    return this.assetsService.adminForceDeleteAsset(id);
  }
}