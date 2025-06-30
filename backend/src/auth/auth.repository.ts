// backend/src/auth/auth.repository.ts
import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';

@Injectable()
export class AuthRepository { // 클래스 이름 변경
  constructor(private readonly db: MysqlProvider) {}

  // 로그인 시 사용자 정보를 찾는 메소드
  async findUserByUsername(username: string): Promise<any> {
    // 실제로는 users 테이블에서 사용자를 찾아야 합니다.
    // 여기서는 예시로 하드코딩된 값을 반환합니다.
    if (username === 'test') {
      return { 
        userId: 1, 
        username: 'test', 
        password: '1234', // 실제로는 해시된 비밀번호여야 합니다.
        permissions: ['menu_admin_view', 'menu_dashboard_view'] 
      };
    }else if (username === 'admin') {
      return { 
        userId: 2, 
        username: 'admin', 
        password: 'admin123', // 실제로는 해시된 비밀번호여야 합니다.
        permissions: ['menu_admin_view', 'menu_dashboard_view','menu_user_management'] 
      };
      
    }
    return null;
  }
}