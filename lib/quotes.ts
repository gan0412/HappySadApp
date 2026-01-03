export const happyQuotes = [
  "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
  "The purpose of our lives is to be happy. - Dalai Lama",
  "Happiness is when what you think, what you say, and what you do are in harmony. - Mahatma Gandhi",
  "The most important thing is to enjoy your life—to be happy—it's all that matters. - Audrey Hepburn",
  "Happiness is not by chance, but by choice. - Jim Rohn",
  "For every minute you are angry you lose sixty seconds of happiness. - Ralph Waldo Emerson",
  "Happiness is a warm puppy. - Charles M. Schulz",
  "Count your age by friends, not years. Count your life by smiles, not tears. - John Lennon",
  "The happiest people don't have the best of everything, they just make the best of everything. - Anonymous",
  "Happiness held is the seed; happiness shared is the flower. - John Harrigan",
];

export const sadQuotes = [
  "Tears come from the heart and not from the brain. - Leonardo da Vinci",
  "Every human walks around with a certain kind of sadness. They may not wear it on their sleeves, but it's there if you look deep. - Taraji P. Henson",
  "Sadness flies away on the wings of time. - Jean de La Fontaine",
  "The word 'happy' would lose its meaning if it were not balanced by sadness. - Carl Jung",
  "Sadness is but a wall between two gardens. - Khalil Gibran",
  "We must understand that sadness is an ocean, and sometimes we drown, while other days we are forced to swim. - R.M. Drake",
  "Experiencing sadness and anger can make you feel more creative, and by being creative, you can get beyond your pain or negativity. - Yoko Ono",
  "The good times of today are the sad thoughts of tomorrow. - Bob Marley",
  "One must not let oneself be overwhelmed by sadness. - Jackie Kennedy",
  "Sadness is also a kind of defense. - Ivo Andric",
];

export function getRandomHappyQuote(): string {
  return happyQuotes[Math.floor(Math.random() * happyQuotes.length)];
}

export function getRandomSadQuote(): string {
  return sadQuotes[Math.floor(Math.random() * sadQuotes.length)];
}
