import axios from 'axios';

const API_KEY = 'bGQxvVa3nMcCBo770QLYqqszXmudk6uE&q';

export function loadSearchResults(query, limit, offset) {
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}=${encodeURIComponent(
    query
  )}&limit=${limit}&offset=${offset}&rating=G&lang=en`;
  return axios.get(url);
}
