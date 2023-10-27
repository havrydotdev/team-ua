// import { Test, TestingModule } from '@nestjs/testing';
// import { UserFactoryService } from '../user-factory.service';

// jest.mock('src/core/entities', () => ({
//   User: jest.fn(() => ({
//     create: jest.fn(),
//     update: jest.fn(),
//   })),
// }));

// describe('UserFactoryService', () => {
//   let service: UserFactoryService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UserFactoryService],
//     }).compile();

//     service = module.get<UserFactoryService>(UserFactoryService);
//   });

//   describe('create', () => {
//     it('should create a new user with the provided data', () => {
//       const userMock = mocked(User);
//       userMock.mockImplementationOnce(
//         () =>
//           ({
//             create: jest.fn().mockReturnValue(createMock<User>(dto)),
//           }) as unknown as MockedObject<User>,
//       );
//       const dto: CreateUserDto = {
//         id: 12345,
//       };

//       const result = service.create(dto);

//       expect(result).toBeInstanceOf(User);
//       expect(result.id).toEqual(dto.id);
//     });
//   });

//   describe('update', () => {
//     it('should create a new user with the provided data', () => {
//       const dto: UpdateUserDto = {
//         id: 12345,
//       };

//       const result = service.update(dto);

//       expect(result).toBeInstanceOf(User);
//       expect(result.id).toEqual(dto.id);
//     });
//   });
// });
