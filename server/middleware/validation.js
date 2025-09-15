// Middleware to validate drug input data

function validateDrugInput(req, res, next) {
	const { name, dosage, card, pack, perDay } = req.body;
	const errors = [];

	// a. Name has length more than five
	if (!name || name.length <= 5) {
		errors.push('Name must be longer than 5 characters.');
	}

	// b. Dosage follows the format: XX-morning,XX-afternoon,XX-night (X is digit)
	const dosageRegex = /^\d{2}-morning,\d{2}-afternoon,\d{2}-night$/;
	if (!dosage || !dosageRegex.test(dosage)) {
		errors.push('Dosage must follow the format: XX-morning,XX-afternoon,XX-night.');
	}

	// c. Card is more than 1000
	if (typeof card !== 'number' || card <= 1000) {
		errors.push('Card must be greater than 1000.');
	}

	// d. Pack is more than 0
	if (typeof pack !== 'number' || pack <= 0) {
		errors.push('Pack must be greater than 0.');
	}

	// e. PerDay is more than 0 and less than 90
	if (typeof perDay !== 'number' || perDay <= 0 || perDay >= 90) {
		errors.push('PerDay must be greater than 0 and less than 90.');
	}

	if (errors.length > 0) {
		return res.status(400).json({ errors });
	}
	next();
}

module.exports =  validateDrugInput ;