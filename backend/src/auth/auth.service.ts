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

     console.log(user);
    // 사용자가 존재하고, 비밀번호가 일치하는지 확인 (평문 비교)
    if (user && user.password === pass) {
      // DB에서 사용자의 권한을 가져옵니다.
      const permissions = await this.authRepository.getUserPermissions(user.userId);

      const { password, ...result } = user; // 비밀번호는 제외
      return {
        ...result,
        permissions, // 권한 정보를 결과에 추가
      };
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