import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class CentralAuthGuard implements CanActivate {
    constructor(private readonly configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies?.satellite_session;

        if (!token) {
            const hubUrl = this.configService.get<string>('CENTRAL_HUB_URL') || 'http://localhost:8000';
            const systemId = this.configService.get<string>('MY_SYSTEM_ID') || '3';
            const currentUrl = request.originalUrl; // or full URL reconstruction

            // In NestJS, throwing UnauthorizedException with a body is tricky for standard format
            // We'll throw simple 401, but we want to pass metadata. 
            // Ideally, a Global Exception Filter handles this.
            // For now, we mimic the python structure by throwing an error with a specific message structure
            // or attaching the verifyUrl to the response header?
            // Let's attach metadata to the exception response object.

            const verifyUrl = `${hubUrl}/auth/verify-session-browser?system_id=${systemId}&redirect_url=http://${request.headers.host}${currentUrl}`;

            throw new UnauthorizedException({
                message: 'Session expired or invalid',
                verify_url: verifyUrl,
            });
        }

        return true;
    }
}
