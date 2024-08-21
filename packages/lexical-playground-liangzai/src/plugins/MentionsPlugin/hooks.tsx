import { useEffect, useState } from 'react';
import { dummyLookupService } from './service';

const mentionsCache = new Map();

export function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<Array<string>>([]);

  useEffect(() => {
    if (mentionString == null) {
      setResults([]);
      return;
    }

    const cachedResults = mentionsCache.get(mentionString);
    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    dummyLookupService.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults);
      setResults(newResults);
    });
  }, [mentionString]);

  return results;
}
