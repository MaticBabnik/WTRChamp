export function remap(value: number, low1: number, high1: number, low2: number, high2: number): number {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

export function clamp(min: number, value: number, max: number) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export type Point = [number, number];
export interface Rect {
    w: number;
    h: number;
    x: number;
    y: number;
}

export function factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) throw `factorial(${n}) is not defined`;
    if (n == 0) return 1;
    for (let i = n - 1; i > 1; i--)
        n *= i;
    return n;
}

export function binomialCoefficent(n: number, k: number): number {
    return factorial(n) / (factorial(k) * factorial(n - k));
}

export function bezierPoint(controlPoints: Point[], f: number): Point {
    const n = controlPoints.length - 1;
    if (n < 2) throw "Not enough control points";
    if (f <= 0) return controlPoints[0];
    if (f >= 1) return controlPoints.at(-1) as Point;
    let x = 0, y = 0;

    for (let i = 0; i <= n; i++) {
        const k = binomialCoefficent(n, i) * Math.pow(1.0 - f, n - i) * Math.pow(f, i);
        x += k * controlPoints[i][0];
        y += k * controlPoints[i][1];
    }

    return [x, y];
}

export function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}