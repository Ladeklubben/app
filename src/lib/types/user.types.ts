export interface UserInfo {
	email: string;
	companyName: string;
	bankAccount: string;
	name: string;
	companyID: string;
	city: string;
	role: string;
	street: string;
	zip: string;
}

export interface Location {
	brief: string;
	address: string;
	city: string;
	zip: string;
	latitude: number;
	longitude: number;
}

export interface ChargerType {
	isSmart: boolean;
	info: Record<string, any> | {
		model?: string;
		vendor_name?: string;
		serial_number?: string;
		brand?: string;
		power?: string;
		connector?: string;
	};
}

export interface TimeSlot {
	days: number[];
	start: number;
	interval: number;
}

export interface ListPrice {
	nominal: number;
	minimum: number;
	fallback: number;
	valuta: string;
	follow_spot: number;
}

export interface Station {
	location: Location;
	type: ChargerType;
	id: string;
	alwayson: TimeSlot[];
	openhours: TimeSlot[];
	listprice: ListPrice;
	online: [number, boolean];
}

export interface GroupInfo {
	title: string;
	tariff: string;
	brief: string;
}

export interface Group {
	info: GroupInfo;
	stations: string[];
	memberscount: number;
}

export interface Groups {
	FREE: Group[];
	DISCOUNT: Group[];
	FLAT: Group[];
}

export interface DiscountGuestGroup {
	stations: string[];
	[stationId: string]: string | number | string[];
}

export interface GuestGroups {
	DISCOUNT: DiscountGuestGroup;
	FREE: {
		stations: string[];
	};
	FLAT: {
		stations: string[];
	};
}

export interface UserMessage {
	userinfo: UserInfo;
	stations: Station[];
	groups: Groups;
	group_invites: any[];
	guestgroups: GuestGroups;
}
