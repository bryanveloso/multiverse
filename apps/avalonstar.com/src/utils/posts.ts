export const formatPostUrl = (postId: string) => {
  const [date, ...idParts] = postId.split('-')
  const year = date.substring(0, 4)
  const cleanId = idParts.slice(2).join('-')
  return `${year}/${cleanId}`
}
