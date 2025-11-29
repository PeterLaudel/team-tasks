import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserService } from "./auth.service";
import { UserRepository } from "./userRepository";


@Module({
    controllers: [AuthController],
    providers: [UserService, UserRepository],
})
export class AuthModule {}