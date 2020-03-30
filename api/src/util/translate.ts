export default (
    textId: number,
    defaultValue: string,
    replacements: (string | number)[] = [],
    locale: string = 'ru'
): string => {
    let resultText = defaultValue;

    replacements.forEach((replacement) => {
        resultText = resultText.replace('%s', replacement.toString());
    });

    return resultText;
};
