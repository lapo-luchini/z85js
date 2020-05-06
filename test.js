#!/usr/bin/env node
'use strict';

const Z85 = require('./z85.js');

const tests = [
    // https://rfc.zeromq.org/spec/32/
    ['864FD26FB559F75B', 'hex', 'HelloWorld', 'Hello, world'],
    // http://api.zeromq.org/czmq3-0:zarmour
    ['', 'ascii', '', 'Empty string'],
    ['foob', 'ascii', 'w]zP%', 'zarmor#1'],
    ['foobar!!', 'ascii', 'w]zP%vr9Im', 'zarmor#2'],
    ['4E6F87E2FB6EB22A1EF5E257B75D79124949565F0B8B36A878A4F03111C96E0B', 'hex', 'ph+{E}!&X?9}!I]W{sm(nL8@&3Yu{wC+<*-5Y[[#', 'zarmor#3'],
    // https://github.com/zeromq/rfc/blob/master/src/spec_32.c
    ['8E0BDD697628B91D8F245587EE95C5B04D48963F79259877B49CD9063AEAD3B7', 'hex', 'JTKVSB%%)wK0E.X)V>+}o?pNmC{O&4W4b!Ni{Lh6', 'spec_32'],
    // my own
    ['01',               'hex', '0r',         'my1'],
    ['0102',             'hex', '0rJ',        'my2'],
    ['010203',           'hex', '0rJu',       'my3'],
    ['01020304',         'hex', '0rJua',      'my4'],
    ['0102030405',       'hex', '0rJua1P',    'my5'],
    ['010203040506',     'hex', '0rJua1Qj',   'my6'],
    ['01020304050607',   'hex', '0rJua1Qkh',  'my7'],
    ['0102030405060708', 'hex', '0rJua1Qkhq', 'my8'],
];

const exceptions = [
    ['a_b', "Character '_' in position 2 is not valid Z85", 'invalid ASCII'],
    ['12Ø', "Character 'Ø' in position 3 is not valid Z85", 'invalid Unicode'],
];

let errors = 0;
function state(correct) {
    if (!correct) ++errors;
    return correct ? '\x1B[1m\x1B[32mOK\x1B[39m\x1B[22m ' : '\x1B[1m\x1B[31mKO\x1B[39m\x1B[22m ';
}

tests.forEach(t => {
    let input = Buffer.from(t[0], t[1]),
        expected = t[2],
        comment = t[3],
        result = null,
        back = null;
    try {
        result = Z85.encode(input);
    } catch (e) {
        result = 'Exception:\n' + e;
    }
    try {
        back = Buffer.from(Z85.decode(result));
    } catch (e) {
        console.log(e.stack);
    }
    console.log(state(result == expected) + state(input.equals(back)) + comment);
    if (result != expected)
        console.log(result);
});

exceptions.forEach(t => {
    let input = t[0],
        expected = t[1],
        comment = t[2],
        result = false;
    try {
        Z85.decode(input);
    } catch (e) {
        result = e.message;
    }
    console.log(state(result == expected) + '   ' + comment);
    if (result != expected)
        console.log(result);
});

process.exit(errors);
