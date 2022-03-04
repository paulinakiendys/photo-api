/**
 * User model
 */

module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'users',
		albums() {
			return this.hasMany('Album');
		},
		photos() {
		return this.hasMany('Photo');
	}
}, {
		hashSaltRounds: 10,

		async fetchById(id, fetchOptions = {}) {
			return await new this({ id }).fetch(fetchOptions);
		},

		async login(email, password) {
			// find user based on the email (bail if no such user exists)
			const user = await new this({ email }).fetch({ require: false });
			if (!user) {
				return false;
			}
			const hash = user.get('password');

			// hash the incoming cleartext password using the salt from the db
			// and compare if the generated hash matches the db-hash
			const result = await bcrypt.compare(password, hash);
			if (!result) {
				return false;
			}

			// all is well, return user
			return user;
		}
	});
};