export interface Gushitong<T> {
  success: boolean;
  data?: RedisData<T>;
  error?: string;
}

interface RedisData<T> {
  data: T;
  timestamp: number;
}

export interface BannerResult {
  list: BannerItem[];
  tabs: BannerTab[];
  curtab: string;
}

interface BannerTab {
  text: string;
  market: string;
}

export interface BannerItem {
  p: string;
  lastPrice: string;
  status: string;
  ratio: string;
  increase: string;
  code: string;
  name: string;
  market: string;
  financeType: string;
  exchange: string;
  subType: string;
  timestamp?: number;
}

export interface OpenData {
  minute_data: Minutedata;
  finance_type: string;
  name: string;
  code: string;
  marketName: string;
  tag_list: Taglist[];
  timestamp: number;
}

interface Taglist {
  desc: string;
  imageUrl: string;
}

interface Minutedata {
  cur: Cur;
  basicinfos: Basicinfos;
}

interface Basicinfos {
  code: string;
  exchange: string;
  logo: string;
  logoType: string;
  name: string;
  status: string;
  trade_status: string;
}

interface Cur {
  amount: string;
  avgPrice: string;
  increase: string;
  price: string;
  ratio: string;
  show: string;
  time: string;
  timeKey: string;
  volume: string;
}
