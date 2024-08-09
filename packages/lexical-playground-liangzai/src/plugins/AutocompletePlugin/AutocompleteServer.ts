import { SearchPromise } from ".";
import { DICTIONARY } from "./mock";

/*
 * Simulate an asynchronous autocomplete server (typical in more common use cases like GMail where
 * the data is not static).
 */
export class AutocompleteServer {
  DATABASE = DICTIONARY;
  LATENCY = 200;

  query = (searchText: string): SearchPromise => {
    let isDismissed = false;

    const dismiss = () => {
      isDismissed = true;
    };
    const promise: Promise<null | string> = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (isDismissed) {
          // TODO cache result
          return reject('Dismissed');
        }
        const searchTextLength = searchText.length;
        if (searchText === '' || searchTextLength < 4) {
          return resolve(null);
        }
        const char0 = searchText.charCodeAt(0);
        const isCapitalized = char0 >= 65 && char0 <= 90;
        const caseInsensitiveSearchText = isCapitalized
          ? String.fromCharCode(char0 + 32) + searchText.substring(1)
          : searchText;
        const match = this.DATABASE.find(
          (dictionaryWord) =>
            dictionaryWord.startsWith(caseInsensitiveSearchText) ?? null,
        );
        if (match === undefined) {
          return resolve(null);
        }
        const matchCapitalized = isCapitalized
          ? String.fromCharCode(match.charCodeAt(0) - 32) + match.substring(1)
          : match;
        const autocompleteChunk = matchCapitalized.substring(searchTextLength);
        if (autocompleteChunk === '') {
          return resolve(null);
        }
        return resolve(autocompleteChunk);
      }, this.LATENCY);
    });

    return {
      dismiss,
      promise,
    };
  };
}

