// backend/src/project/project.repository.ts
import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import { CreateProjectDto, UpdateProjectDto } from '../dto/project.dto';

@Injectable()
export class ProjectRepository {
  constructor(private readonly db: MysqlProvider) {}

  async create(createProjectDto: CreateProjectDto): Promise<any> {
    const { name, data } = createProjectDto;
    const jsonData = JSON.stringify(data);
    const query = 'INSERT INTO projects (name, data) VALUES (?, ?)';
    const result = await this.db.executeQuery<any>(query, [name, jsonData]);
    return { id: result.insertId, ...createProjectDto };
  }

  async findAll(): Promise<any> {
    const query = 'SELECT id, name, createdAt, updatedAt FROM projects ORDER BY updatedAt DESC';
    return this.db.executeQuery(query);
  }

  async findOne(id: number): Promise<any> {
    const query = 'SELECT * FROM projects WHERE id = ?';
    const rows = await this.db.executeQuery<any[]>(query, [id]);
    return rows[0];
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<any> {
    const { name, data } = updateProjectDto;
    
    const fields: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
        fields.push('name = ?');
        params.push(name);
    }
    if (data !== undefined) {
        const jsonData = JSON.stringify(data);
        fields.push('data = ?');
        params.push(jsonData);
    }

    // [수정] 업데이트할 필드가 없으면 쿼리를 실행하지 않고 바로 반환합니다.
    if (fields.length === 0) {
        return { affectedRows: 0, message: 'No fields to update' };
    }

    params.push(id);
    const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;

    return this.db.executeQuery(query, params);
  }

  async remove(id: number): Promise<any> {
    const query = 'DELETE FROM projects WHERE id = ?';
    return this.db.executeQuery(query, [id]);
  }
}