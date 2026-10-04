// 가장 긴 경로를 기준으로 방향과 높이를 고정해 경로 전환 시 본문이 뛰지 않게 합니다.
export function getFlowLayout(width: number, maxSteps: number, orientation: "horizontal" | "vertical") {
  const requiredWidth = Math.max(680, maxSteps * 200 + Math.max(0, maxSteps - 1) * 40 + 40);
  const horizontal = orientation === "horizontal" && maxSteps >= 2 && maxSteps <= 5 && width >= requiredWidth;
  return {
    columns: horizontal ? maxSteps : 1,
    columnGap: 240,
    height: horizontal ? 340 : Math.max(340, maxSteps * 180),
    fitPadding: horizontal ? 0.04 : 0.16,
  };
}
