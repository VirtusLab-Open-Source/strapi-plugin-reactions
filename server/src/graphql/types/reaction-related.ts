export default ({ strapi, nexus, config }: any) => {
	const related = config?.gql?.reactionRelated;
	const name = "ReactionRelated";

	if (related?.length) {
		return nexus.unionType({
			name,
			definition(t: any) {
				t.members(...related)
			},
			resolveType: (item: { uid: string }) => {
				return strapi.contentTypes[item.uid]?.globalId
			}
		});
	}
	
	return nexus.objectType({
		name,
		definition(t: any) {
			t.int("id")
			t.string("documentId")
			t.string("locale")
		}
	})
}