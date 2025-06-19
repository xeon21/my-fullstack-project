import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.modules';
import { LoginModule } from './login/login.modules';
import { UserInfoModule } from './userinfo/userinfo.modules';

@Module({

  //imports: [
    //몽고디비 연결
    // MongooseModule.forRoot(
    //   'mongodb+srv://neosdh:aRdA69dCvgYnbEZ8@cluster0.hig4t.mongodb.net/blog',
    // ),
    // MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema}]),

  //],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 어디서든 사용할 수 있게 함
      envFilePath: '.env', // 기본값도 .env
    }),
    GameModule,
    LoginModule,
    UserInfoModule
  ],
   
})

export class AppModule {}
