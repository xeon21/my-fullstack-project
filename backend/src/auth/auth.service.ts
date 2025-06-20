import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // 실제로는 DB에서 유저를 찾아 비밀번호를 비교해야 합니다.
  // 여기서는 예시를 위해 하드코딩된 유저 정보로 검증합니다.
  async validateUser(username: string, pass: string): Promise<any> {
    if (username === 'test' && pass === '1234') {
      // 비밀번호는 제외하고 유저 정보를 반환합니다.
      return { userId: 1, username: 'test' };
    }
    return null;
  }

  async login(user: any) {
    const validatedUser = await this.validateUser(user.username, user.password);
    if (!validatedUser) {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }
    const payload = { username: validatedUser.username, sub: validatedUser.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}