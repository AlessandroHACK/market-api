import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDTO {
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email: string;

    @IsString({ message: 'La contraseña debe ser un texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @MaxLength(50, { message: 'La contraseña no puede superar los 50 caracteres' })
    @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/, {
        message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    })
    password: string;

}