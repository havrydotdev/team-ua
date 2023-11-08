import { createMock } from '@golevelup/ts-jest';
import { Game, Profile } from 'src/core/entities';

import { getCaption } from '../get-caption';

describe('getCaption', () => {
  it('should return a formatted string with the profile and games information', () => {
    const games: Game[] = [
      createMock<Game>({ title: 'Game 1' }),
      createMock<Game>({ title: 'Game 2' }),
    ];
    const profile: Profile = createMock<Profile>({
      about: 'About Test',
      age: 20,
      games,
      name: 'Test',
    });

    const result = getCaption(profile);

    expect(result).toEqual('Test, 20:\n\nAbout Test\n\n#Game_1 #Game_2');
  });
});
