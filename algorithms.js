function binaryIndexOf(searchElement, data) {
    var minIndex = 0;
    var maxIndex = data.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
    currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = data[currentIndex];
        if (strcmp(currentElement.name, searchElement) == -1) {
        minIndex = currentIndex + 1;
        }
        else if (strcmp(currentElement.name, searchElement) == 1) {
        maxIndex = currentIndex - 1;
        }
        else {
        return currentIndex;
        }
    }
    return -1;
}
function strcmp(a, b) {
    if (a.toString() < b.toString()) return -1;
    if (a.toString() > b.toString()) return 1;
    return 0;
}
function subSearch(data, qur){
	var results = [];
	var sq = qur.toString();
	for (var i = 0; i < data.length; i++){
		if (data[i].name.indexOf(sq) > -1){
			results.push(data[i]);
		}
	}
	return results;
}

module.exports = { binaryIndexOf, subSearch }
