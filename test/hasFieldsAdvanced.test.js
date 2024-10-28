import test from 'ava';
import hasFieldsAdvanced from '../utils/hasFieldsAdvanced.js';

test('throws error if fields is not an object', t => {
    const error = t.throws(() => {
        hasFieldsAdvanced({}, null);
    }, { instanceOf: Error });
    t.is(error.message, 'Fields must be an object');
});

test('returns true for empty fields', t => {
    const result = hasFieldsAdvanced({ a: 1, b: 2 }, {});
    t.true(result);
});

test('validates fields with $and operator', t => {
    const obj = { a: 5, b: 10 };
    const fields = { $and: [{ $gt: { a: 3 } }, { $lt: { b: 15 } }] };
    const result = hasFieldsAdvanced(obj, fields);
    t.true(result);
});

test('validates fields with $or operator', t => {
    const obj = { a: 2, b: 10 };
    const fields = { $or: [ { a: 5 }, { b: 15 }, { a: 2 }] };
    const result = hasFieldsAdvanced(obj, fields);
    t.true(result);
});

test('validates fields with $exists operator', t => {
    const obj = { a: 5, b: undefined };
    const fields = { $exists: { a: true, c: false } };
    const result = hasFieldsAdvanced(obj, fields);
    t.true(result);
});

test('validates comparison operators', t => {
    const obj = { a: 10, b: 20 };
    const fields = { $gt: { a: 5 }, $lt: { b: 30 } };
    const result = hasFieldsAdvanced(obj, fields);
    t.true(result);
});

test('returns false for invalid fields', t => {
    const obj = { a: 1, b: 2 };
    const fields = { $gt: { a: 2 } };
    const result = hasFieldsAdvanced(obj, fields);
    t.false(result);
});

test('validates fields with $type operator', t => {
    const obj = { a: 5, b: 'test' };
    const fields = { $type: { a: 'number', b: 'string' } };
    const result = hasFieldsAdvanced(obj, fields);
    t.true(result);
});

test('validates regex conditions', t => {
    const obj = { name: 'Alice' };
    const fields = { $regex: { name: /^A/ } };
    const result = hasFieldsAdvanced(obj, fields);
    t.true(result);
});

test('validates array conditions', t => {
    const obj = { tags: ['js', 'ava', 'test'] };
    const fields = { $arrinc: { tags: ['ava'] } };
    const result = hasFieldsAdvanced(obj, fields);
    t.true(result);
});
