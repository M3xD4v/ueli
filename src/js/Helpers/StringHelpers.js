import leven from 'leven'

export default class StringHelpers {
    stringContainsSubstring(stringToSearch, substring) {
        let wordsOfSubstring = this.splitStringToArray(substring.toLowerCase())
        stringToSearch = stringToSearch.split(' ').join('').toLowerCase()

        for (let word of wordsOfSubstring) {
            if (this.stringIsEmptyOrWhitespaces(word))
                continue
            else if (stringToSearch.indexOf(word) === -1)
                return false
        }

        return true
    }

    getWeight(programNameWithExtension, userInput) {
        let results = []
        let stringToSearchWords = this.splitStringToArray(programNameWithExtension)
        let valueWords = this.splitStringToArray(userInput)

        for (let word of stringToSearchWords)
            for (let value of valueWords) {
                let levenshteinDistance = leven(word, value)
                let result = word.startsWith(value)
                    ? (levenshteinDistance / 4)
                    : levenshteinDistance

                results.push(result)
            }

        return this.getAvg(results)
    }

    getAvg(numbers) {
        let sum = 0

        for (let value of numbers)
            sum = sum + value

        return sum / numbers.length
    }

    stringIsEmptyOrWhitespaces(string) {
        return string === undefined || string.replace(/\s/g, '').length === 0
    }

    splitStringToArray(string) {
        return string.split(/\s+/)
    }
}