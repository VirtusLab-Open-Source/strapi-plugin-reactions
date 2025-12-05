export default () => ({
	'Query.reactionKinds': { auth: false },
	'Query.reactionsList': { auth: false },
	'Query.reactionsListPerUser': { auth: false },
	'Mutation.reactionSet': { auth: true },
	'Mutation.reactionUnset': { auth: true },
	'Mutation.reactionToggle': { auth: true },
});
