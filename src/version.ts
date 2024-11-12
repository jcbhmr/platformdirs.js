import packageJSON from "../package.json" with { type: "json" };

/**
 * And one with numbered capture groups instead (so cg1 = major, cg2 = minor,
 * cg3 = patch, cg4 = prerelease and cg5 = buildmetadata) that is compatible
 * with ECMA Script (JavaScript), PCRE (Perl Compatible Regular Expressions,
 * i.e. Perl, PHP and R), Python and Go.
 *
 * See: https://regex101.com/r/vkijKf/1/
 *
 * @license CC-BY-3.0
 * @see https://semver.org/
 */
const semverRegex =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const version = packageJSON.version;
const match = packageJSON.version.match(semverRegex);
if (!match) {
	throw new Error("unreachable");
}
export const versionTuple = [
	+match[0],
	+match[1],
	+match[2],
	...match.slice(3),
];
