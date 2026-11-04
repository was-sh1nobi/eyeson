// Maps portfolio showcase card categories to their service landing pages.
const CATEGORY_LINKS: Record<string, string> = {
  "lottie animation": "/animation",
  "ui animation": "/uiux",
  "branded motion": "/branding",
};

// Falls back to the animation page so any unknown category stays clickable.
export const getCategoryHref = (category: string): string =>
  CATEGORY_LINKS[category.trim().toLowerCase()] ?? "/animation";
