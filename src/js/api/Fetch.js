export default class Fetch {
    async loadJSON(url) {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return console.error(response.status);
    }
}
