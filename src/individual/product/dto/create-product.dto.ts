import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export interface Category {
    id: number;
    name: string;
}

export class CreateProductDto {
    @IsArray()
    image: string[];
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @IsString()
    @IsNotEmpty()
    itemCode: string;

    @IsString()
    @IsOptional()
    status: string;

    @IsArray()
    @IsNotEmpty()
    categories: Array<Category>

    @IsString()
    @IsNotEmpty()
    stock_status: string;
}
