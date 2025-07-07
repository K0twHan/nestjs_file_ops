import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Express, response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'; // Adjust the import path as necessary
import { diskStorage } from 'multer';
import { SkipThrottle, Throttle, throttlerMessage } from '@nestjs/throttler';
@SkipThrottle()
@Controller('file')
export class FileController {
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', 20, {
      fileFilter: (req, file, cb) => {
        // Optional: You can add file type validation here
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', ,];
        if (!allowedTypes.includes(file.mimetype)) {
          cb(new Error('File type not allowed'), false);
          return;
        } else {
          cb(null, true); // Accept the file
        }
      },
      storage: diskStorage({
        destination: './uploads', // Specify the directory to save the uploaded files
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileName = `${file.fieldname}-${uniqueSuffix}-${file.originalname}`;
          cb(null, fileName); // Call the callback with the new file name
        },
      }),
    }),
  )
  uploadFile(@UploadedFiles() file: Express.Multer.File[]) {
    // Handle the uploaded file

    console.log('File uploaded:', file);
    return {
      message: 'File uploaded successfully',
    };
  }

  // Limit to 5 requests per minute
  @SkipThrottle()
  @Post('upload-single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileName = `SingleFile ${file.fieldname}-${uniqueSuffix}-${file.originalname}`;
          cb(null, fileName); // Call the callback with the new file name
        },
      }),
    }),
  )
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    console.log('File uploaded:', file);
    return {
      message: 'File uploaded successfully',
    };
  }
}
