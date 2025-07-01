import SHA1 from 'crypto-js/sha1';
import Base64 from 'crypto-js/enc-base64';

export function encodePassword(rawPassword: string): string | null {
  var hash = SHA1(rawPassword);
  return "{SHA}" + Base64.stringify(hash)
}