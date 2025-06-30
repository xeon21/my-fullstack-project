// backend/src/project/project.service.ts
import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  create(createProjectDto: CreateProjectDto) {
    return this.projectRepository.create(createProjectDto);
  }

  findAll() {
    return this.projectRepository.findAll();
  }

  findOne(id: number) {
    return this.projectRepository.findOne(id);
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectRepository.update(id, updateProjectDto);
  }

  remove(id: number) {
    return this.projectRepository.remove(id);
  }
}