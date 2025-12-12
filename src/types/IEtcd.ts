interface IEtcdMetadata {
	version: number;
	create_revision: number;
	mod_revision: number;
}

export interface IEtcd {
	key: string;
	value: string;
	metadata: IEtcdMetadata;
}
