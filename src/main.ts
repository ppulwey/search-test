import Alpine from "alpinejs";
import "./style.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ISuggest {
  frequentSearches: string[];
  suggestions: string[];
}

interface ISearchStore {
  focused: boolean;
  searchTerm: string;
  logs: string;
  suggestions: string[];
  filterSuggestions: string[];
  frequentSearches: string[];
  showFrequentSearches: boolean;
  showSuggestions: boolean;
  log: (message: string) => void;
  init: () => void;
  filterTerms(e: Event): void;
  focusSearchField(): void;
  unfocusSearchField(): void;
}

const searchStore: ISearchStore = {
  async init() {
    this.log("Initializing...");
    const response = await fetch(`${apiUrl}/terms`);
    const searchTermResult = (await response.json()) as ISuggest;

    const { frequentSearches, suggestions } = searchTermResult;
    this.suggestions = suggestions;
    this.filterSuggestions = suggestions;
    this.frequentSearches = frequentSearches;

    this.log(`Search terms loaded`);
  },
  focused: false,
  showFrequentSearches: false,
  showSuggestions: false,
  searchTerm: "",
  suggestions: [],
  filterSuggestions: [],
  frequentSearches: [],
  logs: "",
  log(message) {
    this.logs = `[${new Date().toLocaleTimeString()}] - ${message}\n${
      this.logs
    }`;
  },
  filterTerms(e: Event) {
    this.searchTerm = (e.target as HTMLInputElement).value.trim();

    
    if (this.searchTerm === "") {
      this.log('Clearing search');
      this.showFrequentSearches = true;
      this.showSuggestions = false;
      return;
    }

    this.log(`Searching for ${this.searchTerm}`);

    if (this.searchTerm.length < 3) {
      this.showFrequentSearches = false;
      this.showSuggestions = false;
      return;
    }

    this.filterSuggestions = this.suggestions
      .filter((term) =>
        term.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .slice(0, 5);

    this.showFrequentSearches = false;
    this.showSuggestions = true;
  },
  focusSearchField() {
    this.log("Search field got focus");
    if (this.searchTerm === "") {
      this.showFrequentSearches = true;
      this.showSuggestions = false;
    } else if (this.searchTerm.length > 2) {
      this.showFrequentSearches = false;
      this.showSuggestions = true;
    }
  },
  unfocusSearchField() {
    this.log("Search field lost focus");
    this.showFrequentSearches = false;
    this.showSuggestions = false;
  },
};

window.Alpine = Alpine;

Alpine.store("search", searchStore);

Alpine.start();
