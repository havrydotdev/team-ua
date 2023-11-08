import { Game, Profile } from '../entities';

const getCaption = (profile: Profile) => {
  return (
    `${profile.name}, ${profile.age}:\n\n${profile.about}\n\n` +
    getGamesCaption(profile.games)
  );
};

const getReportCaption = (profile: Profile) => {
  return (
    `New report:\n\n${profile.name}, ${profile.age}:\n\n${profile.about}\n\n` +
    getGamesCaption(profile.games)
  );
};

const getGamesCaption = (games: Game[]) => {
  return games.map((game) => getGameHashTag(game)).join(' ');
};

const getGameHashTag = (game: Game) =>
  `#${game.title.replaceAll(/\s+|-|:/g, '_')}`;

export { getCaption, getReportCaption };
