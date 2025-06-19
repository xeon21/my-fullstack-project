import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import * as ClientDto from "../dto/client_dto";
import { RequestDto_SwapGold } from "../dto/request.dto"; // DTO 임포트
@Injectable()
export class GameRepository {
  constructor(private readonly db: MysqlProvider) {}


 //양묘장 심기기
    async plantNusury(uIndex: number, plantTree: ClientDto.PlantNursury): Promise<any> {
        const query = 'CALL PlantNusury(?,?,?)';
        const param = [
                        uIndex,
                        plantTree.treeIndex,
                        plantTree.plantMapPos,
                      ];
        
        const rows = await this.db.executeQuery<any[]>(query,param);  
        const firstRow = rows[0];

        console.log('plantNusury Raw Result:',firstRow);
        
        if (!rows || rows.length === 0) {
            console.log('plantNusury Raw Result Not Exist');
            return{
                result: 0                
            }
        }
      
        const result = firstRow[0].Result;

        console.log(result);
        return {
            result: result
        };
    }
    

 //내나무 심기기
    async finalPlantTree(uIndex: number, plantTree: ClientDto.PlantTree): Promise<any> {
        const query = 'CALL PlantTree(?,?,?,?,?)';
        const param = [
                        uIndex,
                        plantTree.treeIndex,
                        plantTree.plantMapPos,
                        plantTree.LocationMapX,
                        plantTree.LocationMapY
                       
                    ];
        
        const rows = await this.db.executeQuery<any[]>(query,param);  
        const firstRow = rows[0];

        console.log('getMyTreeInfo Raw Result:',firstRow);
        
        if (!rows || rows.length === 0) {
            console.log('Raw Result Not Exist');
            return{
                result: 0                
            }
        }
      
        const result = firstRow[0].Result;

        console.log(result);
        return {
            result: result
        };
    }
    
    //고정 확률 식물 합성하기 
    async combineFomulaTree(uIndex: number, plantTree: ClientDto.CombineFomulaTree): Promise<any> {
        const query = 'CALL CombineFomulaTree(?,?,?)';
        const param = [uIndex,plantTree.src1,plantTree.src2];

        console.log(param);
        const rows = await this.db.executeQuery<any[]>(query,param);
        
        const firstRow = rows[0];

        console.log('combineNursuryTree Raw Result:',firstRow);
        
        if (!rows || firstRow.length === 0) {
            console.log('combineNursuryTree Raw Result Not Exist');

            return{
                result: 0,
                CombineItem: 0
            }
        }

        //const result = firstRow[0].Result;
        var result = 0;
        if (firstRow[0].PID > 0)
            result = 1; 
        return {
            result: result,
            Name: firstRow[0].Name,
            CombineItem: firstRow[0].PID
        };
    }

    //랜덤 확률 식물 합성하기 
    async combineRandomTree(uIndex: number, plantTree: ClientDto.CombineRandomTree): Promise<any> {
        const query = 'CALL CombineRandomTree(?,?,?,?)';
        const param = [uIndex,plantTree.src1,plantTree.src2,plantTree.src3];

        console.log(param);
        const rows = await this.db.executeQuery<any[]>(query,param);
        
        const firstRow = rows[0];

        console.log('combineRandomTree Raw Result:',firstRow);
        console.log('combineRandomTree Raw Result:',firstRow.length);
        
        if (!rows || firstRow.length === 0) {
            console.log('combineRandomTree Raw Result Not Exist');

            return{
                result: 0,
                CombineItem: 0
            }
        }else
        {
                 //const result = firstRow[0].Result;
            var result = 0;
            if (firstRow[0].PID > 0)
                result = 1; 

            return {
                result: result,
                Name: firstRow[0].Name,
                CombineItem: firstRow[0].PID
        };
        }

       
    }

     //최종 맵 정보 가져오기 
     
    async getFinalMapInfo(getFinalMap: ClientDto.GetFinalMapInfo): Promise<ClientDto.FinalMapInfo> {
        const query = 'CALL GetFinalMapInfo(?,?)';
        const param = [getFinalMap.LocationMapX,getFinalMap.LocationMapY];
          
        const rows = await this.db.executeQuery<any[]>(query,param);
           
        const firstRow = rows[0];
        console.log('getMyTreeInfo Raw Result:',firstRow);
        const randomIsActive = Math.random() < 0.9 ? 1 : 0;   
        if (!rows || rows.length === 0) {
            console.log('Raw Result Not Exist');
            
            return{
                    isActive : 0,
                    MapData : []
                   }
           }
                
            return {
                        
                        //isActive: 1,
                        isActive: randomIsActive,
                        MapData: firstRow.map(row => ({
                            treeIndex: row.treeIndex,
                            plantMapPos: row.plantMapPos,
                            ownerName: row.ownerName,
                            carbon: row.carbon
                          
                      })),
                  };
    }

     //탄소 골드 스왑왑 
    async SwapGold(uIndex: number, swapGold: RequestDto_SwapGold): Promise<any> {
        const query = 'CALL SwapGold(?,?)';
        const param = [uIndex,swapGold.Co2forSwap];

        console.log(param);
        const rows = await this.db.executeQuery<any[]>(query,param);
        
        const firstRow = rows[0];

        console.log('SwapGold Raw Result:',firstRow);
        
        if (!rows || rows.length === 0) {
            console.log('SwapGold Raw Result Not Exist');

            return{
                result: 0,
                SwapGold: 0
            }
        }

       var result = 0;
       if(firstRow[0].SwapGold > 0)
        result = 1;
      
        return {
            result: result,
            SwapGold: firstRow[0].SwapGold,
         };
    }

     //Tree 정보 가져오기
     async getTreenfo(itemIndex: number): Promise<ClientDto.ItemInfo> {
            const query = 'CALL getTreeInfo(?)';
            const param = [itemIndex];
            const rows = await this.db.executeQuery<any[]>(query,param);
            
            
            if (!rows || rows.length === 0) {
                console.log('Raw Result Not Exist');
      
                return{
                      
                     itemLv: 0,
                     name_KR: 'none',
                     name_EN: 'none',
                     name_EC: 'none',
                     co2_1:0,
                     co2_2: 0,
                     co2_3: 0,
                     co2_4: 0,
                     life_1: 0,
                     life_2: 0,
                     life_3: 0,
                     life_4: 0,
                }
            }
     
            const firstRow = rows[0];
            const userdata = firstRow[0];
            console.log('getTreenfo Raw Result:',firstRow);
            return {
                     itemLv: userdata.LEVEL,
                     name_KR: userdata.NAME_KR,
                     name_EN: userdata.NAME_EN,
                     name_EC: userdata.SCIENTIFIC,
                     co2_1: userdata.CO2ABS1,
                     co2_2: userdata.CO2ABS2,
                     co2_3: userdata.CO2ABS3,
                     co2_4: userdata.CO2ABS4,
                     life_1: userdata.LIFE1,
                     life_2: userdata.LIFE2,
                     life_3: userdata.LIFE3,
                     life_4: userdata.LIFE4,
              };
        }

         //내 TEst
            async getAllTreenfo(uIndex: number): Promise<any> {
                const query = 'CALL GetAllTreeInfo(?)';
                const param = [uIndex];
             
                console.log(param);
                const rows = await this.db.executeQuery<any[]>(query,param);
                console.log('getAllTreenfo Raw Result:',rows);
                const firstRow = rows[0];
                     
                if (!rows || rows.length === 0) {
                    console.log('Raw Result Not Exist');
                    const userdata = [];    
                    return{
                               data : userdata
                         }
                }
                   
                return {
                       
                        data: firstRow.map(row => ({
                                itemLv: row.LEVEL,
                                name_KR: row.NAME_KR,
                                name_EN: row.NAME_EN,
                                name_EC: row.SCIENTIFIC,
                                co2_1: row.CO2ABS1,
                                co2_2: row.CO2ABS2,
                                co2_3: row.CO2ABS3,
                                co2_4: row.CO2ABS4,
                                life_1: row.LIFE1,
                                life_2: row.LIFE2,
                                life_3: row.LIFE3,
                                life_4: row.LIFE4,
                         })),
                     };
            }
      
}
