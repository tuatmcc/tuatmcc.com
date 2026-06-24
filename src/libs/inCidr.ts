export function inCidr(ip: string, cidr: string): boolean {
  if (ip.includes(":")) return false; // IPv6は今回は対象外（必要なら拡張してね）
  const [netStr, maskStr] = cidr.split("/");
  const ipNum = ipv4ToInt(ip);
  const netNum = ipv4ToInt(netStr || "");
  const maskBits = Number(maskStr);
  if (
    ipNum === null ||
    netNum === null ||
    !Number.isInteger(maskBits) ||
    maskBits < 0 ||
    maskBits > 32
  )
    return false;

  const mask = maskBits === 0 ? 0 : (~0 << (32 - maskBits)) >>> 0;
  return (ipNum & mask) === (netNum & mask);
}

export function inCidrAny(ip: string, cidrList: string): boolean {
	const cidrs = cidrList.split(/[,\s]+/).filter((c) => c.length > 0);
	if (cidrs.length === 0) return false;
	return cidrs.some((cidr) => inCidr(ip, cidr));
}

function ipv4ToInt(ip: string): number | null {
  const m = ip.trim().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m || m.length !== 5) return null;
  const [a, b, c, d] = m.slice(1).map(Number);
  if ((!a && a !== 0) || (!b && b !== 0) || (!c && c !== 0) || (!d && d !== 0))
    return null;
  if ([a, b, c, d].some((n) => !Number.isInteger(n) || n < 0 || n > 255))
    return null;
  // Use multiplication instead of bit shifting to avoid signed integer issues
  return (a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d) >>> 0;
}
