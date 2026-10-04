export function runArrayPipeline(input: string) {
  const values: unknown = JSON.parse(input);
  if (!Array.isArray(values) || values.length < 1 || values.length > 30 ||
      !values.every(n => typeof n === "number" && Number.isInteger(n) && n >= -10000 && n <= 10000)) {
    throw new Error("-10000~10000 정수를 1~30개 JSON 배열로 입력하세요.");
  }
  const numbers = values as number[];
  return {
    original: numbers,
    lexicalSorted: [...numbers].sort(),
    numericSorted: [...numbers].sort((a, b) => a - b),
    doubled: numbers.map(n => n * 2),
    evens: numbers.filter(n => n % 2 === 0),
    sum: numbers.reduce((total, n) => total + n, 0),
  };
}
