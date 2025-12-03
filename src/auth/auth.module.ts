import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserService } from "./auth.service";
import { RepositoriesModule } from "../infrastructure/repositories/memory/repositories.module";


@Module({
    controllers: [AuthController],
    providers: [UserService],
    imports: [RepositoriesModule],
})
export class AuthModule {}