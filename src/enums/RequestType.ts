export enum RequestUpdate {
	SENDER = 'sender',
	RECEIVER = 'receiver',
	NAME = 'name',
	TITLE = 'title',
	DESCRIPTION = 'description',
	STATUS = 'status',
	VISIBILITY = 'visibility'
}

export enum Visibility {
	PRIVATE = 'private',
	PUBLIC = 'public'
}

export enum Status {
	PENDING = 'pending',
	APPROVED = 'approved',
	COMPLETED = 'completed',
	REJECTED = 'rejected'
}
