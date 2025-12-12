// 有效数字
export const effective = (src?: string): string =>
	src ? src.replace(/(\.\d*[1-9])0+$/, "$1").replace(/\.0+$/, "") : "N/A";

// 睡眠函数
// export const sleep = async (ms: number) =>
// 	new Promise((r) => {
// 		setTimeout(r, ms);
// 	});

export async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// 判断是否是数组
export function isArray(value: unknown) {
	return Array.isArray(value);
}

// 判断是否是对象
export function isObject(value: unknown) {
	const type = typeof value;
	return (
		value != null &&
		(type === "object" || type === "function") &&
		!isArray(value)
	);
}

// 获取对象的属性
export function getKeyValue(obj: object, key: string) {
	// if (!isObject(obj))
	//     return obj;
	// if (obj instanceof Array)
	//     return [...obj];
	return obj[key as keyof typeof obj];
}

// 重命名对象的属性
export function renameProp(
	oldProp: string,
	newProp: string,
	obj: Record<string, unknown>
) {
	// 从对象中提取旧属性的值，并将其重命名为新属性
	const { [oldProp]: old, ...others } = obj; // 使用 Record<string, unknown> 解决索引签名问题
	return {
		[newProp]: old, // 将旧属性的值赋给新属性
		...others, // 返回其他未更改的属性
	};
}

// 复制对象
export function copyObject(obj: object) {
	if (obj instanceof Array) return [...obj];
	return { ...obj };
}
// 删除对象的属性
export function omitObject(obj: Record<string, unknown>, omitKeys: string[]) {
	if (obj instanceof Array) return [...obj];
	const newObj = { ...obj };
	omitKeys.forEach((key) => newObj[key] && delete newObj[key]);
	return newObj;
}

// 清理对象
export function cleanObject(obj: Record<string, unknown>) {
	if (obj instanceof Array) return [...obj];
	const newObj = { ...obj };
	Object.keys(newObj).forEach((key) => {
		if (newObj[key] === void 0 || newObj[key] === null) {
			delete newObj[key];
		}
	});
	return newObj;
}
// 删除对象的属性
export function cleanObjectKeys(obj: object, keys = []) {
	if (obj instanceof Array) return [...obj];
	const newObj = { ...obj };
	keys.forEach((key) => {
		if (newObj[key]) {
			delete newObj[key];
		}
	});
	return newObj;
}

// 清理对象，删除未定义的属性
export function compact(object: Record<string, unknown>) {
	const clone = Object.assign({}, object);
	for (const key in clone) {
		if (clone[key] === void 0) delete clone[key];
	}
	return clone;
}

export function matchStr(
	source: string,
	pattern: RegExp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
): string {
	// 使用正则表达式匹配日期和时间的前16个字符
	const match = source.match(pattern);
	return match ? match[0] : "";
}
