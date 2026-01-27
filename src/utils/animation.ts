export class ySmoothAnimation {
  private previous: number = 0;
  private current: number = 0;
  private amt: number;

  constructor(amt: number = 0.15) {
    this.amt = amt;
  }

  lerp(a: number, b: number, n: number): number {
    return (1 - n) * a + n * b;
  }

  update(y: number): number {
    this.current = y;
    this.previous = this.lerp(this.previous, this.current, this.amt);
    return this.previous;
  }

  setSmoothness(amt: number): void {
    this.amt = amt;
  }

  getCurrent(): number {
    return this.current;
  }

  getPrevious(): number {
    return this.previous;
  }
}
