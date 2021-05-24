const ParseDate = require('./ParseDate');

test('ParseDate', () => {
    expect(ParseDate('Сегодня в 21:01')).toBe('2021-05-24T18:01:00.000Z'); // valid but not necessary (ne obyazatelno UTC)
});

test('ParseDate', () => {
    expect(ParseDate('Вчера в 20:05')).toBe('2021-05-23T17:05:00.000Z');
});

test('ParseDate', () => {
    expect(ParseDate('14 мая в 13:44')).toBe('2021-05-14T10:44:00.000Z');
});

test('ParseDate', () => {
    expect(ParseDate('Сегодня в 00:05')).toBe('2021-05-23T21:05:00.000Z');
});

test('ParseDate', () => {
    expect(ParseDate('23 января в 10:07')).toBe('2021-01-23T07:07:00.000Z');
});

test('ParseDate', () => {
    expect(ParseDate('9 декабря в 10:07')).toBe('2021-12-09T07:07:00.000Z');
});