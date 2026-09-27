const fs = require('fs');
const path = require('path');

// 1. Update RegisterDto to accept both whatsapp and phone optionally (as long as one exists)
const dtoPath = path.resolve('..', 'BE-JahitFlow', 'src', 'auth', 'dto', 'register.dto.ts');
let dtoContent = fs.readFileSync(dtoPath, 'utf8');

dtoContent = `import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap pemilik usaha' })
  @IsString()
  @IsNotEmpty({ message: 'Nama pemilik wajib diisi' })
  name: string;

  @ApiProperty({ example: 'budi@jahitflow.com', description: 'Alamat email aktif' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8, description: 'Kata sandi minimal 8 karakter' })
  @IsString()
  @MinLength(8, { message: 'Kata sandi minimal 8 karakter' })
  password: string;

  @ApiProperty({ example: 'Satria Tailor', description: 'Nama usaha jahit/butik/konveksi' })
  @IsString()
  @IsNotEmpty({ message: 'Nama usaha wajib diisi' })
  businessName: string;

  @ApiProperty({ example: '081234567890', description: 'Nomor WhatsApp usaha', required: false })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({ example: '081234567890', description: 'Nomor telepon usaha (alias WhatsApp)', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Usaha Jahit', default: 'Usaha Jahit', description: 'Kategori usaha jahit', required: false })
  @IsString()
  @IsOptional()
  businessType?: string;

  @ApiProperty({ example: 'Jl. Melati No. 10', required: false, description: 'Alamat tempat usaha' })
  @IsString()
  @IsOptional()
  address?: string;
}
`;
fs.writeFileSync(dtoPath, dtoContent, 'utf8');
console.log('Updated register.dto.ts');

// 2. Update auth.service.ts to use dto.whatsapp || dto.phone
const authSvcPath = path.resolve('..', 'BE-JahitFlow', 'src', 'auth', 'auth.service.ts');
let authSvcContent = fs.readFileSync(authSvcPath, 'utf8');
authSvcContent = authSvcContent.replace(
  'whatsapp: dto.whatsapp,',
  'whatsapp: dto.whatsapp || dto.phone || "081234567890",'
);
fs.writeFileSync(authSvcPath, authSvcContent, 'utf8');
console.log('Updated auth.service.ts');
