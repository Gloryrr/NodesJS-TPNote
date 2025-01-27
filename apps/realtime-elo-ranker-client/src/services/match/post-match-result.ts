import { MatchResult } from "@realtime-elo-ranker/libs/ui";

const URL = "/post/match";

/**
 * Post the result of a match.
 * 
 * @param {string} baseUrl The base URL of the API
 * @param {string} adversaryA The ID of the first adversary
 * @param {string} adversaryB The ID of the second adversary
 * @param {MatchResult} result The result of the match
 */
export default function postMatchResult(baseUrl: string, adversaryA: string, adversaryB: string, result: MatchResult): Promise<Response> {
  console.log(`Posting match result: adversaryA=${adversaryA}, adversaryB=${adversaryB}, result=${result}`);
  return fetch(baseUrl + URL, {
    method: "POST",
    body: JSON.stringify({
      adversaryA: adversaryA,
      adversaryB: adversaryB,
      winner: result === MatchResult.LEFT_WIN ? adversaryA : result === MatchResult.RIGHT_WIN ? adversaryB : null,
      draw: result === MatchResult.DRAW ? true : false,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}