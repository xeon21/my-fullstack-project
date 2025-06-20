
import { GameRepository } from './game.repository';
import { Injectable } from "@nestjs/common";
import * as ClientDto from "../dto/client_dto";
import { RequestDto_SwapGold } from "../dto/request.dto"; // DTO 임포트

@Injectable()
export class GameService {
  
    constructor( private readonly mysqlProvider: GameRepository ) {}

    finalPlantTree(uIndex: number, plantTree:ClientDto.PlantTree) {
        return this.mysqlProvider.finalPlantTree(uIndex,plantTree);
    }

    combineFomulaTree(uIndex: number, plantTree: ClientDto.CombineFomulaTree) {
        return this.mysqlProvider.combineFomulaTree(uIndex,plantTree);
    }
 
    combineRandomTree(uIndex: number, plantTree: ClientDto.CombineRandomTree) {
        return this.mysqlProvider.combineRandomTree(uIndex,plantTree);
    }

    getFinalMapInfo(FinalMapInfo: ClientDto.GetFinalMapInfo) {
        return this.mysqlProvider.getFinalMapInfo(FinalMapInfo);
    }

    plantNusury(uIndex: number, plantTree:ClientDto.PlantNursury) {
        return this.mysqlProvider.plantNusury(uIndex,plantTree);
    }

    SwapGold(uIndex: number, SwapGold:RequestDto_SwapGold) {
        return this.mysqlProvider.SwapGold(uIndex,SwapGold);
    }

    getTreenfo(itemIndex: number) {
        return this.mysqlProvider.getTreenfo(itemIndex);
    }

     getAllTreenfo(itemIndex: number) {
        return this.mysqlProvider.getAllTreenfo(itemIndex);
    }




}
