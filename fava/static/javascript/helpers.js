import { favaAPI } from "./stores";

// Select a single element.
export function $(expr, con = document) {
  return con.querySelector(expr);
}
export const select = $;

// Select multiple elements (and convert NodeList to Array).
export function $$(expr, con = document) {
  return Array.from(con.querySelectorAll(expr));
}
export const selectAll = $$;

let translations;
/*
 * Translate the given string.
 */
export function _(string) {
  if (translations === undefined) {
    translations = JSON.parse($("#translations").innerHTML);
  }
  return translations[string] || string;
}

// Execute the callback of the event of given type is fired on something
// matching selector.
export function delegate(element, type, selector, callback) {
  if (!element) return;
  element.addEventListener(type, event => {
    const closest = event.target.closest(selector);
    if (closest) {
      callback(event, closest);
    }
  });
}

// Bind an event to element, only run the callback once.
export function once(element, event, callback) {
  function runOnce(...args) {
    element.removeEventListener(event, runOnce);
    callback.apply(element, args);
  }

  element.addEventListener(event, runOnce);
}

export function ready() {
  return new Promise(resolve => {
    if (document.readyState !== "loading") {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", resolve);
    }
  });
}

// Handles JSON content for a Promise returned by fetch, also handling an HTTP
// error status.
export function handleJSON(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.json().then(data => {
    if (!data.success) {
      return Promise.reject(data.error);
    }
    return data;
  });
}

// Handles text content for a Promise returned by fetch, also handling an HTTP
// error status.
export function handleText(response) {
  if (!response.ok) {
    return Promise.reject(response.statusText);
  }
  return response.text();
}

export function fetch(input, init = {}) {
  const defaults = {
    credentials: "same-origin",
  };
  return window.fetch(input, Object.assign(defaults, init));
}

/**
 * Fetch an API endpoint and convert the JSON data to an object.
 * @param endpoint - the endpoint to fetch
 * @param params - a string to append as params or an object.
 */
export function fetchAPI(endpoint, params = null) {
  let url = `${favaAPI.baseURL}api/${endpoint}/`;
  if (params) {
    if (typeof params === "string") {
      url += `?${params}`;
    } else {
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        urlParams.set(key, value);
      });
      url += `?${urlParams.toString()}`;
    }
  }
  return fetch(url)
    .then(handleJSON)
    .then(responseData => responseData.data);
}

// Fuzzy match a pattern against a string.
//
// Returns true if all characters of `pattern` can be found in order in
// `string`. For lowercase characters in `pattern` match both lower and upper
// case, for uppercase only an exact match counts.
export function fuzzytest(pattern, string) {
  let pindex = 0;
  for (let index = 0; index < string.length; index += 1) {
    const char = string[index];
    const search = pattern[pindex];
    if (char === search || char.toLowerCase() === search) {
      pindex += 1;
    }
  }
  return pindex === pattern.length;
}

// Wrap fuzzy matched characters.
//
// Wrap all occurences of characters of `pattern` (in order) in `string` in
// <span> tags.
export function fuzzywrap(pattern, string) {
  let pindex = 0;
  const result = [];
  for (let index = 0; index < string.length; index += 1) {
    const char = string[index];
    const search = pattern[pindex];
    if (char === search || char.toLowerCase() === search) {
      result.push(`<span>${char}</span>`);
      pindex += 1;
    } else {
      result.push(char);
    }
  }
  return result.join("");
}
