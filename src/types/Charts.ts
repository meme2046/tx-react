export interface BreakItem {
  start: number;
  end: number;
  gap: number; //gap 核心：控制断点区域的视觉空白间隙（单位：像素）,gap: 0：断点无额外空白，前后视觉紧密衔接，简洁展示数据中断
}

export interface ChartData {
  marketData: MarketData[];
  volData: number[][];
  breaks: BreakItem[];
  avgData?: number[][];
}

export interface MarketData {
  timestamp: number;
  time: string;
  price: number;
  avgPrice?: number;
  range: string;
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
  price?: string;
  increase?: string;
  ratio?: string;
  datetime?: string;
  code: string;
  exchange: string;
  logo: string;
  name: string;
  provider: string;
  tradeStatusCN?: string;
  tagList?: Taglist[];
}
