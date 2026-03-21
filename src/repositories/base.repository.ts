export interface IBaseRepository<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(filter?: any): Promise<T[]>;
  create(data: CreateDTO): Promise<T>;
  update(id: ID, data: UpdateDTO): Promise<T>;
  delete(id: ID): Promise<boolean>;
}