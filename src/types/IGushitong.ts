export interface GetBanner {
	QueryID: string;
	ResultCode: string;
	Result: GetBannerResult;
}

interface GetBannerResult {
	list: GetBannerItem[];
	tabs: GetBannerTab[];
	curtab: string;
}

interface GetBannerTab {
	text: string;
	market: string;
}

export interface GetBannerItem {
	p: string;
	lastPrice: string;
	status: string;
	ratio: string;
	increase: string;
	code: string;
	name: string;
	market: string;
	logo: GetBannerLogo;
	financeType: string;
	exchange: string;
	subType: string;
}

interface GetBannerLogo {
	logo: string;
	type: string;
}
