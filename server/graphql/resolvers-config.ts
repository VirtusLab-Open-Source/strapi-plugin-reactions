export = () => ({
	'Query.reactionKinds': { auth: false },
	'Query.reactionsListAll': { auth: false },
	'Query.reactionsListPerUser': { auth: true },
	'Mutation.reactionSet': { auth: true },
	'Mutation.reactionUnset': { auth: true },
	'Mutation.reactionToggle': { auth: true },
});
