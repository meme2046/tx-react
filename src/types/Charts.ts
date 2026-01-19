export interface BreakItem {
  /** 断点开始时间 */
  start: number;
  /** 断点结束时间 */
  end: number;
  /** 断点-gap（时间间隔） */
  gap: number; //gap 核心：控制断点区域的视觉空白间隙（单位：像素）,gap: 0：断点无额外空白，前后视觉紧密衔接，简洁展示数据中断
}
export interface MarketData {
  timestamp: number;
  time: string;
  price: number;
  avgPrice?: number;
  range: string;
  ratio: string;
  volume: number;
  amount: string;
  totalVolume?: string;
  totalAmount?: string;
  value: [number, number];
}
// 价格信息接口
export interface VolPxItem {
  /** 成交额（格式化字符串，如 "2891.39万"） */
  amount: string;
  /** 平均价格（字符串格式，如 "1032.64"） */
  avgPrice: number;
  /** 日期时间（字符串格式，如 "01-16 21:00"） */
  datetime: string;
  /** 涨跌额（字符串格式，如 "-0.36"） */
  increase: number;
  /** 原始成交额（字符串格式，如 "28913920"） */
  oriAmount: number;
  /** 价格（字符串格式，如 "1032.64"） */
  price: number;
  /** 涨跌幅（字符串格式，如 "-0.03%"） */
  ratio: string;
  /** 是否显示（字符串格式，如 "1"） */
  show: string;
  /** 时间戳（字符串格式，如 "1768568400"） */
  time: number;
  /** 时间键（字符串格式，如 "0"） */
  timeKey: string;
  /** 总成交额（字符串格式，如 "28913920"） */
  totalAmount: number;
  /** 总成交量（字符串格式，如 "28"） */
  totalVolume: number;
  /** 成交量（字符串格式，如 "28"） */
  volume: number;
  value: [number, number];
}
