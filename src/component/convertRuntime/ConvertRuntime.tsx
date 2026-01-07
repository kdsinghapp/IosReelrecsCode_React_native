export const convertRuntime = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h${mins}min`;
};

// Example
// const runtime = 141;
// console.log(convertRuntime(runtime)); // "2h 21min"

