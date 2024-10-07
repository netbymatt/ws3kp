const locationCleanup = (input) => {
	// regexes to run
	const regexes = [
		// "Chicago / West Chicago", removes before slash
		/^[ A-Za-z]+ \/ /,
		// "Chicago/Waukegan" removes before slash
		/^[ A-Za-z]+\//,
		// "Chicago, Chicago O'hare" removes before comma
		/^[ A-Za-z]+, /,
	];

	// run all regexes
	return regexes.reduce((value, regex) => value.replace(regex, ''), input);
};

const shortenCurrentConditions = (_condition) => {
	let condition = _condition;
	condition = condition.replace(/Light/, 'L');
	condition = condition.replace(/Heavy/, 'H');
	condition = condition.replace(/Partly/, 'P');
	condition = condition.replace(/Mostly/, 'M');
	condition = condition.replace(/Few/, 'F');
	condition = condition.replace(/Thunderstorm/, 'T\'storm');
	condition = condition.replace(/ in /, '');
	condition = condition.replace(/Vicinity/, '');
	condition = condition.replace(/ and /, ' ');
	condition = condition.replace(/Freezing Rain/, 'Frz Rn');
	condition = condition.replace(/Freezing/, 'Frz');
	condition = condition.replace(/Unknown Precip/, '');
	condition = condition.replace(/L Snow Fog/, 'L Snw/Fog');
	condition = condition.replace(/ with /, '/');
	return condition;
};

export {
	locationCleanup,
	shortenCurrentConditions,
};
