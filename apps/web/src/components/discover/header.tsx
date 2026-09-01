import { Search } from "lucide-react";
import { useState } from "react";

const discoverTabs = ["All", "Clubs", "Events", "Posts"];

const discoverCategories = [
  "Technology",
  "Art",
  "Sports",
  "Career",
  "Science",
  "Social Responsibility",
];

export default function DiscoverHeader() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategory, setActiveCategory] = useState("Art");

  return (
    <header className="w-full shrink-0 border-t border-border/60 bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-[46rem]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-foreground"
            aria-hidden="true"
          />

          <label htmlFor="discover-search" className="sr-only">
            Search Discover
          </label>

          <input
            id="discover-search"
            type="search"
            placeholder="Search for clubs, events, or posts..."
            className="h-13 w-full rounded-lg border border-border bg-transparent pl-12 pr-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <nav
          className="mt-6 flex gap-6 overflow-x-auto border-b border-border sm:mt-7 sm:gap-8"
          aria-label="Discover content types"
        >
          {discoverTabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-b-2 px-2 pb-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground hover:text-primary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab}
              </button>
            );
          })}
        </nav>

        <div
          className="mt-7 flex flex-wrap gap-2"
          aria-label="Discover categories"
        >
          {discoverCategories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-foreground hover:border-primary/60 hover:text-primary"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
