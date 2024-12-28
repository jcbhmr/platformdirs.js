// Stub of to https://docs.python.org/3/library/configparser.html.
// Must parse files like https://github.com/search?q=path%3Auser-dirs.dirs&type=code.

/*
# comment
[section]
key = value
*/

/*
# skeleton ~/.config/user-dirs.dirs
XDG_DESKTOP_DIR="$HOME/.local/share/Desktop"
XDG_DOCUMENTS_DIR="$HOME/Dropbox"
XDG_DOWNLOAD_DIR="$HOME/Downloads"
XDG_MUSIC_DIR="$HOME/Music"
XDG_PICTURES_DIR="$HOME/Pictures"
*/

export class ConfigParser {
	data: Record<string, Record<string, string>> | null = null;

	readString(input: string) {
		const data: Record<string, Record<string, string>> = {};
		let sectionName = "";
		for (const line of input.split(/\r?\n/g)) {
			if (line.startsWith("#")) {
				continue;
			}

			if (line.trim() === "") {
				continue;
			}

			const match = line.match(/^\[(.*)\]$/);
			if (match != null) {
				sectionName = match[1];
				continue;
			}

			data[sectionName] ??= {};
			const match2 = line.split("=", 2);
			if (match2 == null) {
				continue;
			}

			const key = match2[1].trim();
			const value = match2[2].trim();
			data[sectionName][key] = value;
		}
		this.data = data;
	}

	get(key: string): Record<string, string> | undefined {
		if (this.data === null) {
			return undefined;
		}
		if (Object.hasOwn(this.data, key)) {
			return this.data[key];
		}
		return undefined;
	}
}
