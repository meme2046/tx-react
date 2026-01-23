export interface BreakItem {
  start: number;
  end: number;
  gap: number; //gap 核心：控制断点区域的视觉空白间隙（单位：像素）,gap: 0：断点无额外空白，前后视觉紧密衔接，简洁展示数据中断
}

export interface ChartData {
  marketData: MarketData[];
  volData?: number[][];
  breaks: BreakItem[];
  avgData?: number[][];
}

export interface MarketData {
  timestamp: number;
  time: string;
  price: number;
  avgPrice?: number;
  range: number;
  ratio: string;
  volume: number;
  amount: number;
  totalVolume?: string;
  totalAmount?: string;
  value: [number, number];
}

export interface Taglist {
  desc: string;
  imageUrl: string;
}

export interface BasicInfo {
  timestamp?: number;
  tradeStatus?: string;
  time?: number;
  price?: number;
  increase?: string;
  ratio?: string;
  volume?: number;
  datetime?: string;
  code: string;
  exchange: string;
  logo: string;
  name: string;
  provider: string;
  tradeStatusCN?: string;
  tagList?: Taglist[];
}

export interface UiKline {
  start: number; // k线开盘时间
  open: number; // 开盘价
  highest: number; // 最高价
  lowest: number; // 最低价
  mean: number; // 均价
  close: number; // 收盘价(当前K线未结束的即为最新价)
  volume: number; // 成交量
  end: number; // k线收盘时间
  amount: number; // 成交额
  trades: number; // 成交笔数
  buyVolume: string; // 主动买入成交量
  buyAmount: string; // 主动买入成交额
  trend: "up" | "down"; // 趋势
  // 技术指标
  sma7?: number | null; // 7日均线
  sma25?: number | null; // 25日均线
  ema12?: number | null; // 12日指数均线
  ema26?: number | null; // 26日指数均线
}
