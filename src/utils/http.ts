import { setProgress, setUser } from "@/lib/valtio";
import axios, { isAxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
// import { sleep } from "./util";

interface Config extends AxiosRequestConfig {
	token?: string;
	successMessage?: string;
	errorMessage?: string;
	d2?: boolean;
}

const defaultConfig: Config = {
	method: "get",
	errorMessage: "missing data",
	d2: false,
};

export const http = async <T>(url: string, config: Config = {}): Promise<T> => {
	const { token, data, ...rest } = config;
	const myConfig = {
		url: url,
		...defaultConfig,
		headers: {
			Authorization: token ? `Bearer ${token}` : undefined,
			"Content-Type": data ? "application/json" : undefined,
		},
		data,
		...rest,
	};

	try {
		setProgress(true);
		// await sleep(5000);
		const resp = await axios(myConfig);
		if (myConfig.successMessage) {
			toast.success(myConfig.successMessage);
		}
		if (myConfig.d2) {
			return resp?.data?.data;
		} else {
			return resp?.data;
		}
	} catch (err) {
		if (isAxiosError(err) && err.response?.data?.error) {
			if (err.response.status === 401) {
				setUser(undefined);
			}
			toast.error(err.response?.data?.error);
		} else {
			if (myConfig.errorMessage) {
				toast.error(myConfig.errorMessage);
			}
		}

		return Promise.reject(err);
	} finally {
		setProgress(false);
	}
};
