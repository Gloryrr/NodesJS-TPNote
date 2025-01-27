import eventEmitter from '../eventEmitter';

const URL = "/post/player";

/**
 * Post a player to create it.
 * 
 * @param {string} baseUrl The base URL of the API
 * @param {string} id The ID of the new player
 */
export default function postPlayer(baseUrl: string, id: string): Promise<Response> {
  console.log(`Posting player with ID: ${id} to ${baseUrl + URL}`);
  return fetch(baseUrl + URL, {
    method: "POST",
    body: JSON.stringify({
      id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => {
    if (response.ok) {
      eventEmitter.emit('playerPosted', id);
    }
    return response;
  });
}