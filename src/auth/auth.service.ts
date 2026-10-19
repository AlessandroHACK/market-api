import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/auth.entity';
import { checkPassword, hashPassword } from './helpers/password.helper';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }


  async create(createUserDto: CreateUserDTO) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: await hashPassword(password)
      });

      await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDTO) {
    const { email, password } = loginUserDto;

    try {
      // validate if user exists
      const user = await this.userRepository.findOne({
        where: { email },
        select: { id: true, email: true, password: true }
      })
      if (!user) {
        throw new UnauthorizedException('Credenciales no validas');
      }

      // validate password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new UnauthorizedException('Credenciales no validas');
      }

      //TODO: return jwt
      const token = this.getJwt({id: user.id});
      const { password: _, ...rest } = user;
      return {
        ...rest,
        token
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign( payload );
    return token;
  }


  private handleDBErrors(error: any): never {
    if (error instanceof HttpException) throw error;
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error)

    throw new InternalServerErrorException('Por favor revisa los logs del servidor.')

  }
}
