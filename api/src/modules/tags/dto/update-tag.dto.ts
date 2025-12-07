import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';

export class UpdateTagDto {
  @ApiProperty({ description: '标签名称', required: false })
  @IsOptional()
  @IsNotEmpty({ message: '标签名称不能为空' })
  @IsString()
  name?: string;

  @ApiProperty({ description: '标签颜色', required: false })
  @IsOptional()
  @IsHexColor({ message: '颜色格式不正确' })
  color?: string;
}