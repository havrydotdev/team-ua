class CreateUserDto {
  chatId: string;
  userId: string;
}

class UpdateUserDto implements Partial<CreateUserDto> {}

export { CreateUserDto, UpdateUserDto };
