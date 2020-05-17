export default {
	name: 'general',
	data() {
		return {
			modalVisible: false
		}
	},
	methods: {
		toggleModal(boolean) {
			console.log('boolean:', boolean);
			this.modalVisible = boolean;
		},
	}
}