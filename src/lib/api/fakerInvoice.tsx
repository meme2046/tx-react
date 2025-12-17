import type { IFakerInvoice } from "@/types";
import { http, sleep } from "@/utils";

async function loaderDelayFn<T>(
	fn: (...args: Array<unknown>) => Promise<T> | T,
) {
	await sleep(1000);
	const res = await fn();

	return res;
}

let invoices: Array<IFakerInvoice> = null!;

let invoicesPromise: Promise<void> | undefined = undefined;

const ensureInvoices = async () => {
	if (!invoicesPromise) {
		invoicesPromise = Promise.resolve().then(async () => {
			const data = await http<IFakerInvoice[]>(
				"https://jsonplaceholder.typicode.com/posts",
				// { successMessage: "Invoices loaded" }
			);
			invoices = data.slice(0, 10);
		});
	}

	await invoicesPromise;
};

export async function fetchInvoices() {
	return loaderDelayFn(() => ensureInvoices().then(() => invoices));
}

export async function fetchInvoiceById(id: number) {
	return loaderDelayFn(() =>
		ensureInvoices().then(() => {
			const invoice = invoices.find((d) => d.id === id);
			if (!invoice) {
				throw new Error("Invoice not found");
			}
			return invoice;
		}),
	);
}
