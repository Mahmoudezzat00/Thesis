export function getEmailBaseUrl(fallbackUrl?: string) {
  const baseUrl =
    process.env.EMAIL_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    fallbackUrl ||
    ''

  return baseUrl.replace(/\/$/, '')
}

export function getEmailUrl(pathOrUrl: string, fallbackUrl?: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl

  const baseUrl = getEmailBaseUrl(fallbackUrl)
  if (!baseUrl) return pathOrUrl

  return pathOrUrl.startsWith('/')
    ? `${baseUrl}${pathOrUrl}`
    : `${baseUrl}/${pathOrUrl}`
}

export function getEmailImageUrl(pathOrUrl: string, fallbackUrl?: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl

  const imageBaseUrl = process.env.EMAIL_IMAGE_BASE_URL?.replace(/\/$/, '')
  if (imageBaseUrl) {
    return pathOrUrl.startsWith('/')
      ? `${imageBaseUrl}${pathOrUrl}`
      : `${imageBaseUrl}/${pathOrUrl}`
  }

  return getEmailUrl(pathOrUrl, fallbackUrl)
}
