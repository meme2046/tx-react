export interface IArweave {
	transactions: IArweaveTransaction;
}

interface IArweaveTransaction {
	edges: IArweaveEdge[];
}

export interface IArweaveEdge {
	cursor: string;
	node: IArweaveNode;
}

export interface IArweaveNode {
	id: string;
	owner: {
		address: string;
	};
	data: {
		size: string;
	};
	block: {
		height: number;
		timestamp: number;
	};
	tags: {
		name: string;
		value: string;
	}[];
}

export interface IArweavePost {
	txid: string;
	owner: string;
	length: number;
	height: number;
	timestamp: number;
	tags: {
		name: string;
		value: string;
	}[];
	ipfsUrl: string;
	contentType: string;
	ipfsHash: string;
	url: string;
	cursor: string;
}

export interface IArweaveData {
	id: string;
	nodeId: string;
}
