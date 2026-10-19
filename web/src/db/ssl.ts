/**
 * Neon сатрро бо `sslmode=require` медиҳад. pg@8 онро ҳамчун `verify-full` (санҷиши пурраи сертификат)
 * истифода мебарад, вале дар pg@9 маънояш сусттар мешавад. Барои ҳифзи санҷиши пурра онро ошкоро менависем.
 */
export function withStrictSsl(url: string) {
  return url.replace(/sslmode=(require|prefer|verify-ca)\b/, "sslmode=verify-full");
}
