// for nightly build
const pkg = require("../package.json");
const exec = require("child_process").exec;

// get datetime as string
function getDatetime() {
	// convert to 2 digit
	const get2digit = val => (String(val).length === 1 ? `0${val}` : val);

	// get 'YYYY-MM-DD' formatted value
	const date = new Date();

	return [
		date.getFullYear(),
		get2digit(date.getMonth() + 1),
		get2digit(date.getDate()),
		get2digit(date.getHours()),
		get2digit(date.getMinutes()),
		get2digit(date.getSeconds())
	].join("");
}

// is deploy build? (The deploy is intended to be ran from Travis CI)
const deploy = process.env.DEPLOY_NIGHTLY;
// const token = process.env.GH_TOKEN;

// set version for nightly
const version = pkg.version.replace(/snapshot/, `nightly-${getDatetime()}`);
let cmd = `cross-env NIGHTLY=${version} npm run build:`;

// build command
const build = {
	production: `${cmd}production`,
	packaged: `${cmd}packaged`,
	theme: `${cmd}theme`,
	plugin: `${cmd}plugin`
};

if (deploy) {
	build.push = `git commit -a -m "skip: ${version} build [skip ci]"`;
}

cmd = Object.values(build);

console.log(`***** Starting build v${version} *****\r\n> ${cmd.join("\r\n> ")}`);

exec(cmd.join(" && "), (error, stdout, stderr) => {
	if (error || stderr) {
		console.error(error, stderr);
	} else {
		console.log(`***** ${stdout} : Finished successfully! *****`);
	}
});
