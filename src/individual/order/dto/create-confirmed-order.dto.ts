import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class User_Info {
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsNotEmpty()
    @IsString()
    date_of_birth: string;

    @IsNotEmpty()
    @IsString()
    full_name: string;
    
    @IsNotEmpty()
    @IsString()
    phone_number: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class CreateConfirmedOrderDto {
    @IsNotEmpty()
    @IsString()
    api_key: string;

    @IsNotEmpty()
    @IsString()
    order_id: string;

    @IsNotEmpty()
    @IsString()
    result: string;

    @IsNotEmpty()
    user_info: User_Info;
    
    @IsString()
    description: string;
}
