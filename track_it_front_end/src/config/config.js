const LIST_TYPES = {
	TODO: 'backlog',
	DOING: 'doing',
	REVIEW: 'review',
	DONE: 'done',
};

const LIST_TYPES_COPY = {
	[LIST_TYPES.TODO]: 'backlog',
	[LIST_TYPES.DOING]: 'doing',
	[LIST_TYPES.REVIEW]: 'review',
	[LIST_TYPES.DONE]: 'done',
};

export { LIST_TYPES, LIST_TYPES_COPY };
