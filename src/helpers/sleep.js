/**
 * !helper function to delay loop in ms
 * @param {*} ms 
 */

export default async function sleep(ms) {

  return new Promise(resolve => setTimeout(resolve, ms));

}