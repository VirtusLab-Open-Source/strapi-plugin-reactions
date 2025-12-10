export default () => ({
	'Query.reactionKinds': { auth: false },
	'Query.reactionsList': { auth: false },
	'Query.reactionsListPerUser': { auth: false },
	'Query.reactionsListAllPerUser': { auth: false },
	'Mutation.reactionSet': { auth: false },
	'Mutation.reactionUnset': { auth: false },
	'Mutation.reactionToggle': { auth: false },
});
