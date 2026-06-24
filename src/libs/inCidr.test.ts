import { describe, expect, test } from "bun:test";
import { inCidr, inCidrAny } from "./inCidr";

describe("inCidr", () => {
	test("matches an IP inside a single /24", () => {
		expect(inCidr("192.0.2.10", "192.0.2.0/24")).toBe(true);
	});

	test("rejects an IP outside a single /24", () => {
		expect(inCidr("192.0.3.10", "192.0.2.0/24")).toBe(false);
	});

	test("rejects an IPv6 address", () => {
		expect(inCidr("2001:db8::1", "192.0.2.0/24")).toBe(false);
	});
});

describe("inCidrAny", () => {
	test("matches an IP in a single-element list", () => {
		expect(inCidrAny("192.0.2.10", "192.0.2.0/24")).toBe(true);
	});

	test("rejects an IP outside a single-element list", () => {
		expect(inCidrAny("192.0.3.10", "192.0.2.0/24")).toBe(false);
	});

	test("matches an IP in the first CIDR of a comma-separated list", () => {
		expect(inCidrAny("192.0.2.10", "192.0.2.0/24, 10.0.0.0/8")).toBe(true);
	});

	test("matches an IP in a later CIDR of a comma-separated list", () => {
		expect(inCidrAny("10.1.2.3", "192.0.2.0/24, 10.0.0.0/8")).toBe(true);
	});

	test("rejects an IP outside all CIDRs in a comma-separated list", () => {
		expect(inCidrAny("8.8.8.8", "192.0.2.0/24, 10.0.0.0/8")).toBe(false);
	});

	test("rejects an invalid IP", () => {
		expect(inCidrAny("not-an-ip", "192.0.2.0/24")).toBe(false);
	});

	test("returns false for an empty list", () => {
		expect(inCidrAny("192.0.2.10", "")).toBe(false);
	});

	test("returns false for an IPv6 IP even with multiple CIDRs", () => {
		expect(inCidrAny("2001:db8::1", "192.0.2.0/24, 10.0.0.0/8")).toBe(false);
	});

	test("tolerates surrounding whitespace and mixed separators", () => {
		expect(inCidrAny("192.0.2.10", " 192.0.2.0/24 , 10.0.0.0/8 ")).toBe(true);
	});
});
