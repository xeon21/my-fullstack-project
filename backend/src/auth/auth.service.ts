// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository'; // [수정]

@Injectable()
export class AuthService {
  // [수정] AuthRepository를 주입받습니다.
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository
  ) {}

  // [수정] DB에서 사용자를 찾아 비밀번호를 비교합니다.
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.authRepository.findUserByUsername(username);
    // 실제 애플리케이션에서는 bcrypt.compare(pass, user.password) 와 같이 해시 비교를 해야 합니다.
    if (user && user.password === pass) {
      const { password, ...result } = user; // 비밀번호를 제외한 나머지 정보만 반환
      return result;
    }
    return null;
  }

  async login(user: any) {
    const validatedUser = await this.validateUser(user.username, user.password);
    if (!validatedUser) {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }
    // [수정] payload에 권한 정보도 추가
    const payload = { 
        username: validatedUser.username, 
        sub: validatedUser.userId,
        permissions: validatedUser.permissions
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}