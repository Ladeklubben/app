export interface AuthData {
	email: string;
	hashed_password: string;
	token: string;
}

export interface GuestGroupsData {
	DISCOUNT: {
		stations: string[];
		[stationId: string]: number | string[];
	};
	FREE: {
		stations: string[];
	};
	FLAT: {
		stations: string[];
	};
}

export interface UserInfo {
	userinfo: any;
	groups: any;
	guestgroups: GuestGroupsData;
	group_invites: any[];
	stations: any[];
	payment: any;
}
