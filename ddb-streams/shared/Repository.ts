export interface Repository<T> {
    find(id: string): Promise<T>

    save(item: T): Promise<boolean>

    delete(item: T): Promise<boolean>

    update(item: T): Promise<boolean>
}