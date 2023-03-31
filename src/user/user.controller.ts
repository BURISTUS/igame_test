import { Controller, Patch, UseGuards, Get, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch('edit')
    async editUser(
        @GetUser('id') userId: number,
        @Body() editUserDto: EditUserDto,
    ): Promise<User> {
        return await this.userService.editUser(userId, editUserDto);
    }

    @Get('get-self')
    async getSelf(@GetUser() user: User): Promise<User> {
        delete user.hash;
        return user;
    }
}
