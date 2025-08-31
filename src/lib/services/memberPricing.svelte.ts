import { writable } from "svelte/store";
import type { GuestGroupsData, UserInfo } from "$lib/types/auth.types";
import type { MemberPriceSetup } from "$lib/types/publicCharger.types";
import { get } from "$lib/services/api";

export const guestGroups = writable<GuestGroupsData | null>(null);
export const memberPriceMap = $state({
	map: new Map<string, MemberPriceSetup>(),
});

/**
 * Fetches user information including guest groups from the API
 */
export async function fetchUserInformation(): Promise<UserInfo | null> {
	try {
		const userInfo = await get("/user/information");

		// Update guest groups store
		if (userInfo.guestgroups) {
			guestGroups.set(userInfo.guestgroups);
			updateMemberPriceMap(userInfo.guestgroups);
		}

		return userInfo;
	} catch (error) {
		console.error("Failed to fetch user information:", error);
		return null;
	}
}

/**
 * Updates the member price map based on guest groups data
 * Mimics the QML update_groups function logic
 */
function updateMemberPriceMap(guestGroupsData: GuestGroupsData) {
	const newPriceMap = new Map<string, MemberPriceSetup>();

	// Create a set of all stations that have special pricing
	const allStations = new Set<string>();

	// Add all stations from each group type
	guestGroupsData.DISCOUNT.stations.forEach(station => allStations.add(station));
	guestGroupsData.FLAT.stations.forEach(station => allStations.add(station));
	guestGroupsData.FREE.stations.forEach(station => allStations.add(station));

	// Create member price setup for each station
	allStations.forEach(stationId => {
		const isFlat = guestGroupsData.FLAT.stations.includes(stationId);
		const isFree = guestGroupsData.FREE.stations.includes(stationId);
		const hasDiscount = guestGroupsData.DISCOUNT.stations.includes(stationId);

		let discountTariff = 0;
		let tariffPct = 0;

		if (hasDiscount && typeof guestGroupsData.DISCOUNT[stationId] === 'number') {
			discountTariff = guestGroupsData.DISCOUNT[stationId] as number;
			discountTariff = Math.max(0, Math.min(discountTariff, 100));
			// Only set tariff_pct if not flat or free (mimics QML logic)
			if (!isFlat && !isFree) {
				tariffPct = discountTariff;
			}
		}

		const memberPriceSetup: MemberPriceSetup = {
			stationid: stationId,
			tariff_pct: tariffPct,
			discount_tariff: discountTariff,
			flat: isFlat,
			free: isFree,
		};

		newPriceMap.set(stationId, memberPriceSetup);
	});

	memberPriceMap.map = newPriceMap;
}

/**
 * Gets member price setup for a specific station
 * Returns default (no discount) if station not found
 */
export function getMemberPriceSetup(stationId: string): MemberPriceSetup {
	const memberPrice = memberPriceMap.map.get(stationId);

	if (memberPrice) {
		return memberPrice;
	}

	// Return default member price (no discounts) - mimics no_group_default in QML
	return {
		tariff_pct: 0,
		discount_tariff: 0,
		flat: false,
		free: false,
	};
}

/**
 * Clears all member pricing data (for logout)
 */
export function clearMemberPricing() {
	guestGroups.set(null);
	memberPriceMap.map = new Map();
}