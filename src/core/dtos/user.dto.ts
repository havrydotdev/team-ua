class CreateUserDto {
  chatId: number;
  userId: number;
}

class UpdateUserDto implements Partial<CreateUserDto> {}

export { CreateUserDto, UpdateUserDto };
