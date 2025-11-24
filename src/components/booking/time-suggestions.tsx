'use client';

import { useEffect, useState } from 'react';
import { Loader2, Lightbulb } from 'lucide-react';
import { getIntelligentSuggestions } from '@/lib/actions';
import type { SuggestOptimalTimesInput, SuggestOptimalTimesOutput } from '@/ai/flows/intelligent-schedule-suggestions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeSuggestionsProps {
  input: SuggestOptimalTimesInput;
  onSelectTime: (time: string) => void;
  selectedTime?: string;
}

export function TimeSuggestions({ input, onSelectTime, selectedTime }: TimeSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestOptimalTimesOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      setLoading(true);
      setError(null);
      const result = await getIntelligentSuggestions(input);
      if (result.success && result.data) {
        setSuggestions(result.data);
      } else {
        setError(result.error || 'An unexpected error occurred.');
      }
      setLoading(false);
    }
    fetchSuggestions();
  }, [input]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Finding the best times for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!suggestions || suggestions.suggestedTimes.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Suggestions</AlertTitle>
        <AlertDescription>
          We couldn't find any optimal times based on your request. Please try a different day or time preference.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="bg-primary/5 border-primary/20">
        <Lightbulb className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">AI-Powered Suggestions</AlertTitle>
        <AlertDescription className="text-primary/80">
          {suggestions.reasoning}
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {suggestions.suggestedTimes.map((time) => (
          <Button
            key={time}
            variant={selectedTime === time ? 'default' : 'outline'}
            className={cn("text-base justify-center py-6 rounded-lg", selectedTime === time && "shadow-lg")}
            onClick={() => onSelectTime(time)}
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
}
