export interface RedisResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RedisData<T> {
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

export interface SelfSelectItem {
  CNYPrice: string;
  amount: string;
  amplitudeRatio: string;
  capitalization: string;
  code: string;
  exchange: string;
  follow_status: string;
  holdingAmount: string;
  increase: string;
  logo?: { logo: string; type: string };
  market: string;
  name: string;
  pbRate: string;
  peRate: string;
  price: string;
  pv: string;
  ratio: string;
  sf_url: string;
  src_loc: string;
  status: string;
  stockStatus: string;
  stockStatusInfo: string;
  subType: string;
  turnoverRatio: string;
  type: string;
  volume: string;
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
