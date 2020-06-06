import { MovieGenreTransform } from './movie.entity';

describe('MovieGenreTransform', () => {
  describe('when transforming from database', () => {
    const EXPECTED = ['genre1', 'genre2', 'genre3'];

    it('should split genres', () => {
      const genres = MovieGenreTransform.from('genre1|genre2|genre3');
      expect(genres).toEqual(expect.arrayContaining(EXPECTED));
    });

    it('should trim genres', () => {
      const genres = MovieGenreTransform.from(' genre1 | genre2 | genre3 ');
      expect(genres).toEqual(expect.arrayContaining(EXPECTED));
    });
  });

  describe('when transforming to database', () => {
    const EXPECTED = 'genre1|genre2|genre3';

    it('should join genres', () => {
      const genres = MovieGenreTransform.to(['genre1', 'genre2', 'genre3']);
      expect(genres).toEqual(EXPECTED);
    });

    it('should trim genres', () => {
      const genres = MovieGenreTransform.to([
        ' genre1 ',
        ' genre2 ',
        ' genre3 ',
      ]);
      expect(genres).toEqual(EXPECTED);
    });
  });
});
