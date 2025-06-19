import { RequestDto_CombineRandomTree, RequestDto_CombineFomulaTree,RequestDto_PlantTree,RequestDto_FinalMap,RequestDto_PlantNursury,RequestDto_SwapGold } from "../dto/request.dto"; // DTO 임포트
import { ResponseDto_CombineTree,ResponseDto_FinalMapInfo,ResponseDto_SwapGold ,ResponseDto_TreeInfomation} from "../dto/response.dto"; // 응답 DTO 임포트
import { Controller,Param,Body,Get,Put,Post,Logger  } from "@nestjs/common";
import { GameService } from "../game/game.service";
import * as ClientDto from "../dto/client_dto";


import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody
} from '@nestjs/swagger'; //Swagger 데코레이터 추가

@ApiTags('Game')
@Controller('Game') 
export class GameController{
    private readonly logger = new Logger("GameController");
    constructor(private GameService: GameService) {}
    //GET Protocol
    
   //최종 나무 심기
    @Put('PlantNursuryTree/:userIndex')
        
        @ApiOperation({
        summary: '양묘장에 나무 심기',
        description: '지정된 사용자가 특정 위치에 나무를 최종적으로 심습니다.'
        })
        
        @ApiParam({
        name: 'userIndex', // 파라미터 이름 일치
        required: true,
        description: '나무를 심는 사용자의 고유 인덱스',
        example: 9,
        type: Number, // 파라미터 타입을 명시
        })
        
        @ApiBody({ // 요청 본문에 대한 설명
        type: RequestDto_PlantNursury, //정의한 DTO 클래스를 타입으로 지정
        description: '양묘장에 나무심기 ',
        examples: { 
            basicExample: {
            summary: '양묘장에 나무심기',
            value: {
                treeIndex: 1000,
                plantMapPos: 1,
                
            } as RequestDto_PlantNursury // 타입 단언
            }        
        }
        })
        
        @ApiResponse({
        status: 200, // 또는 201 Created가 더 적절할 수 있음 (PUT 요청이 리소스를 생성하거나 완전히 대체하므로)
        description: '양묘장에 나무심기 성공',
        // type: SomeSuccessResponseDto, // 성공 응답 DTO가 있다면 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })
        
    async plantNusury(@Param('userIndex') uIndex: number, @Body() plantTree: ClientDto.PlantNursury)
    {
        this.logger.log('plantTree: '+ JSON.stringify(plantTree));
        return this.GameService.plantNusury(uIndex,plantTree);
           
    }


    //최종 나무 심기
    @Put('finalPlantTree/:userIndex')
        
        @ApiOperation({
        summary: '최종 나무 심기',
        description: '지정된 사용자가 특정 위치에 나무를 최종적으로 심습니다.'
        })
        
        @ApiParam({
        name: 'userIndex', // 파라미터 이름 일치
        required: true,
        description: '나무를 심는 사용자의 고유 인덱스',
        example: 9,
        type: Number, // 파라미터 타입을 명시
        })
        
        @ApiBody({ // 요청 본문에 대한 설명
        type: RequestDto_PlantTree, //정의한 DTO 클래스를 타입으로 지정
        description: '나무 심기 요청 정보',
        examples: { 
            basicExample: {
            summary: '기본 나무 심기 예시',
            value: {
                treeIndex: 1,
                LocationMapX: "0016110",
                LocationMapY: "0120130",
                plantMapPos: 1,
                
            } as RequestDto_PlantTree // 타입 단언
            }        
        }
        })
        
        @ApiResponse({
        status: 200, // 또는 201 Created가 더 적절할 수 있음 (PUT 요청이 리소스를 생성하거나 완전히 대체하므로)
        description: '나무 심기 성공',
        // type: SomeSuccessResponseDto, // 성공 응답 DTO가 있다면 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })
        
    async finalPlantTree(@Param('userIndex') uIndex: number, @Body() plantTree: ClientDto.PlantTree)
    {
        this.logger.log('plantTree: '+ JSON.stringify(plantTree));
        return this.GameService.finalPlantTree(uIndex,plantTree);
           
    }

    //고정 확률 나무 합성하기
    @Put('combinefoumulaTree/:userIndex')
        
        @ApiOperation({
        summary: '고정 확률 나무 합성하기',
        description: '지정된 사용자가 보유한 묘목을 합성하여 새로운 나무를 생성합니다.'
        })
        
        @ApiParam({
        name: 'userIndex', // 파라미터 이름 일치
        required: true,
        description: '나무를 심는 사용자의 고유 인덱스',
        example: 9,
        type: Number, // 파라미터 타입을 명시
        })
        
        @ApiBody({ // 요청 본문에 대한 설명
        type: RequestDto_CombineFomulaTree, //정의한 DTO 클래스를 타입으로 지정
        description: '나무 합성 재료 정보, 순서는 상관없음,  예를 들어 src1: 1000, src2: 1001 도 가능하고 src1: 1001, src2: 1000 도 가능',
        examples: { 
            basicExample: {
            summary: '나무 합성하기 예시, 삼나무(3010)와 민들레(3017)를 합성하여 리그눔바이테(4007) or 론코카르푸스(4017)를 생성',
            value: {
                src1: 3010,
                src2: 3017
            } as RequestDto_CombineFomulaTree // 타입 선언
            }        
        }
        })
        
        @ApiResponse({
        status: 200, // 또는 201 Created가 더 적절할 수 있음 (PUT 요청이 리소스를 생성하거나 완전히 대체하므로)
        description: '나무 고정확률 합성 성공',
        type: ResponseDto_CombineTree, // 성공 응답 DTO가 있다면 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })

    async combineFomulaTree(@Param('userIndex') uIndex: number, @Body() plantTree: ClientDto.CombineFomulaTree)
    {
        console.log(plantTree);
        return this.GameService.combineFomulaTree(uIndex,plantTree);
           
    }

    //랜덤 나무 합성하기 결과물이 랜덤하게 나옴
    @Put('combineRandomTree/:userIndex')
        
        @ApiOperation({
        summary: '랜덤 확률 나무 합성하기',
        description: '지정된 사용자가 보유한 묘목을 합성하여 새로운 나무를 생성합니다.'
        })
        
        @ApiParam({
        name: 'userIndex', // 파라미터 이름 일치
        required: true,
        description: '나무를 심는 사용자의 고유 인덱스',
        example: 9,
        type: Number, // 파라미터 타입을 명시
        })
        
        @ApiBody({ // 요청 본문에 대한 설명
        type: RequestDto_CombineRandomTree, //정의한 DTO 클래스를 타입으로 지정
        description: '나무 합성 재료 정보, 순서는 상관없음',
        examples: { 
            basicExample: {
            summary: '나무 합성하기 예시, 물이끼(1000) 3개로 고사리 (2000) 부터 능수쇠뜨기(2014) 까지 중에  하나 합성',
            value: {
                src1: 1000,
                src2: 1000,
                src3: 1000
            } as RequestDto_CombineRandomTree // 타입 선언
            }        
        }
        })
        
        @ApiResponse({
        status: 200, // 또는 201 Created가 더 적절할 수 있음 (PUT 요청이 리소스를 생성하거나 완전히 대체하므로)
        description: '나무 합성 성공',
        type: ResponseDto_CombineTree, // 성공 응답 DTO가 있다면 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })

    async combineRandomTree(@Param('userIndex') uIndex: number, @Body() plantTree: ClientDto.CombineRandomTree)
    {
        console.log(plantTree);
        return this.GameService.combineRandomTree(uIndex,plantTree);
           
    }

    //최종 맵 정보 가져오기 
    @Put('getFinalMapInfo')
        
        @ApiOperation({
        summary: '최종 7단계 맵 정보',
        description: '해당 맵의 진입 가능 여부, 해당맵에 식재된 나무정보, 나무 보유 유저 이름, 탄소량 정보를 제공합니다'
        })
        
                
        @ApiBody({ // 요청 본문에 대한 설명
        type: RequestDto_FinalMap, //정의한 DTO 클래스를 타입으로 지정
        description: '해당 좌표에 해당하는 맵 정보 요청',
        examples: { 
            basicExample: {
            summary: '해당 좌표에 해당하는 맵 정보 요청',
            value: {
                LocationMapX: "0016110",
                LocationMapY: "0120130",
               
            } as RequestDto_FinalMap // 타입 선언
            }        
        }
        })
        
        @ApiResponse({
        status: 200, // 또는 201 Created가 더 적절할 수 있음 (PUT 요청이 리소스를 생성하거나 완전히 대체하므로)
        description: '최종 맵 정보 확인',
        type: ResponseDto_FinalMapInfo, // 성공 응답 DTO가 있다면 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })

    async getFinalMapInfo( @Body() GetFinalMapInfo: ClientDto.GetFinalMapInfo)
    {
        console.log(GetFinalMapInfo);
        return this.GameService.getFinalMapInfo(GetFinalMapInfo);
           
    }

    //골드 스왑하기기
    @Put('swapGold/:userIndex')
        
        @ApiOperation({
        summary: '탄소를 골드로 스왑하기 ',
        description: '1대100의 환율로 탄소를 골드로 바꿔줍니다. 교환 최소 단위는 탄소 1g이며 정수단위로 바꿀 수 있습니다. '
        })
        
                
        @ApiBody({ // 요청 본문에 대한 설명
        type: RequestDto_SwapGold, //정의한 DTO 클래스를 타입으로 지정
        description: '교환할 탄소량',
        examples: { 
            basicExample: {
            summary: '교환할 탄소량',
            value: {
                Co2forSwap: 1,
       
            } as RequestDto_SwapGold // 타입 선언
            }        
        }
        })
        
        @ApiResponse({
        status: 200, // 또는 201 Created가 더 적절할 수 있음 (PUT 요청이 리소스를 생성하거나 완전히 대체하므로)
        description: '치환된 골드드',
        type: ResponseDto_SwapGold, // 성공 응답 DTO가 있다면 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })

    async swapGold(@Param('userIndex') uIndex: number, @Body() SwapGold: RequestDto_SwapGold)
    {
        console.log(SwapGold);
        return this.GameService.SwapGold(uIndex,SwapGold);
           
    }

    //아이템 정보 조회회
    @Put('getTreeInfo/:itemIndex')
        
        @ApiOperation({
        summary: '나무 상세 정보 조회 ',
        description: '나무의 상세 정보를 조회하여 리턴턴'
        })
        
        @ApiParam({ //경로 파라미터 'uuid'에 대한 설명
          name: 'itemIndex',
          required: true,
          description: '나무무 일련번호',
          example: 1000,
          type: Number
        })        
       
        
        @ApiResponse({
        status: 200, // 또는 201 Created가 더 적절할 수 있음 (PUT 요청이 리소스를 생성하거나 완전히 대체하므로)
        description: '나무의 상세 정보 정보',
        type: ResponseDto_TreeInfomation, // 성공 응답 DTO가 있다면 지정
        })
        @ApiResponse({ status: 400, description: '잘못된 요청 (예: 없는 사용자)' })
        @ApiResponse({ status: 404, description: '리소스를 찾을 수 없음' })
        @ApiResponse({ status: 500, description: '서버 내부 오류 (EX : DB Error)' })

    async getTreenfo(@Param('itemIndex') itemIndex: number)
    {
        console.log(itemIndex);
        return this.GameService.getTreenfo(itemIndex);
           
    }


     //TEST
    @Get('getALLTreeInfo/:itemIndex')
      

    async getAllTreenfo(@Param('itemIndex') itemIndex: number)
    {
        console.log(itemIndex);
        return this.GameService.getAllTreenfo(itemIndex);
           
    }

}
