import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzeText, AnalysisResult } from '@/lib/nlp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Sparkles, FileText, Hash, Key, TrendingUp, Smile, Meh, Frown } from 'lucide-react';

const CHART_COLORS = [
  'hsl(199, 89%, 48%)',
  'hsl(199, 89%, 55%)',
  'hsl(199, 89%, 62%)',
  'hsl(168, 76%, 42%)',
  'hsl(168, 76%, 50%)',
  'hsl(168, 76%, 58%)',
  'hsl(199, 70%, 65%)',
  'hsl(168, 60%, 62%)',
  'hsl(199, 60%, 70%)',
  'hsl(168, 50%, 68%)',
];

export function TextAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    // Small delay for visual feedback
    setTimeout(() => {
      const analysis = analyzeText(inputText);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 300);
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return <Smile className="w-5 h-5" />;
      case 'Negative': return <Frown className="w-5 h-5" />;
      default: return <Meh className="w-5 h-5" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'bg-success text-success-foreground';
      case 'Negative': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-warning text-warning-foreground';
    }
  };

  const chartData = result?.wordFrequency.slice(0, 10).map(item => ({
    name: item.word.length > 8 ? item.word.slice(0, 8) + '...' : item.word,
    fullName: item.word,
    count: item.count,
  })) || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Input Section */}
      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <FileText className="w-5 h-5 text-primary" />
            Paste your text here
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter or paste your English text here for analysis..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] resize-y font-sans text-base leading-relaxed"
          />
          <Button 
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isAnalyzing}
            size="lg"
            className="w-full sm:w-auto gap-2 font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Hash className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{result.totalWordCount}</p>
                    <p className="text-sm text-muted-foreground">Total Words</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Key className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{result.uniqueWordCount}</p>
                    <p className="text-sm text-muted-foreground">Unique Words</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{result.topKeywords.length}</p>
                    <p className="text-sm text-muted-foreground">Top Keywords</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getSentimentColor(result.sentiment)}`}>
                    {getSentimentIcon(result.sentiment)}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{result.sentiment}</p>
                    <p className="text-sm text-muted-foreground">Sentiment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cleaned Text */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Cleaned Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg font-mono text-sm leading-relaxed max-h-[200px] overflow-y-auto">
                {result.cleanedText || <span className="text-muted-foreground italic">No meaningful words found after cleaning.</span>}
              </div>
            </CardContent>
          </Card>

          {/* Top Keywords */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Top 10 Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.topKeywords.length > 0 ? (
                  result.topKeywords.map((keyword, index) => (
                    <Badge 
                      key={keyword} 
                      variant="secondary"
                      className="px-3 py-1.5 text-sm font-medium"
                    >
                      {index + 1}. {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No keywords found.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          {chartData.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Word Frequency Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        allowDecimals={false}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                                <p className="font-semibold">{data.fullName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Count: <span className="font-medium text-foreground">{data.count}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Word Frequency Table */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Word Frequency Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto rounded-lg border border-border">
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold">Rank</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold">Word</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.wordFrequency.length > 0 ? (
                      result.wordFrequency.map((item, index) => (
                        <tr key={item.word} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-muted-foreground">{index + 1}</td>
                          <td className="px-4 py-2.5 text-sm font-medium font-mono">{item.word}</td>
                          <td className="px-4 py-2.5 text-sm text-right font-semibold">{item.count}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground italic">
                          No words to display.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
