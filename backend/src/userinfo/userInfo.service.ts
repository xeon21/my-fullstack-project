import { UsersRepository } from './userinfo.repository';
import { Injectable } from "@nestjs/common";


@Injectable()
export class UserInfoService {
  
    constructor(
    
        private readonly mysqlProvider: UsersRepository,
    ) {}

    getUserInfo(uIndex: number) {
        return this.mysqlProvider.getUserInfo(uIndex);
    }

    getMyTreeInfo(uIndex: number) {
        return this.mysqlProvider.getMyTreeInfo(uIndex);
    }

    getMyNusuryInfo(uIndex: number) {
        return this.mysqlProvider.getMyNusuryInfo(uIndex);
    }

     getMyItem(uIndex: number) {
        return this.mysqlProvider.getMyItem(uIndex);
    }

   
}
