/**
 * 이메일 체크
 * @param {string} email 이메일
 */
function validateEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email.toLowerCase());
}

/**
 * 사용자 이름 체크
 * 알파벳과 숫자만 허용한다.
 * @param {string} username 사용자이름
 */
function validateUsername(username) {
  const regex = /^[A-Za-z0-9]+$/;
  return regex.test(username);
}

module.exports = {
  validateEmail,
  validateUsername
};