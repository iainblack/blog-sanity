export function cleanString(input?: string) {
    if(!input) {
        return '';
    }
    return input.replace(/[^ -~]+/g, '');
}