export function getRandomColorName() {
  const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "cyan",
    "magenta",
    "lime",
    "teal",
    "indigo",
    "violet",
    "brown",
    "gray",
    "white",
    "maroon",
    "olive",
    "navy",
    "turquoise",
    "gold",
    "salmon",
    "coral",
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

export const urlHelper = {
  getBaseUrl: () => {
    return import.meta.env.VITE_DJANGO_URL;
  },
  getApiUrl: () => {
    return import.meta.env.VITE_API_URL;
  },
};
