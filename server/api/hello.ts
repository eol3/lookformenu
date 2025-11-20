export default defineEventHandler((event) => {
  const sum = useSum(1, 2) // auto-imported
  return { sum }
})