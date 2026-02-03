// English stopwords list
const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
  'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
  'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
  'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
  'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
  'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 
  'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 
  'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 
  'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 
  'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn'
]);

// Sentiment word lists
const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome',
  'love', 'happy', 'joy', 'beautiful', 'best', 'brilliant', 'perfect', 'lovely',
  'nice', 'positive', 'success', 'successful', 'win', 'winner', 'winning',
  'like', 'enjoy', 'enjoyed', 'pleasant', 'pleased', 'delighted', 'glad',
  'impressive', 'incredible', 'outstanding', 'superb', 'terrific', 'marvelous',
  'magnificent', 'exceptional', 'favorable', 'fortunate', 'grateful', 'thankful',
  'blessed', 'cheerful', 'content', 'excited', 'enthusiastic', 'hopeful',
  'optimistic', 'proud', 'satisfied', 'thrilled', 'wonderful', 'admire',
  'appreciate', 'celebrate', 'cherish', 'comfortable', 'confident', 'creative',
  'elegant', 'fabulous', 'friendly', 'generous', 'gentle', 'graceful', 'honest',
  'innovative', 'inspiring', 'kind', 'peaceful', 'powerful', 'reliable', 'remarkable'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'hate', 'sad',
  'angry', 'ugly', 'fail', 'failure', 'failed', 'wrong', 'negative', 'problem',
  'disappointed', 'disappointing', 'frustrating', 'frustrated', 'annoying',
  'annoyed', 'upset', 'unhappy', 'unfortunate', 'painful', 'pain', 'hurt',
  'boring', 'dull', 'difficult', 'hard', 'impossible', 'terrible', 'disaster',
  'disastrous', 'tragic', 'tragedy', 'miserable', 'depressed', 'depressing',
  'hopeless', 'helpless', 'worthless', 'useless', 'broken', 'damage', 'damaged',
  'destroy', 'destroyed', 'evil', 'fear', 'fearful', 'frightening', 'guilty',
  'harmful', 'harsh', 'hostile', 'ignorant', 'inferior', 'jealous', 'lazy',
  'lonely', 'mad', 'mean', 'nasty', 'nervous', 'offensive', 'pessimistic',
  'regret', 'reject', 'rejected', 'rude', 'scary', 'selfish', 'sick', 'sorry',
  'stressed', 'stupid', 'terrible', 'tired', 'troubled', 'unfair', 'violent', 'weak'
]);

export interface AnalysisResult {
  cleanedText: string;
  totalWordCount: number;
  uniqueWordCount: number;
  wordFrequency: { word: string; count: number }[];
  topKeywords: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  sentimentScore: number;
}

export function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\d+/g, '') // Remove numbers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export function tokenize(text: string): string[] {
  return text.split(/\s+/).filter(word => word.length > 0);
}

export function removeStopwords(words: string[]): string[] {
  return words.filter(word => !STOPWORDS.has(word) && word.length > 1);
}

export function getWordFrequency(words: string[]): Map<string, number> {
  const frequency = new Map<string, number>();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  return frequency;
}

export function analyzeSentiment(words: string[]): { sentiment: 'Positive' | 'Neutral' | 'Negative'; score: number } {
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (POSITIVE_WORDS.has(word)) positiveCount++;
    if (NEGATIVE_WORDS.has(word)) negativeCount++;
  });

  const score = positiveCount - negativeCount;
  
  if (score > 0) return { sentiment: 'Positive', score };
  if (score < 0) return { sentiment: 'Negative', score };
  return { sentiment: 'Neutral', score: 0 };
}

export function analyzeText(text: string): AnalysisResult {
  const cleanedText = cleanText(text);
  const tokens = tokenize(cleanedText);
  const filteredWords = removeStopwords(tokens);
  
  const frequency = getWordFrequency(filteredWords);
  const sortedFrequency = Array.from(frequency.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  const { sentiment, score } = analyzeSentiment(filteredWords);

  return {
    cleanedText: filteredWords.join(' '),
    totalWordCount: filteredWords.length,
    uniqueWordCount: frequency.size,
    wordFrequency: sortedFrequency,
    topKeywords: sortedFrequency.slice(0, 10).map(item => item.word),
    sentiment,
    sentimentScore: score,
  };
}
