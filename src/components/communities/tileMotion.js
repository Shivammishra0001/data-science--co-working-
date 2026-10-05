// Entry motion shared by the community logo tiles.
const ease = [0.16, 1, 0.3, 1]

export const tileIn = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease } },
}
