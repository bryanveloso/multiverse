/**
 * Calculate Bryan's age at a given date
 *
 * @param date The date to calculate age for (Date object or string)
 * @returns Age in years
 */
export function getAuthorAge(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const birthDate = new Date('1983-04-02')

  let age = dateObj.getFullYear() - birthDate.getFullYear()

  // Adjust if birthday hasn't occurred yet in the given year
  const m = dateObj.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && dateObj.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}
