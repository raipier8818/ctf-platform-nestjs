import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard("refresh") {}

@Injectable()
export class AdminAuthGuard extends AuthGuard("admin") {}

@Injectable()
export class ManagerAuthGuard extends AuthGuard("manager") {}