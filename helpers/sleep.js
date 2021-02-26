

/**
 * !helper function to delay loop in ms
 * @param {*} ms 
 */


module.exports = async function sleep(ms) {

  return new Promise(resolve => setTimeout(resolve, ms));

}