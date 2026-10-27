// Returns an error message, or null if the title is valid.
export function validateTitle(title) {
  if (typeof title !== 'string' || title.trim() === '') return 'Task title cannot be empty.'
  if (title.trim().length > 200) return 'Task title must be 200 characters or fewer.'
  return null
}
