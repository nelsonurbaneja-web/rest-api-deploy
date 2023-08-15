const z = require('zod')

const movieShema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is require'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10),
  poster: z.string().url({ message: 'Poster must be a valid URL' }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum'
    }
  )
})

const validateMovie = (object) => {
  return movieShema.safeParse(object)
}

const validatePartialMovie = (object) => {
  return movieShema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
