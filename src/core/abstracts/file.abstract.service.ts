abstract class IFileService {
  abstract upload(data: Buffer, fileName: string): Promise<number>;
}

export { IFileService };
